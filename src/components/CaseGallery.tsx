import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface CaseGalleryProps {
  images: GalleryImage[]
  title: string
  layout?: 'cases' | 'workshop'
}

export function CaseGallery({ images, title, layout = 'cases' }: CaseGalleryProps) {
  const { t } = useLanguage()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const image = selected === null ? null : images[selected]

  useEffect(() => {
    if (selected === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.showModal()
    return () => { document.body.style.overflow = previousOverflow }
  }, [selected])

  function close() {
    dialogRef.current?.close()
    setSelected(null)
  }

  function move(direction: number) {
    setSelected((current) => current === null ? null : (current + direction + images.length) % images.length)
  }

  return (
    <>
      <div className={layout === 'workshop' ? 'photo-strip' : 'case-images'} role="group" aria-label={title}>
        {images.map((item, index) => {
          const thumbnail = <button className="case-photo" type="button" key={item.src} onClick={() => setSelected(index)} aria-label={`${t('Увеличить фото')}: ${item.alt}`}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <span aria-hidden="true">⤢</span>
          </button>
          return layout === 'workshop'
            ? <figure key={item.src}>{thumbnail}<figcaption>{item.caption ?? item.alt}</figcaption></figure>
            : thumbnail
        })}
      </div>
      <dialog
        className="photo-viewer"
        ref={dialogRef}
        aria-label={layout === 'workshop' ? title : `${t('Фотографии ремонта')}: ${title}`}
        onCancel={(event) => { event.preventDefault(); close() }}
        onClick={(event) => { if (event.target === event.currentTarget) close() }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
        }}
      >
        {image && (
          <div className="photo-viewer-content">
            <button className="photo-viewer-close" type="button" onClick={close} aria-label={t('Закрыть фото')} autoFocus>×</button>
            <figure>
              <div className="photo-viewer-image">
                <button className="photo-viewer-photo" type="button" onClick={close} aria-label={t('Закрыть фото')}>
                  <img src={image.src} alt={image.alt} />
                </button>
                {images.length > 1 && <div className="photo-viewer-navigation">
                  <button type="button" onClick={() => move(-1)} aria-label={t('Предыдущее фото')}>←</button>
                  <button type="button" onClick={() => move(1)} aria-label={t('Следующее фото')}>→</button>
                </div>}
              </div>
              <figcaption aria-live="polite">{image.alt} <span>{(selected ?? 0) + 1} / {images.length}</span></figcaption>
            </figure>
          </div>
        )}
      </dialog>
    </>
  )
}
