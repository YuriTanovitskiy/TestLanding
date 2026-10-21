import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { availableBookingDates, bookingTimes, nextBookingDate, validBookingDate } from '../booking'
import type { BookingRequest } from '../booking'
import { phones } from '../data/siteData'

interface Availability { date: string; occupied: string[]; loading: boolean; error: string }

export function ServiceBooking() {
  const [date, setDate] = useState(nextBookingDate)
  const [time, setTime] = useState('')
  const [availability, setAvailability] = useState<Availability>({ date: '', occupied: [], loading: true, error: '' })
  const [refresh, setRefresh] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState<{ url: string; date: string; time: string } | null>(null)
  const validDate = validBookingDate(date)
  const dates = availableBookingDates()
  const ready = validDate && availability.date === date && !availability.loading && !availability.error

  useEffect(() => {
    if (!validBookingDate(date)) return
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`/api/bookings?date=${date}`, { signal: controller.signal })
        if (!response.ok) throw new Error()
        const data = await response.json() as { occupied: string[] }
        if (!Array.isArray(data.occupied)) throw new Error()
        setAvailability({ date, occupied: data.occupied, loading: false, error: '' })
        setTime(current => data.occupied.includes(current) ? '' : current)
      } catch {
        if (!controller.signal.aborted) setAvailability({ date, occupied: [], loading: false, error: 'Не удалось загрузить время. Обновите окна или свяжитесь с нами.' })
      }
    }
    void load()
    const timer = window.setInterval(() => void load(), 15000)
    return () => { controller.abort(); window.clearInterval(timer) }
  }, [date, refresh])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !ready || !time || availability.occupied.includes(time)) return
    const form = new FormData(event.currentTarget)
    const booking: BookingRequest = {
      date, time,
      name: String(form.get('name') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      vehicle: String(form.get('vehicle') ?? '').trim(),
      year: String(form.get('year') ?? '').trim(),
      vin: String(form.get('vin') ?? '').trim(),
      description: String(form.get('description') ?? '').trim(),
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) })
      const result = await response.json() as { id?: string; error?: string }
      if (!response.ok || !result.id) {
        if (response.status === 409) { setTime(''); setRefresh(value => value + 1) }
        throw new Error(result.error || 'Не удалось сохранить запись.')
      }
      const message = [
        'Здравствуйте! Я записался на сервис Auto CRAFT KZ через сайт.',
        `Дата: ${date.split('-').reverse().join('.')}, время: ${time}`,
        `Имя: ${booking.name}`, `Телефон: ${booking.phone}`,
        `Автомобиль: ${booking.vehicle}${booking.year ? `, ${booking.year} г.` : ''}`,
        booking.vin && `Номер кузова / VIN: ${booking.vin}`,
        booking.description && `Неисправность: ${booking.description}`,
        'Акция: при записи онлайн — диагностика агрегатов бесплатно!',
        `Номер записи: ${result.id}`,
      ].filter(Boolean).join('\n')
      const url = `${phones[0].whatsappUrl}?text=${encodeURIComponent(message)}`
      setConfirmation({ url, date, time })
      window.location.assign(url)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Не удалось сохранить запись. Попробуйте ещё раз.')
    } finally { setBusy(false) }
  }

  return (
    <section className="section booking-section" id="service-booking" aria-labelledby="booking-title">
      <div className="container booking-grid">
        <div className="section-heading">
          <p className="eyebrow">Онлайн-запись · Пн–Сб</p>
          <h2 id="booking-title">Записаться на сервис</h2>
          <p className="section-description">Выберите удобный день и время. Онлайн-запись открыта на ближайшие 7 рабочих дней, начиная с завтрашнего дня. Воскресенье — выходной.</p>
          <div className="booking-offer"><span>Акция при записи онлайн</span><strong>Диагностика агрегатов бесплатно!</strong></div>
          <div className="booking-today"><h3>Нужен ремонт сегодня?</h3><p>Принимаем в порядке живой очереди. Уточните загрузку мастерской:</p><a href={phones[0].href}>Позвонить</a><a href={phones[0].whatsappUrl}>Написать в WhatsApp</a></div>
          <p className="request-note booking-demo">Пробная запись: данные сохраняются на локальном сервере этого сайта.</p>
        </div>
        {confirmation ? <div className="request-form booking-success" role="status">
          <p className="eyebrow">Время закреплено за вами</p><h3>Запись сохранена</h3>
          <p>{confirmation.date.split('-').reverse().join('.')} в {confirmation.time}</p>
          <p>Отправьте готовое сообщение в WhatsApp, чтобы мастер получил данные вашей записи. Нажмите «Отправить» в чате.</p>
          <a className="button button-primary" href={confirmation.url}>Отправить запись в WhatsApp</a>
          <p className="request-note">Если WhatsApp не открылся автоматически, нажмите кнопку выше.</p>
        </div> : <form className="request-form booking-form" onSubmit={submit}>
          <fieldset disabled={busy}><legend>1. Дата и время</legend>
            <label htmlFor="booking-date">Дата посещения</label>
            <input id="booking-date" type="date" name="date" value={date} min={dates[0]} max={dates[dates.length - 1]} required onChange={event => { setDate(event.target.value); setTime(''); setError(''); setAvailability({ date: '', occupied: [], loading: true, error: '' }) }} aria-describedby="booking-date-note" />
            <p className="request-note" id="booking-date-note">{validDate ? 'Доступны ближайшие 7 рабочих дней. Воскресенье — выходной. На сегодня — телефон или WhatsApp.' : 'Выберите один из ближайших 7 рабочих дней, начиная с завтрашнего дня, кроме воскресенья.'}</p>
            <div className="booking-times" role="group" aria-label="Время посещения">
              {bookingTimes.map(slot => {
                const occupied = ready && availability.occupied.includes(slot)
                return <button key={slot} type="button" disabled={!ready || occupied} aria-pressed={time === slot} onClick={() => setTime(slot)}>{slot}<span>{occupied ? 'Занято' : time === slot ? 'Выбрано' : 'Выбрать'}</span></button>
              })}
            </div>
            <p className="request-note" aria-live="polite">{!validDate ? '' : availability.error || (!ready ? 'Загружаем свободное время…' : time ? `Выбрано время: ${time}` : availability.occupied.length === bookingTimes.length ? 'Все окна заняты. Выберите другой день.' : 'Выберите свободное время.')}</p>
            {availability.error && <button className="booking-retry" type="button" onClick={() => setRefresh(value => value + 1)}>Обновить окна</button>}
          </fieldset>
          <fieldset disabled={busy}><legend>2. Ваши данные</legend>
            <div className="request-fields">
              <div><label htmlFor="booking-name">Как к вам обращаться *</label><input id="booking-name" name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" placeholder="Ваше имя" /></div>
              <div><label htmlFor="booking-phone">Телефон *</label><input id="booking-phone" name="phone" type="tel" autoComplete="tel" required maxLength={25} pattern="[+0-9\s\(\)\-]{10,25}" placeholder="+7 (___) ___-__-__" /></div>
            </div>
            <label htmlFor="booking-vehicle">Марка и модель автомобиля *</label><input id="booking-vehicle" name="vehicle" required maxLength={120} pattern=".*\S.*" placeholder="Например, Toyota Camry" />
            <div className="request-fields">
              <div><label htmlFor="booking-year">Год выпуска</label><input id="booking-year" name="year" type="number" min="1900" max={new Date().getFullYear() + 1} placeholder="Например, 2015" /></div>
              <div><label htmlFor="booking-vin">Номер кузова или VIN</label><input id="booking-vin" name="vin" maxLength={40} placeholder="Если известен" autoCapitalize="characters" /></div>
            </div>
            <label htmlFor="booking-description">Описание неисправности</label><textarea id="booking-description" name="description" rows={4} maxLength={2000} placeholder="Расскажите, что происходит с автомобилем" />
          </fieldset>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={busy || !ready || !time} type="submit">{busy ? 'Сохраняем запись…' : 'Записаться и перейти в WhatsApp'}</button>
          <p className="request-note">* Обязательные поля. Сначала сохраним запись и закрепим время, затем откроем WhatsApp. Отправьте сообщение мастеру самостоятельно.</p>
        </form>}
      </div>
    </section>
  )
}
