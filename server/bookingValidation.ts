import { bookingTimes, validBookingDate } from '../src/booking.ts'
import type { BookingRequest } from '../src/booking.ts'

export function parseBooking(input: unknown): BookingRequest | null {
  if (!input || typeof input !== 'object') return null
  const source = input as Record<string, unknown>
  if (typeof source.date !== 'string' || typeof source.time !== 'string') return null
  // Whitelist reservation fields, including for requests from older cached pages.
  const data: BookingRequest = { date: source.date.trim(), time: source.time.trim() }
  if (!validBookingDate(data.date) || !bookingTimes.some(time => time === data.time)) return null
  return data
}
