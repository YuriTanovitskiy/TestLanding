import { useState } from 'react'
import { useLanguage } from '../i18n'

interface RepairVideoProps {
  src: string
  title: string
}

export function RepairVideo({ src, title }: RepairVideoProps) {
  const { t } = useLanguage()
  const [started, setStarted] = useState(false)

  return (
    <figure className="repair-video">
      <div className="repair-video-player">
        {started ? (
          <video src={src} controls autoPlay playsInline preload="none" aria-label={title}>
            <a href={src}>{t('Скачать видео')}</a>
          </video>
        ) : (
          <button className="repair-video-cover" type="button" onClick={() => setStarted(true)} aria-label={`${t('Смотреть видео')}: ${title}`}>
            <span className="repair-video-play" aria-hidden="true">▶</span>
            <span>{t('Смотреть видео')}</span>
            <span className="repair-video-duration">0:42</span>
          </button>
        )}
      </div>
      <figcaption><h3>Toyota Camry 70</h3><p>{t('Ремонт генератора')}</p></figcaption>
    </figure>
  )
}
