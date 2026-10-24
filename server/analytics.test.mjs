import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

const source = await readFile(new URL('../src/analytics.ts', import.meta.url), 'utf8')
const ownerSource = await readFile(new URL('../src/ownerMode.ts', import.meta.url), 'utf8')
const ownerJavascript = ts.transpileModule(ownerSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
}).outputText
const javascript = ts.transpileModule(source.replace('import.meta.env.VITE_GA_MEASUREMENT_ID', "'G-TEST123'"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
}).outputText

function fixture(gtag, cookie = '') {
  const timers = new Map()
  let nextTimer = 0
  const window = { gtag, setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer }, clearTimeout(id) { timers.delete(id) } }
  const exports = {}
  class Element {}
  const document = { cookie }
  const ownerExports = {}
  vm.runInNewContext(ownerJavascript, { window, document, exports: ownerExports, URLSearchParams })
  vm.runInNewContext(javascript, { window, exports, Element, document, require: () => ownerExports })
  return { window, exports, Element, timers }
}

test('owner browser sends no GA initialization or events and does not delay WhatsApp', () => {
  const calls = []
  const { exports, timers } = fixture((...args) => calls.push(args), 'other=value; autocraft_owner=1')
  exports.initializeAnalytics()
  let navigations = 0
  exports.trackEvent('contact_phone', { placement: 'header' })
  exports.trackEvent('service_booking_complete', { placement: 'service-booking' }, () => navigations++)
  assert.equal(calls.length, 0)
  assert.equal(timers.size, 0)
  assert.equal(navigations, 1)
})

test('owner links set and clear a persistent same-site cookie without changing unrelated links', () => {
  for (const [mode, expected] of [['on', 'autocraft_owner=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure'], ['off', 'autocraft_owner=; Path=/; Max-Age=0; SameSite=Lax; Secure'], ['unknown', 'existing=1']]) {
    const document = { cookie: 'existing=1' }
    const exports = {}
    const window = { location: { search: `?owner_mode=${mode}`, protocol: 'https:' } }
    vm.runInNewContext(ownerJavascript, { window, document, exports, URLSearchParams })
    exports.initializeOwnerMode()
    assert.equal(document.cookie, expected)
  }
})

test('blocked cookies do not crash the site or report owner mode as saved', () => {
  const document = { get cookie() { throw Error('blocked') }, set cookie(_value) { throw Error('blocked') } }
  const exports = {}
  const window = { location: { search: '?owner_mode=on', protocol: 'https:' } }
  vm.runInNewContext(ownerJavascript, { window, document, exports, URLSearchParams })
  assert.doesNotThrow(() => exports.initializeOwnerMode())
  assert.equal(exports.isOwnerMode(), false)
})

test('booking conversion waits for the tag, navigates only once, and sends no customer data', () => {
  const calls = []
  const { exports, timers } = fixture((...args) => calls.push(args))
  let navigations = 0
  exports.trackEvent('service_booking_complete', { placement: 'service-booking' }, () => navigations++)
  assert.equal(navigations, 0)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'service_booking_complete')
  const parameters = calls[0][2]
  assert.deepEqual(Object.keys(parameters).sort(), ['event_callback', 'event_timeout', 'placement', 'transport_type'])
  const fallback = [...timers.values()][0]
  parameters.event_callback()
  parameters.event_callback()
  fallback()
  assert.equal(navigations, 1)
  assert.equal(timers.size, 0)
})

test('navigation works if analytics is missing, blocked, or never calls back', () => {
  for (const gtag of [undefined, () => { throw new Error('blocked') }, () => {}]) {
    const { exports, timers } = fixture(gtag)
    let navigations = 0
    exports.trackEvent('service_booking_complete', { placement: 'service-booking' }, () => navigations++)
    for (const callback of [...timers.values()]) callback()
    assert.equal(navigations, 1)
  }
})

test('WhatsApp follow-up does not count a second contact, ordinary WhatsApp links still count', () => {
  const calls = []
  const { exports, Element } = fixture((...args) => calls.push(args))
  function event(followup) {
    const link = {
      getAttribute: () => 'https://wa.me/77073648536',
      hasAttribute: name => name === 'data-booking-followup' && followup,
      closest: selector => selector === 'section' ? { id: 'service-booking' } : null,
    }
    const target = new Element()
    target.closest = () => link
    return { target }
  }
  exports.trackContactClick(event(true))
  assert.equal(calls.length, 0)
  exports.trackContactClick(event(false))
  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'contact_whatsapp')
})
