import './App.css'
import { useLanguage, translateContent } from './i18n'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { RepairRequest } from './components/RepairRequest'
import { ServiceBooking } from './components/ServiceBooking'
import { ContactIcon } from './components/ContactIcon'
import { LocationMap } from './components/LocationMap'
import { RepairVideo } from './components/RepairVideo'
import { CaseGallery } from './components/CaseGallery'
import { SeasonOffer } from './components/SeasonOffer'
import { trackContactClick } from './analytics'
import {
  contactDetails as rawcontactDetails,
  workshopIntro as rawworkshopIntro,
  phones,
  qualityCriteria as rawqualityCriteria,
  repairCases as rawrepairCases,
  repairSteps as rawrepairSteps,
  servicePhotos as rawservicePhotos,
  serviceTiming as rawserviceTiming,
  symptomGroups as rawsymptomGroups,
} from './data/siteData'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}

function Header() {
  const { t } = useLanguage()
  return (
    <header className="site-header">
      <div className="container header-inner">
        <nav aria-label={t("Основная навигация")}>
          <a href="#prices">{t("Услуги и стоимость")}</a>
          <a href="#repair-request">{t("Обсудить ремонт")}</a>
        </nav>
        <LanguageSwitcher />
        <a className="header-phone" href={phones[0].href}>{phones[0].display}</a>
      </div>
    </header>
  )
}

function Hero() {
  const { t } = useLanguage()
  const contactDetails = translateContent(rawcontactDetails, t)
  const workshopIntro = translateContent(rawworkshopIntro, t)
  return (
    <section className="hero" id="top">
      <div className="container hero-brand-row">
        <a className="brand" href="#top" aria-label={t("Auto CRAFT KZ — на главную")}>
          <img src="/logo.png" alt="Auto CRAFT KZ" width="176" height="176" />
        </a>
        <h1><span className="brand-wordmark"><span className="wordmark-auto">Auto</span><span className="wordmark-craft">CRAFT</span><span className="wordmark-kz">KZ</span></span>{t("Мастерская по ремонту стартеров и генераторов в Алматы")}</h1>
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-hours" aria-label={t("График работы")}>
            <strong>{t("График работы")}</strong>
            {contactDetails.hours.map((hours) => <span key={hours}>{hours}</span>)}
          </div>
          <p className="hero-lead">{workshopIntro.transport}</p>
          <div className="hero-services" id="prices">
            <table className="service-prices">
              <thead><tr><th scope="col">{t("Основные услуги")}</th><th scope="col"><span className="sr-only">{t("Цена")}</span></th></tr></thead>
              <tbody>{workshopIntro.services.map((service) => (
                <tr key={service.title}><th scope="row">{service.title}</th><td>{service.price}</td></tr>
              ))}</tbody>
            </table>
            <p className="service-price-note">{t("Итоговая стоимость ремонта определяется после диагностики.")}</p>
          </div>
          <a className="button button-primary hero-booking-button" href="#service-booking">Записаться на сервис <span aria-hidden="true">↗</span></a>
          <p className="hero-booking-note">При записи онлайн — диагностика агрегатов бесплатно!</p>
          <div className="action-row hero-contact-actions">
            <a className="button button-secondary" href={phones[0].href}><ContactIcon kind="phone" />{t("Позвонить")}</a>
            <a className="button button-primary" href={phones[0].whatsappUrl}><ContactIcon kind="whatsapp" />WhatsApp</a>
          </div>
          <a className="text-link light-link" href="#repair-request">{t("Описать неисправность →")}</a>
        </div>
        <LocationMap />
      </div>
    </section>
  )
}

function Symptoms() {
  const { t } = useLanguage()
  const symptomGroups = translateContent(rawsymptomGroups, t)
  return (
    <section className="section" id="symptoms">
      <div className="container">
        <SectionHeading eyebrow={t("Наблюдения водителя")} title={t("Что говорит о неисправности")} description={t("Одинаковые симптомы могут иметь разные причины. Точную причину определяет диагностика.")} />
        <div className="symptom-grid">
          {symptomGroups.map((group) => (
            <article className="symptom-card" key={group.id}>
              <h3>{group.title}</h3>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComponentPurpose() {
  const { t } = useLanguage()
  return (
    <section className="section section-dark" id="purpose">
      <div className="container">
        <SectionHeading eyebrow={t("Система запуска и питания")} title={t("Два агрегата, от которых зависит поездка")} />
        <div className="purpose-grid">
          <article><span className="unit-number">01</span><h3>{t("Стартер запускает двигатель")}</h3><p>{t("Он превращает электрическую энергию аккумулятора во вращение, необходимое для первого запуска двигателя.")}</p></article>
          <article><span className="unit-number">02</span><h3>{t("Генератор поддерживает работу")}</h3><p>{t("После запуска он питает электрооборудование автомобиля и восполняет заряд аккумулятора.")}</p></article>
          <aside><p>{t("Неисправность аккумулятора или проводки может выглядеть как поломка агрегата. Поэтому ремонт начинается с проверки, а не со случайной замены деталей.")}</p></aside>
        </div>
      </div>
    </section>
  )
}

function RepairScope() {
  const { t } = useLanguage()
  const repairSteps = translateContent(rawrepairSteps, t)
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading eyebrow={t("В мастерской")} title={t("Что происходит с агрегатом")} description={t("Состав работ определяется состоянием конкретного агрегата после проверки.")} />
        <ol className="steps-grid">
          {repairSteps.map((step, index) => (
            <li key={step.id}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.description}</p></li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function VehicleContexts() {
  const { t } = useLanguage()
  return (
    <section className="section vehicle-section">
      <div className="container">
        <SectionHeading eyebrow={t("Условия эксплуатации")} title={t("Легковой автомобиль или рабочая машина")} />
        <div className="vehicle-grid">
          <article className="vehicle-card passenger">
            <div><p className="card-kicker">{t("Легковой транспорт")}</p><h3>{t("Надёжный ежедневный запуск")}</h3><p>{t("Повторяющиеся проблемы с запуском или зарядом лучше проверять до того, как автомобиль перестанет заводиться.")}</p></div>
            <img src="/images/workshop/vehicle-service-bay-v1.jpg" alt={t("Легковой автомобиль в ремонтной зоне Auto CRAFT KZ")} />
          </article>
          <article className="vehicle-card commercial">
            <div><p className="card-kicker">{t("Коммерческий транспорт")}</p><h3>{t("Простой — часть стоимости ремонта")}</h3><p>{t("Интенсивные циклы запуска и повышенная электрическая нагрузка делают точную диагностику особенно важной для рабочей машины.")}</p></div>
            <img src="/images/cases/mercedes-sprinter/04.jpg" alt={t("Mercedes Sprinter в ремонтной зоне Auto CRAFT KZ")} />
          </article>
        </div>
      </div>
    </section>
  )
}

function Quality() {
  const { t } = useLanguage()
  const qualityCriteria = translateContent(rawqualityCriteria, t)
  return (
    <section className="section quality-section">
      <div className="container quality-grid">
        <div>
          <SectionHeading eyebrow={t("Проверяемые критерии")} title={t("Как оценить выполненную работу")} />
          <div className="criteria-list">
            {qualityCriteria.map((item, index) => <article key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
          </div>
        </div>
        <figure className="quality-photo">
          <img src="/images/equipment/alternator-test-bench-v1.jpg" alt={t("Проверка генератора на стенде под нагрузкой")} />
          <figcaption>{t("Проверка генератора на стенде")}</figcaption>
        </figure>
      </div>
      <div className="container economics">
        <p className="eyebrow">{t("Стоимость ремонта — не только цена детали")}</p>
        <p>{t("Повторное снятие агрегата, случайная замена компонентов и простой автомобиля увеличивают общие затраты. Диагностика и контроль после сборки помогают избежать повторения той же работы.")}</p>
      </div>
    </section>
  )
}

function ServicePhotoStrip() {
  const { t } = useLanguage()
  const servicePhotos = translateContent(rawservicePhotos, t)
  return (
    <CaseGallery images={servicePhotos} title={t('Фотографии процессов в сервисе')} layout="workshop" />
  )
}

function ServiceTiming() {
  const { t } = useLanguage()
  const serviceTiming = translateContent(rawserviceTiming, t)
  return (
    <section className="section section-dark">
      <div className="container">
        <SectionHeading eyebrow={t("Проверка по состоянию")} title={t("Нужно ли проверять агрегат сейчас?")} description={t("У стартера и генератора нет одного универсального интервала для всех автомобилей. Ориентир — симптомы и условия эксплуатации.")} />
        <div className="timing-grid">{serviceTiming.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        <a className="text-link light-link" href={phones[0].whatsappUrl}>{t("Описать симптомы мастеру в WhatsApp →")}</a>
      </div>
    </section>
  )
}

function RepairCases() {
  const { t } = useLanguage()
  const repairCases = translateContent(rawrepairCases, t)
  return (
    <section className="section" id="cases">
      <div className="container">
        <SectionHeading eyebrow={t("Реальные работы")} title={t("С чем приезжают и что делаем")} description={t("Примеры ремонта из нашей мастерской: симптомы, выполненные работы и результат.")} />
        <RepairVideo src="/videos/toyota-camry-70-alternator-repair.mp4" title={`Toyota Camry 70 — ${t('Ремонт генератора')}`} />
        <div className="cases-grid">
          {repairCases.map((repairCase) => (
            <article className="case-card" key={repairCase.id}>
              <CaseGallery images={repairCase.images} title={repairCase.vehicle} />
              <div className="case-body">
                <h3>{repairCase.vehicle}</h3>
                <dl><div><dt>{t("Обращение")}</dt><dd>{repairCase.symptom}</dd></div><div><dt>{t("Работа")}</dt><dd>{repairCase.work}</dd></div><div><dt>{t("Результат")}</dt><dd>{repairCase.result}</dd></div></dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactProcess() {
  const { t } = useLanguage()
  const steps = ['Опишите симптомы по телефону или в WhatsApp', 'Автомобиль или снятый агрегат поступает на диагностику', 'После проверки согласовываются работы и детали', 'Агрегат ремонтируется и проходит контрольную проверку']
  return (
    <section className="section process-section">
      <div className="container">
        <SectionHeading title={t("Как проходит ремонт")} />
        <ol className="contact-process">{steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{t(step)}</p></li>)}</ol>
      </div>
    </section>
  )
}

function MobileContactBar() {
  const { t } = useLanguage()
  return <aside className="mobile-contact-bar" aria-label={t("Быстрая связь")}><a href={phones[0].href}><ContactIcon kind="phone" />{t("Позвонить")}</a><a href={phones[0].whatsappUrl}><ContactIcon kind="whatsapp" />WhatsApp</a></aside>
}

function App() {
  const { t } = useLanguage()
  return (
    <div onClick={trackContactClick}>
      <Header />
      <main>
        <Hero />


        <ServiceBooking />
        <RepairRequest />
        <ContactProcess />
        <RepairCases />
        <Symptoms />
        <RepairScope />
        <VehicleContexts />
        <Quality />
        <ServicePhotoStrip />
        <ServiceTiming />
        <ComponentPurpose />
        <SeasonOffer />

      </main>
      <footer className="site-footer"><div className="container"><a href="#top">{t("Наверх ↑")}</a><a href="#top">{t("Карта и контакты")}</a></div></footer>
      <MobileContactBar />
    </div>
  )
}

export default App
