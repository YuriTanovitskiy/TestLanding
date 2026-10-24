import { useState } from 'react'
import { isOwnerMode } from '../ownerMode'
import './OwnerModeNotice.css'

export function OwnerModeNotice() {
  const owner = isOwnerMode()
  const requested = new URLSearchParams(window.location.search).get('owner_mode')
  const [visible, setVisible] = useState(owner || requested === 'on' || requested === 'off')
  if (!visible) return null
  const message = requested === 'on' && !owner
    ? 'Не удалось включить режим владельца. Разрешите cookies для этого сайта и откройте ссылку ещё раз.'
    : owner ? 'Режим владельца включён. Ваши посещения в этом браузере не отправляются в аналитику.'
      : 'Режим владельца выключен. Посещения снова учитываются в аналитике.'
  return (
    <aside className="owner-mode-notice" aria-label="Режим владельца">
      <p role="status">{message}</p>
      <button type="button" onClick={() => setVisible(false)} aria-label="Закрыть уведомление">×</button>
    </aside>
  )
}
