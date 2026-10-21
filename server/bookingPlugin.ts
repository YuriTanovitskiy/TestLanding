import type { Plugin, Connect } from 'vite'
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { validBookingDate } from '../src/booking.ts'
import type { BookingRequest } from '../src/booking.ts'
import { parseBooking } from './bookingValidation.ts'

interface SavedBooking extends BookingRequest { id: string; createdAt: string }

// Local preview server only. One process owns the store and serializes all writes.
export function bookingPlugin(): Plugin {
  const directory = resolve('.local-bookings')
  const file = resolve(directory, 'bookings.json')
  let queue: Promise<void> = Promise.resolve()
  async function readBookings(): Promise<SavedBooking[]> {
    try { return JSON.parse(await readFile(file, 'utf8')) as SavedBooking[] }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  }
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/bookings') return next()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    function reply(status: number, data: unknown) { res.statusCode = status; res.end(JSON.stringify(data)) }
    if (req.method === 'GET') {
      const date = new URL(req.url, 'http://localhost').searchParams.get('date') ?? ''
      if (!validBookingDate(date)) return reply(400, { error: 'Выберите один из ближайших 7 рабочих дней, начиная с завтрашнего дня, кроме воскресенья.' })
      void readBookings().then(items => reply(200, { occupied: items.filter(item => item.date === date).map(item => item.time) }))
        .catch(() => reply(500, { error: 'Не удалось загрузить свободное время. Попробуйте ещё раз.' }))
      return
    }
    if (req.method !== 'POST') return reply(405, { error: 'Метод недоступен.' })
    if (req.headers['sec-fetch-site'] === 'cross-site' || !req.headers['content-type']?.startsWith('application/json')) {
      return reply(403, { error: 'Заполните форму на сайте.' })
    }
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
      if (Buffer.byteLength(body) > 16000) req.destroy()
    })
    req.on('end', () => {
      let data: BookingRequest
      try {
        const parsed = parseBooking(JSON.parse(body) as unknown)
        if (!parsed) throw new Error()
        data = parsed
      } catch { return reply(400, { error: 'Проверьте поля формы, дату и время записи.' }) }
      queue = queue.then(async () => {
        const items = await readBookings()
        if (items.some(item => item.date === data.date && item.time === data.time)) {
          return reply(409, { error: 'Это время уже заняли. Выберите другое окно.' })
        }
        const booking: SavedBooking = { ...data, id: randomUUID(), createdAt: new Date().toISOString() }
        await mkdir(directory, { recursive: true })
        await writeFile(`${file}.tmp`, JSON.stringify([...items, booking], null, 2), 'utf8')
        await rename(`${file}.tmp`, file)
        reply(201, { id: booking.id })
      }).catch(() => reply(500, { error: 'Не удалось сохранить запись. Попробуйте ещё раз или свяжитесь с нами.' }))
    })
  }
  return {
    name: 'local-service-bookings',
    configureServer(server) { server.middlewares.use(handler) },
    configurePreviewServer(server) { server.middlewares.use(handler) },
  }
}
