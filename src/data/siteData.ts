import type {
  ContactPhone,
  MediaItem,
  QualityCriterion,
  RepairCase,
  RepairStep,
  ServiceTimingItem,
  SymptomGroup,
} from '../types/content'

export const phones: ContactPhone[] = [
  {
    label: 'WhatsApp Business',
    display: '+7 707 364 85 36',
    href: 'tel:+77073648536',
    whatsappUrl: 'https://wa.me/77073648536',
  },
  {
    label: 'WhatsApp / Telegram',
    display: '+7 705 819 42 03',
    href: 'tel:+77058194203',
    whatsappUrl: 'https://wa.me/77058194203',
  },
]

export const symptomGroups: SymptomGroup[] = [
  {
    id: 'starter',
    title: 'Стартер',
    items: [
      'Щелчок при повороте ключа, но двигатель не запускается',
      'Двигатель медленно проворачивается при запуске',
      'Запуск происходит не с первой попытки',
      'После запуска слышна продолжающаяся работа стартера',
      'При запуске появляется металлический скрежет',
    ],
  },
  {
    id: 'alternator',
    title: 'Генератор',
    items: [
      'На приборной панели горит индикатор аккумулятора',
      'Аккумулятор регулярно разряжается',
      'Яркость фар меняется во время работы двигателя',
      'Появляется свист или гул',
      'Электрооборудование работает нестабильно',
      'Чувствуется запах перегрева',
    ],
  },
]

export const repairSteps: RepairStep[] = [
  { id: 'check', title: 'Первичная проверка', description: 'Проверяем агрегат, когда возможно — непосредственно на автомобиле.' },
  { id: 'bench-before', title: 'Проверка на стенде', description: 'Снятый агрегат проверяется до разборки, чтобы зафиксировать его состояние.' },
  { id: 'clean', title: 'Разборка и очистка', description: 'Разбираем агрегат и очищаем его компоненты для точной оценки состояния.' },
  { id: 'inspect', title: 'Дефектовка', description: 'Проверяем компоненты по отдельности и определяем необходимый объём работ.' },
  { id: 'approve', title: 'Согласование', description: 'Обсуждаем перечень работ и деталей до продолжения ремонта.' },
  { id: 'repair', title: 'Ремонт и сборка', description: 'Заменяем или обслуживаем элементы, затем собираем агрегат.' },
  { id: 'test', title: 'Контрольная проверка', description: 'После сборки агрегат снова проходит проверку на стенде.' },
]

export const qualityCriteria: QualityCriterion[] = [
  { title: 'Причина установлена до замены деталей', description: 'Диагностика помогает отделить неисправность агрегата от проблем аккумулятора или проводки.' },
  { title: 'Компоненты проверены по отдельности', description: 'Разборка и дефектовка показывают фактическое состояние механической и электрической частей.' },
  { title: 'Работы согласованы', description: 'Перечень операций и деталей определяется после проверки, а не по внешнему виду агрегата.' },
  { title: 'Результат проверен на стенде', description: 'Контроль после сборки снижает вероятность повторного снятия и дополнительного простоя.' },
]

export const serviceTiming: ServiceTimingItem[] = [
  { title: 'Запуск изменился', description: 'Двигатель проворачивается медленнее, запускается не сразу или слышны необычные звуки.' },
  { title: 'Аккумулятор разряжается', description: 'Повторный разряд может быть связан не только с самим аккумулятором.' },
  { title: 'Появился шум или запах', description: 'Свист, гул, скрежет и запах перегрева — повод не откладывать проверку.' },
  { title: 'Предстоит нагрузка', description: 'Проверка уместна перед дальней поездкой, сменой сезона или интенсивной эксплуатацией.' },
]

export const servicePhotos: MediaItem[] = [
  { src: '/images/workshop/vehicle-service-bay-v1.jpg', alt: 'Автомобиль с открытым капотом в ремонтной зоне Auto CRAFT KZ', caption: 'Автомобиль в ремонтной зоне' },
  { src: '/images/equipment/alternator-test-bench-v1.jpg', alt: 'Генератор на стенде проверки рабочих параметров', caption: 'Проверка генератора на стенде' },
  { src: '/images/workshop/repair-workbench-v1.jpg', alt: 'Рабочий стол с инструментами для ремонта агрегатов', caption: 'Рабочее место для разборки' },
  { src: '/images/workshop/parts-cleaning-cabinet-v1.jpg', alt: 'Камера для очистки деталей стартеров и генераторов', caption: 'Очистка деталей перед дефектовкой' },
  { src: '/images/parts/parts-stock-detail-v1.jpg', alt: 'Полки с комплектующими для ремонта стартеров и генераторов', caption: 'Комплектующие в мастерской' },
]

export const repairCases: RepairCase[] = [
  {
    id: 'chevrolet-cruze',
    vehicle: 'Chevrolet Cruze 1.8',
    symptom: 'Нестабильная работа генератора.',
    work: 'Очистка, замена подшипников, реле заряда и обгонной муфты генератора.',
    result: 'Агрегат обслужен и подготовлен к установке. Точные результаты контрольных измерений не зафиксированы в исходных данных.',
    images: [
      { src: '/images/cases/chevrolet-cruze/01.jpg', alt: 'Генератор Chevrolet Cruze до ремонта' },
      { src: '/images/cases/chevrolet-cruze/03.jpg', alt: 'Разборка генератора Chevrolet Cruze' },
      { src: '/images/cases/chevrolet-cruze/06.jpg', alt: 'Генератор Chevrolet Cruze после обслуживания' },
    ],
  },
  {
    id: 'mercedes-sprinter',
    vehicle: 'Mercedes Sprinter',
    symptom: 'Отсутствие заряда аккумулятора.',
    work: 'Очистка, замена подшипников и обгонной муфты генератора.',
    result: 'Генератор обслужен. Точные результаты контрольных измерений не зафиксированы в исходных данных.',
    images: [
      { src: '/images/cases/mercedes-sprinter/04.jpg', alt: 'Mercedes Sprinter в ремонтной зоне' },
      { src: '/images/cases/mercedes-sprinter/05.jpg', alt: 'Дефектовка генератора Mercedes Sprinter' },
      { src: '/images/cases/mercedes-sprinter/06.jpg', alt: 'Генератор Mercedes Sprinter после обслуживания' },
    ],
  },
  {
    id: 'toyota-hilux',
    vehicle: 'Toyota HiLux',
    symptom: 'Двигатель не запускался.',
    work: 'Очистка, обслуживание механической части и замена щёточного узла.',
    result: 'Агрегат обслужен. Диагностированная причина и результаты проверки требуют уточнения.',
    images: [
      { src: '/images/cases/toyota-hilux/04.jpg', alt: 'Toyota HiLux в ремонтной зоне' },
      { src: '/images/cases/toyota-hilux/05.jpg', alt: 'Процесс обслуживания агрегата Toyota HiLux' },
      { src: '/images/cases/toyota-hilux/07.jpg', alt: 'Агрегат Toyota HiLux после обслуживания' },
    ],
  },
  {
    id: 'toyota-rav4',
    vehicle: 'Toyota RAV4',
    symptom: 'Двигатель не запускался.',
    work: 'Очистка, обслуживание механической части и замена щёточного узла.',
    result: 'Агрегат обслужен. Диагностированная причина и результаты проверки требуют уточнения.',
    images: [
      { src: '/images/cases/toyota-rav4/01.jpg', alt: 'Toyota RAV4 в ремонтной зоне' },
      { src: '/images/cases/toyota-rav4/03.jpg', alt: 'Разборка агрегата Toyota RAV4' },
      { src: '/images/cases/toyota-rav4/09.jpg', alt: 'Агрегат Toyota RAV4 после обслуживания' },
    ],
  },
]

export const contactDetails = {
  address: 'Алматы, ул. Станционная, 4',
  entrance: 'Заезд с ул. Осипенко, ориентир: ул. П. Осипенко, 9/1',
  hours: ['Пн–Пт: 09:00–18:00', 'Сб: 10:00–15:00'],
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=43.341558%2C76.946094',
  yandexMapsUrl: 'https://yandex.com/maps/?rtext=~43.341558%2C76.946094&rtt=auto',
  twoGisUrl: 'https://2gis.kz/almaty/geo/70030077161935154/76.946094,43.341558',
  instagramUrl: 'https://www.instagram.com/autocraftkz?utm_source=qr&igsh=aDd4djhzY3F5eTdy',
}
