import { bookingTimes, validBookingDate } from '../src/booking.ts'
import type { BookingRequest } from '../src/booking.ts'

export function parseBooking(input: unknown): BookingRequest | null {
  if (!input || typeof input !== 'object') return null
  const source = input as Record<string, unknown>
  const fields = ['date', 'time', 'name', 'phone', 'vehicle', 'year', 'vin', 'description'] as const
  if (!fields.every(field => typeof source[field] === 'string')) return null
  const data = Object.fromEntries(fields.map(field => [field, (source[field] as string).trim()])) as unknown as BookingRequest
  if (!validBookingDate(data.date) || !bookingTimes.some(time => time === data.time) ||
    !data.name || data.name.length > 100 || !data.vehicle || data.vehicle.length > 120 ||
    !/^[+\d\s()-]{10,25}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 10 ||
    data.description.length > 2000 || data.vin.length > 40 ||
    (data.year && (!/^\d{4}$/.test(data.year) || Number(data.year) < 1900 || Number(data.year) > new Date().getFullYear() + 1))) return null
  return data
}
