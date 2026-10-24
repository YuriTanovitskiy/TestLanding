import type { PagesFunction } from '@cloudflare/workers-types'

export const onRequest: PagesFunction = async ({ request, next }) => {
  const mode = new URL(request.url).searchParams.get('owner_mode')
  const stored = (request.headers.get('Cookie') || '').split(';').some(cookie => cookie.trim() === 'autocraft_owner=1')
  const owner = mode === 'on' || (mode !== 'off' && stored)
  const response = await next()
  if (!response.headers.get('Content-Type')?.includes('text/html')) return response

  const result = new Response(response.body, response)
  if (mode === 'on' || mode === 'off') {
    result.headers.append('Set-Cookie', `autocraft_owner=${mode === 'on' ? '1' : ''}; Path=/; Max-Age=${mode === 'on' ? 31536000 : 0}; SameSite=Lax; Secure`)
  }
  // Never cache a browser-specific HTML response or let the edge inject its beacon.
  if (owner) result.headers.set('Cache-Control', 'private, no-store, no-transform')
  else if (mode === 'off') result.headers.set('Cache-Control', 'private, no-store')
  if (!owner) return result
  // Pages can also insert the beacon at build time, before this middleware runs.
  return new HTMLRewriter().on('script', {
    element(element) {
      if (element.hasAttribute('data-cf-beacon') || element.getAttribute('src')?.includes('static.cloudflareinsights.com/beacon')) element.remove()
    },
  }).transform(result)
}
