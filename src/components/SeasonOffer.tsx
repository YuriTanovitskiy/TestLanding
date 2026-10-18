import { useLanguage } from '../i18n'

export function SeasonOffer() {
  const { t } = useLanguage()

  return (
    <section className="season-offer-section" aria-labelledby="season-offer-title">
      <div className="container">
        <div className="season-offer">
          <img className="season-offer-art" src="/images/promotions/winter-road-2026-2027.jpg" alt="" width="1774" height="887" loading="lazy" />
          <div className="season-offer-content">
            <p className="season-offer-season">{t('Сезон')} <span>202<strong>6</strong>–202<strong>7</strong></span></p>
            <h2 id="season-offer-title">{t('Секретная скидка')}</h2>
            <div className="season-offer-terms">
              <p className="season-offer-lead">{t('Получите окончательное предложение по цене ремонта от менеджера. Затем назовите секретный код «67» и получите скидку 5% от уже согласованной цены.')}</p>
              <p className="season-offer-details">{t('Скидка действует на всю сумму ремонта, включая детали.')}</p>
              <p className="season-offer-dates">{t('С 15 октября 2026 по 15 апреля 2027 включительно.')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
