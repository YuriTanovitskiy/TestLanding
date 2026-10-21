import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

const source = await readFile(new URL('../src/analytics.ts', import.meta.url), 'utf8')
const javascript = ts.transpileModule(source.replace('import.meta.env.VITE_GA_MEASUREMENT_ID', "'G-TEST123'"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
}).outputText

function fixture(gtag) {
  const timers = new Map()
  let nextTimer = 0
  const window = { gtag, setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer }, clearTimeout(id) { timers.delete(id) } }
  const exports = {}
  class Element {}
  vm.runInNewContext(javascript, { window, exports, Element, document: {} })
  return { window, exports, Element, timers }
}

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
