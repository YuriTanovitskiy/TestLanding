const cookieName = 'autocraft_owner'

export function isOwnerMode(): boolean {
  try {
    return (document.cookie || '').split(';').some(cookie => cookie.trim() === `${cookieName}=1`)
  } catch { return false }
}

export function initializeOwnerMode(): void {
  const mode = new URLSearchParams(window.location.search).get('owner_mode')
  if (mode !== 'on' && mode !== 'off') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  try {
    document.cookie = `${cookieName}=${mode === 'on' ? '1' : ''}; Path=/; Max-Age=${mode === 'on' ? 31536000 : 0}; SameSite=Lax${secure}`
  } catch { /* The notice explains that cookies must be allowed to persist owner mode. */ }
}
