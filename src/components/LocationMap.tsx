import { useLanguage, translateContent } from '../i18n'
import { useState } from 'react'
import { contactDetails as rawContactDetails } from '../data/siteData'

const providers = [
  { id: 'google', label: 'Google Maps', embed: 'https://www.google.com/maps?q=43.341558,76.946094&z=16&output=embed', route: rawContactDetails.googleMapsUrl },
  { id: 'yandex', label: 'Яндекс', embed: rawContactDetails.mapEmbedUrl, route: rawContactDetails.yandexMapsUrl },
  { id: '2gis', label: '2GIS', embed: '/2gis.html', route: rawContactDetails.twoGisUrl },
]


export function LocationMap() {
  const { t, language } = useLanguage()
  const contactDetails = translateContent(rawContactDetails, t)
  const [selected, setSelected] = useState(providers[1])

  return (
    <figure className="hero-map">
      <div className="map-provider-choice" role="group" aria-label={t("Выберите сервис карты")}>
        {providers.map((provider) => (
          <button key={provider.id} type="button" aria-pressed={selected.id === provider.id} onClick={() => setSelected(provider)}>
            {provider.label}
          </button>
        ))}
      </div>
      <iframe
        key={selected.id}
        src={selected.embed ? selected.id === 'google' ? `${selected.embed}&hl=${language}` : selected.embed.replace('lang=ru_RU', language === 'kk' ? 'lang=kk_KZ' : 'lang=ru_RU') : undefined}
        title={`${selected.label}: AutoCraft KZ — ${contactDetails.address}. ${contactDetails.entrance}`}
        width="600"
        height="480"
        loading="lazy"
        allowFullScreen
      />
      <figcaption>
        <strong>{contactDetails.address}</strong>
        <span>{contactDetails.entrance}</span>
        <a href={selected.route} target="_blank" rel="noreferrer">{t('Открыть в')} {selected.label} →</a>
      </figcaption>
    </figure>
  )
}

