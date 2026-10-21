import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { bookingPlugin } from './bookingPlugin.ts'
import { almatyToday, availableBookingDates, nextBookingDate, validBookingDate } from '../src/booking.ts'

test('local bookings validate dates, survive reload and reject concurrent duplicates', async () => {
  const originalDirectory = process.cwd()
  const directory = await mkdtemp(join(tmpdir(), 'autocraft-booking-test-'))
  process.chdir(directory)
  let handler
  function connect() {
    bookingPlugin().configureServer({ middlewares: { use(value) { handler = value } } })
  }
  connect()
  const server = createServer((req, res) => handler(req, res, () => { res.statusCode = 404; res.end() }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}/api/bookings`
  const booking = { date: nextBookingDate(), time: '09:00' }
  const post = data => fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  try {
    assert.equal(validBookingDate(almatyToday()), false)
    assert.equal(validBookingDate('2027-02-30'), false)
    assert.equal(validBookingDate('2027-01-03'), false) // Sunday
    assert.equal(validBookingDate(booking.date), true)
    const dates = availableBookingDates()
    assert.equal(dates.length, 7)
    assert.equal(new Set(dates).size, 7)
    for (const date of dates) {
      assert.equal(validBookingDate(date), true)
      assert.notEqual(new Date(`${date}T12:00:00Z`).getUTCDay(), 0)
    }
    const beyond = new Date(`${dates.at(-1)}T12:00:00Z`)
    beyond.setUTCDate(beyond.getUTCDate() + 1)
    const beyondDate = beyond.toISOString().slice(0, 10)
    assert.equal(validBookingDate(beyondDate), false)
    assert.equal((await post({ ...booking, date: beyondDate })).status, 400)
    assert.equal((await fetch(`${base}?date=${beyondDate}`)).status, 400)
    assert.deepEqual(await (await fetch(`${base}?date=${booking.date}`)).json(), { occupied: [] })
    assert.equal((await post({ ...booking, date: almatyToday() })).status, 400)
    assert.equal((await post({ ...booking, time: '13:00' })).status, 400)
    assert.equal((await post({ date: booking.date })).status, 400)
    assert.equal((await post({ time: booking.time })).status, 400)
    const responses = await Promise.all([post(booking), post(booking), post(booking)])
    assert.deepEqual(responses.map(response => response.status).sort(), [201, 409, 409])
    connect() // Fresh plugin instance reads the persisted store.
    const availability = await (await fetch(`${base}?date=${booking.date}`)).json()
    assert.deepEqual(availability, { occupied: ['09:00'] })
    assert.equal(JSON.stringify(availability).includes('phone'), false)
    assert.equal((await post({ ...booking, time: '10:00', name: 'Do not store', phone: '+70000000000', vin: 'PRIVATE', description: 'PRIVATE' })).status, 201)
    assert.equal((await post(booking)).status, 409)
    const records = JSON.parse(await readFile(join(directory, '.local-bookings/bookings.json'), 'utf8'))
    for (const record of records) assert.deepEqual(Object.keys(record).sort(), ['createdAt', 'date', 'id', 'time'])
  } finally {
    await new Promise(resolve => server.close(resolve))
    process.chdir(originalDirectory)
    await rm(directory, { recursive: true, force: true })
  }
})
