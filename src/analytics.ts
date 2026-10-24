import type { MouseEvent } from 'react'
import { isOwnerMode } from './ownerMode'

type AnalyticsEvent = 'contact_whatsapp' | 'contact_phone' | 'contact_route' | 'repair_form_start' | 'repair_form_whatsapp' | 'service_booking_complete'
interface EventParameters { placement: string }
interface AnalyticsWindow extends Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

const analyticsWindow = window as AnalyticsWindow
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

export function initializeAnalytics() {
  if (isOwnerMode()) return
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || analyticsWindow.gtag) return
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag = function () {
    // Google tag consumes an Arguments object, matching its official bootstrap snippet.
    // eslint-disable-next-line prefer-rest-params
    analyticsWindow.dataLayer?.push(arguments)
  }
  analyticsWindow.gtag('js', new Date())
  analyticsWindow.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.append(script)
}

export function trackEvent(name: AnalyticsEvent, parameters: EventParameters, onComplete?: () => void) {
  if (isOwnerMode()) { onComplete?.(); return }
  if (!onComplete) {
    analyticsWindow.gtag?.('event', name, { ...parameters, transport_type: 'beacon' })
    return
  }
  if (!analyticsWindow.gtag) { onComplete(); return }
  let completed = false
  const finish = () => {
    if (completed) return
    completed = true
    window.clearTimeout(timer)
    onComplete()
  }
  // Navigation must still work when analytics is blocked or has not loaded.
  const timer = window.setTimeout(finish, 1500)
  try {
    analyticsWindow.gtag('event', name, {
      ...parameters, transport_type: 'beacon', event_callback: finish, event_timeout: 1500,
    })
  } catch { finish() }
}

export function trackContactClick(event: MouseEvent<HTMLDivElement>) {
  if (!(event.target instanceof Element)) return
  const link = event.target.closest('a')
  if (!link) return
  const href = link.getAttribute('href') || ''
  const placement = link.closest('section')?.id ||
    (link.closest('.mobile-contact-bar') ? 'mobile-bar' : 'header')
  if (href.startsWith('tel:')) trackEvent('contact_phone', { placement })
  else if (href.startsWith('https://wa.me/') && !link.hasAttribute('data-booking-followup')) trackEvent('contact_whatsapp', { placement })
  else if (/^https:\/\/(www\.google\.com\/maps|yandex\.com\/maps|2gis\.kz\/)/.test(href)) {
    trackEvent('contact_route', { placement })
  }
}
