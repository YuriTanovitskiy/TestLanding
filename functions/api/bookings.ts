import type { D1Database, PagesFunction } from '@cloudflare/workers-types'
import { validBookingDate } from '../../src/booking.ts'
import { parseBooking } from '../../server/bookingValidation.ts'

interface Env { BOOKINGS_DB: D1Database }

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'GET' && request.method !== 'POST') {
    const response = json(405, { error: 'Метод недоступен.' })
    response.headers.set('Allow', 'GET, POST')
    return response
  }
  if (!env.BOOKINGS_DB) return json(503, { error: 'Онлайн-запись временно недоступна. Свяжитесь с нами по телефону или WhatsApp.' })
  try {
    if (request.method === 'GET') {
      const date = new URL(request.url).searchParams.get('date') ?? ''
      if (!validBookingDate(date)) return json(400, { error: 'Выберите один из ближайших 7 рабочих дней, начиная с завтрашнего дня, кроме воскресенья.' })
      const rows = await env.BOOKINGS_DB.prepare('SELECT time FROM bookings WHERE date = ? ORDER BY time').bind(date).all<{ time: string }>()
      return json(200, { occupied: rows.results.map(row => row.time) })
    }

    const origin = request.headers.get('Origin')
    if (request.headers.get('Sec-Fetch-Site') === 'cross-site' ||
      (origin && origin !== new URL(request.url).origin)) {
      return json(403, { error: 'Заполните форму на сайте.' })
    }
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
      return json(415, { error: 'Заполните форму на сайте.' })
    }
    if (Number(request.headers.get('Content-Length')) > 16000) return json(413, { error: 'Слишком большой запрос.' })
    // Limit the streamed body too: a client may omit Content-Length.
    const reader = request.body?.getReader()
    if (!reader) return json(400, { error: 'Проверьте поля формы.' })
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > 16000) {
        await reader.cancel()
        return json(413, { error: 'Слишком большой запрос.' })
      }
      chunks.push(value)
    }
    const body = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
    let input: unknown
    try { input = JSON.parse(new TextDecoder().decode(body)) as unknown }
    catch { return json(400, { error: 'Проверьте поля формы.' }) }
    const booking = parseBooking(input)
    if (!booking) return json(400, { error: 'Проверьте поля формы, дату и время записи.' })
    const id = crypto.randomUUID()
    // The unique (date, time) constraint makes this atomic, including concurrent requests.
    const result = await env.BOOKINGS_DB.prepare(`
      INSERT INTO bookings (id, date, time, name, phone, vehicle, created_at)
      VALUES (?, ?, ?, '', '', '', ?)
      ON CONFLICT (date, time) DO NOTHING
    `).bind(id, booking.date, booking.time, new Date().toISOString()).run()
    if (result.meta.changes === 0) return json(409, { error: 'Это время уже заняли. Выберите другое окно.' })
    return json(201, { id })
  } catch {
    // Do not return database internals or personal data to the caller.
    return json(503, { error: 'Не удалось обработать запись. Попробуйте ещё раз или свяжитесь с нами.' })
  }
}
