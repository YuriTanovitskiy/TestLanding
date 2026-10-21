export const bookingTimes = ['09:00', '10:00', '11:00', '12:00'] as const

export interface BookingRequest {
  date: string
  time: string
}

export interface BookingDetails extends BookingRequest {
  vehicle: string
  year: string
  vin: string
  description: string
}

export function almatyToday() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Almaty' }).format(new Date())
}

export function availableBookingDates() {
  const date = new Date(`${almatyToday()}T12:00:00Z`)
  const dates: string[] = []
  while (dates.length < 7) {
    date.setUTCDate(date.getUTCDate() + 1)
    if (date.getUTCDay() !== 0) dates.push(date.toISOString().slice(0, 10))
  }
  return dates
}

export function nextBookingDate() {
  return availableBookingDates()[0]
}

export function validBookingDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value && availableBookingDates().includes(value)
}
