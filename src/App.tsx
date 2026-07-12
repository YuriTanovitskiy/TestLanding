import './App.css'
import {
  contactDetails,
  phones,
  qualityCriteria,
  repairCases,
  repairSteps,
  servicePhotos,
  serviceTiming,
  symptomGroups,
} from './data/siteData'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Auto CRAFT KZ — на главную">
          <img src="/logo.png" alt="" />
          <span className="sr-only">Auto CRAFT KZ</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#services">Ремонт</a>
          <a href="#cases">Случаи</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <a className="header-phone" href={phones[0].href}>{phones[0].display}</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Алматы · легковой и коммерческий транспорт</p>
          <h1>Ремонт стартеров и генераторов</h1>
          <p className="hero-lead">
            Диагностика, разборка, дефектовка, ремонт и проверка агрегата на стенде.
            Запчасти для выполнения работ находятся в мастерской.
          </p>
          <div className="action-row">
            <a className="button button-primary" href={phones[0].whatsappUrl}>Написать в WhatsApp</a>
            <a className="button button-secondary" href={phones[0].href}>Позвонить</a>
          </div>
          <dl className="hero-facts">
            <div><dt>Адрес</dt><dd>{contactDetails.address}</dd></div>
            <div><dt>График</dt><dd>Пн–Пт 09:00–18:00 · Сб 10:00–15:00</dd></div>
          </dl>
        </div>
        <figure className="hero-visual">
          <img src="/images/team/yuri-workshop-v1.jpg" alt="Сотрудник Auto CRAFT KZ у стенда проверки генератора" />
          <figcaption>
            <span>Реальная мастерская</span>
            Проверка агрегатов и компонентов
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Symptoms() {
  return (
    <section className="section" id="symptoms">
      <div className="container">
        <SectionHeading eyebrow="Наблюдения водителя" title="Что говорит о неисправности" description="Одинаковые симптомы могут иметь разные причины. Точную причину определяет диагностика." />
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
  return (
    <section className="section section-dark" id="purpose">
      <div className="container">
        <SectionHeading eyebrow="Система запуска и питания" title="Два агрегата, от которых зависит поездка" />
        <div className="purpose-grid">
          <article><span className="unit-number">01</span><h3>Стартер запускает двигатель</h3><p>Он превращает электрическую энергию аккумулятора во вращение, необходимое для первого запуска двигателя.</p></article>
          <article><span className="unit-number">02</span><h3>Генератор поддерживает работу</h3><p>После запуска он питает электрооборудование автомобиля и восполняет заряд аккумулятора.</p></article>
          <aside><p>Неисправность аккумулятора или проводки может выглядеть как поломка агрегата. Поэтому ремонт начинается с проверки, а не со случайной замены деталей.</p></aside>
        </div>
      </div>
    </section>
  )
}

function RepairScope() {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeading eyebrow="В мастерской" title="Что происходит с агрегатом" description="Состав работ определяется состоянием конкретного агрегата после проверки." />
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
  return (
    <section className="section vehicle-section">
      <div className="container">
        <SectionHeading eyebrow="Условия эксплуатации" title="Легковой автомобиль или рабочая машина" />
        <div className="vehicle-grid">
          <article className="vehicle-card passenger">
            <div><p className="card-kicker">Легковой транспорт</p><h3>Надёжный ежедневный запуск</h3><p>Повторяющиеся проблемы с запуском или зарядом лучше проверять до того, как автомобиль перестанет заводиться.</p></div>
            <img src="/images/workshop/vehicle-service-bay-v1.jpg" alt="Легковой автомобиль в ремонтной зоне Auto CRAFT KZ" />
          </article>
          <article className="vehicle-card commercial">
            <div><p className="card-kicker">Коммерческий транспорт</p><h3>Простой — часть стоимости ремонта</h3><p>Интенсивные циклы запуска и повышенная электрическая нагрузка делают точную диагностику особенно важной для рабочей машины.</p></div>
            <img src="/images/cases/mercedes-sprinter/04.jpg" alt="Mercedes Sprinter в ремонтной зоне Auto CRAFT KZ" />
          </article>
        </div>
      </div>
    </section>
  )
}

function Quality() {
  return (
    <section className="section quality-section">
      <div className="container quality-grid">
        <div>
          <SectionHeading eyebrow="Проверяемые критерии" title="Как оценить выполненную работу" />
          <div className="criteria-list">
            {qualityCriteria.map((item, index) => <article key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
          </div>
        </div>
        <figure className="quality-photo">
          <img src="/images/equipment/alternator-test-bench-v1.jpg" alt="Проверка генератора на стенде под нагрузкой" />
          <figcaption>Проверка генератора на стенде</figcaption>
        </figure>
      </div>
      <div className="container economics">
        <p className="eyebrow">Стоимость ремонта — не только цена детали</p>
        <p>Повторное снятие агрегата, случайная замена компонентов и простой автомобиля увеличивают общие затраты. Диагностика и контроль после сборки помогают избежать повторения той же работы.</p>
      </div>
    </section>
  )
}

function ServicePhotoStrip() {
  return (
    <div className="photo-strip" aria-label="Фотографии процессов в сервисе">
      {servicePhotos.map((photo) => <figure key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption>{photo.caption}</figcaption></figure>)}
    </div>
  )
}

function ServiceTiming() {
  return (
    <section className="section section-dark">
      <div className="container">
        <SectionHeading eyebrow="Проверка по состоянию" title="Нужно ли проверять агрегат сейчас?" description="У стартера и генератора нет одного универсального интервала для всех автомобилей. Ориентир — симптомы и условия эксплуатации." />
        <div className="timing-grid">{serviceTiming.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        <a className="text-link light-link" href={phones[0].whatsappUrl}>Описать симптомы мастеру в WhatsApp →</a>
      </div>
    </section>
  )
}

function RepairCases() {
  return (
    <section className="section" id="cases">
      <div className="container">
        <SectionHeading eyebrow="Реальные работы" title="С чем приезжают и что делаем" description="В карточках сохранены только сведения, зафиксированные в исходных описаниях работ." />
        <div className="cases-grid">
          {repairCases.map((repairCase) => (
            <article className="case-card" key={repairCase.id}>
              <div className="case-images">{repairCase.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />)}</div>
              <div className="case-body">
                <h3>{repairCase.vehicle}</h3>
                <dl><div><dt>Обращение</dt><dd>{repairCase.symptom}</dd></div><div><dt>Работа</dt><dd>{repairCase.work}</dd></div><div><dt>Результат</dt><dd>{repairCase.result}</dd></div></dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactProcess() {
  const steps = ['Опишите симптомы по телефону или в WhatsApp', 'Автомобиль или снятый агрегат поступает на диагностику', 'После проверки согласовываются работы и детали', 'Агрегат ремонтируется и проходит контрольную проверку']
  return (
    <section className="section process-section">
      <div className="container">
        <SectionHeading eyebrow="От обращения до проверки" title="Понятная последовательность" />
        <ol className="contact-process">{steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section className="section contacts-section" id="contacts">
      <div className="container contacts-grid">
        <div>
          <p className="eyebrow">Связаться и приехать</p>
          <h2>{contactDetails.address}</h2>
          <p className="contacts-lead">{contactDetails.entrance}</p>
          <div className="phone-list">{phones.map((phone) => <div key={phone.href}><span>{phone.label}</span><a href={phone.href}>{phone.display}</a></div>)}</div>
          <div className="hours">{contactDetails.hours.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="map-links">
            <a href={contactDetails.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps</a>
            <a href={contactDetails.yandexMapsUrl} target="_blank" rel="noreferrer">Яндекс Карты</a>
            <a href={contactDetails.twoGisUrl}>2GIS</a>
          </div>
        </div>
        <div className="contact-panel">
          <p>Для первого сообщения укажите марку и модель автомобиля и опишите наблюдаемые симптомы.</p>
          <a className="button button-primary" href={phones[0].whatsappUrl}>Написать в WhatsApp</a>
          <a className="instagram-link" href={contactDetails.instagramUrl} target="_blank" rel="noreferrer">Instagram Auto CRAFT KZ →</a>
        </div>
      </div>
    </section>
  )
}

function MobileContactBar() {
  return <aside className="mobile-contact-bar" aria-label="Быстрая связь"><a href={phones[0].href}>Позвонить</a><a href={phones[0].whatsappUrl}>WhatsApp</a></aside>
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Symptoms />
        <ComponentPurpose />
        <RepairScope />
        <VehicleContexts />
        <Quality />
        <ServicePhotoStrip />
        <ServiceTiming />
        <RepairCases />
        <ContactProcess />
        <Contacts />
      </main>
      <footer className="site-footer"><div className="container"><span>Auto CRAFT KZ</span><span>Ремонт стартеров и генераторов · Алматы</span></div></footer>
      <MobileContactBar />
    </>
  )
}

export default App
