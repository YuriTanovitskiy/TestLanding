import { useLanguage } from '../i18n'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { phones } from '../data/siteData'
import { trackEvent } from '../analytics'

export function RepairRequest() {
  const { t } = useLanguage()
  const [vehicle, setVehicle] = useState('')
  const [unit, setUnit] = useState('Не знаю')
  const [condition, setCondition] = useState('На автомобиле')
  const [symptoms, setSymptoms] = useState('')
  const started = useRef(false)

  function startRequest() {
    if (started.current) return
    started.current = true
    trackEvent('repair_form_start', { placement: 'repair-request' })
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = [
      t('Здравствуйте! Хочу обсудить ремонт в Auto CRAFT KZ.'),
      `${t('Автомобиль')}: ${vehicle.trim() || t('Уточню в переписке')}`,
      `${t('Агрегат')}: ${t(unit)}. ${t(condition)}.`,
      `${t('Симптомы')}: ${symptoms.trim() || t('Уточню в переписке')}`,
    ].join('\n')
    trackEvent('repair_form_whatsapp', { placement: 'repair-request' })
    window.location.assign(`${phones[0].whatsappUrl}?text=${encodeURIComponent(message)}`)
  }

  return (
    <section className="section request-section" id="repair-request" aria-labelledby="request-title">
      <div className="container request-grid">
        <div className="section-heading">
          <p className="eyebrow">{t("Начнём с вашей ситуации")}</p>
          <h2 id="request-title">{t("Что случилось с автомобилем?")}</h2>
          <p className="section-description">{t("Не обязательно знать причину поломки. Расскажите, что заметили, — обсудим с вами следующий шаг.")}</p>
          <p className="section-description">{t("Состав работ и деталей согласовываем после проверки. Стоимость и возможные сроки уточняйте у мастера.")}</p>
        </div>
        <form className="request-form" onSubmit={submitRequest} onChange={startRequest}>
          <label htmlFor="request-vehicle">{t("Марка и модель")} <span>{t("(если знаете)")}</span></label>
          <input id="request-vehicle" name="vehicle" value={vehicle} onChange={(event) => setVehicle(event.target.value)} maxLength={120} placeholder={t("Например, Toyota Camry, 2015")} />
          <div className="request-fields">
            <div><label htmlFor="request-unit">{t("Что нужно проверить?")}</label>
              <select id="request-unit" name="unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option value="Не знаю">{t("Не знаю")}</option><option value="Стартер">{t("Стартер")}</option><option value="Генератор">{t("Генератор")}</option>
              </select>
            </div>
            <div><label htmlFor="request-condition">{t("Где агрегат?")}</label>
              <select id="request-condition" name="condition" value={condition} onChange={(event) => setCondition(event.target.value)}>
                <option value="На автомобиле">{t("На автомобиле")}</option><option value="Уже снят">{t("Уже снят")}</option>
              </select>
            </div>
          </div>
          <label htmlFor="request-symptoms">{t("Что происходит?")} <span>{t("(если можете описать)")}</span></label>
          <textarea id="request-symptoms" name="symptoms" rows={4} value={symptoms} onChange={(event) => setSymptoms(event.target.value)} maxLength={1500} placeholder={t("Например, при запуске слышен щелчок, но двигатель не крутится")} />
          <button className="button button-primary" type="submit">{t("Продолжить в WhatsApp")}</button>
          <p className="request-note">{t("Откроется WhatsApp с готовым текстом. Проверьте и отправьте сообщение мастеру — до этого обращение не отправлено.")}</p>
        </form>
      </div>
    </section>
  )
}
