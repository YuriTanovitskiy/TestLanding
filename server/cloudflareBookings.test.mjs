import test from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFile } from 'node:fs/promises'
import { onRequest } from '../functions/api/bookings.ts'
import { almatyToday, availableBookingDates } from '../src/booking.ts'

test('Cloudflare API uses the SQL constraint and never exposes customer details', async () => {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(await readFile(new URL('../migrations/0001_bookings.sql', import.meta.url), 'utf8'))
  const db = {
    prepare(sql) {
      const statement = sqlite.prepare(sql)
      return { bind(...values) { return {
        async all() { return { results: statement.all(...values) } },
        async run() { return { meta: { changes: Number(statement.run(...values).changes) } } },
      } } }
    },
  }
  const url = 'https://autocraft.kz/api/bookings'
  const call = (request, env = { BOOKINGS_DB: db }) => onRequest({ request, env })
  const post = (data, headers = {}) => call(new Request(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data),
  }))
  const dates = availableBookingDates()
  const booking = { date: dates[0], time: '09:00' }
  try {
    assert.deepEqual(await (await call(new Request(`${url}?date=${dates[0]}`))).json(), { occupied: [] })
    assert.equal((await call(new Request(url), {})).status, 503)
    assert.equal((await post(booking, { Origin: 'https://other.example' })).status, 403)
    assert.equal((await post(booking, { 'Sec-Fetch-Site': 'cross-site' })).status, 403)
    assert.equal((await post(booking, { 'Content-Type': 'text/plain' })).status, 415)
    assert.equal((await post({ ...booking, date: almatyToday() })).status, 400)
    assert.equal((await post({ ...booking, date: '2099-01-01' })).status, 400)
    assert.equal((await post({ ...booking, time: '13:00' })).status, 400)
    assert.equal((await post({ date: booking.date })).status, 400)
    assert.equal((await post({ time: booking.time })).status, 400)
    const responses = await Promise.all(Array.from({ length: 8 }, () => post(booking)))
    assert.equal(responses.filter(result => result.status === 201).length, 1)
    assert.equal(responses.filter(result => result.status === 409).length, 7)
    const success = responses.find(result => result.status === 201)
    assert.match((await success.json()).id, /^[\da-f-]{36}$/)
    assert.equal(success.headers.get('Cache-Control'), 'no-store')
    const slots = await (await call(new Request(`${url}?date=${dates[0]}`))).json()
    assert.deepEqual(slots, { occupied: ['09:00'] })
    assert.equal(JSON.stringify(slots).includes('phone'), false)
    assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM bookings').get().count, 1)
    assert.equal((await post({ ...booking, time: '10:00', name: 'Do not store', phone: '+70000000000', vehicle: 'PRIVATE', vin: 'PRIVATE', description: "'); DROP TABLE bookings; --" })).status, 201)
    for (const row of sqlite.prepare('SELECT name,phone,vehicle,year,vin,description FROM bookings').all()) {
      for (const value of Object.values(row)) assert.equal(value, '')
    }
    assert.equal((await post({ ...booking, date: dates.at(-1) })).status, 201)
    const tooLate = new Date(`${dates.at(-1)}T12:00:00Z`)
    tooLate.setUTCDate(tooLate.getUTCDate() + 1)
    assert.equal((await post({ ...booking, date: tooLate.toISOString().slice(0, 10) })).status, 400)
    const sunday = new Date(`${dates[0]}T12:00:00Z`)
    while (sunday.getUTCDay() !== 0) sunday.setUTCDate(sunday.getUTCDate() + 1)
    assert.equal((await post({ ...booking, date: sunday.toISOString().slice(0, 10) })).status, 400)
    assert.equal((await call(new Request(url, { method: 'DELETE' }))).status, 405)
    assert.equal((await call(new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' }))).status, 400)
    assert.equal((await post({ ...booking, description: 'x'.repeat(17000) })).status, 413)
    const offline = { prepare() { throw new Error('private database details') } }
    const unavailable = await call(new Request(`${url}?date=${dates[0]}`), { BOOKINGS_DB: offline })
    assert.equal(unavailable.status, 503)
    assert.equal((await unavailable.text()).includes('private database details'), false)
  } finally { sqlite.close() }
})
