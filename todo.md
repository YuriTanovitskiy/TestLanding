# TODO: перенос контента Auto CRAFT KZ

> В проекте отсутствует `structure.md`. Для анализа использован `spec/firststructure.md` как ближайший соответствующий документ.

## Готовые материалы

- Контакты: два телефона, мессенджеры, адрес и график.
- Геолокация: координаты въезда, Google Maps, Яндекс Карты и 2GIS.
- Услуги: диагностика и ремонт стартеров и генераторов, запчасти.
- Симптомы стартера и генератора.
- Назначение агрегатов.
- Последовательность ремонта из девяти этапов.
- Смысловой каркас для легкового и коммерческого транспорта.
- Критерии качественного ремонта и экономическая логика.
- Условия, при которых целесообразна проверка агрегата.
- Четыре реальных кейса, 30 фотографий и частичные описания.
- Три фотографии оборудования.
- Восемь фотографий ремонтной зоны.
- Две фотографии склада.
- Две фотографии сотрудников.
- Ссылка на Instagram.

## Недостающие данные по секциям

### Первый экран

- [ ] Утвердить короткий оффер.
- [x] Выбрать основной телефон.
- [x] Выбрать основной номер WhatsApp.
- [ ] Выбрать фотографию первого экрана.
- [ ] Утвердить формулировку о коммерческом транспорте.
- [ ] Подготовить короткую подпись адреса и въезда.

### Симптомы неисправности

- [ ] Отредактировать формулировки симптомов.
- [ ] Проверить спорные технические формулировки с мастером.
- [ ] Подготовить CTA после списка симптомов.

### Назначение стартера и генератора

- [ ] Написать законченный текст секции.
- [ ] Выбрать фотографии стартера и генератора.
- [ ] Объяснить связь агрегатов с аккумулятором и проводкой.

### Что происходит с агрегатом в мастерской

- [ ] Уточнить, всегда ли сервис снимает и устанавливает агрегат.
- [ ] Уточнить, всегда ли возможна проверка на автомобиле.
- [ ] Описать случаи, когда стендовая проверка невозможна.
- [ ] Подготовить короткие подписи к этапам.
- [ ] Подобрать фотографии к конкретным этапам.

### Легковой и коммерческий транспорт

- [ ] Перечислить принимаемые виды коммерческого транспорта.
- [ ] Уточнить работу с грузовыми автомобилями.
- [ ] Описать условия работы с автопарками.
- [ ] Уточнить безналичную оплату и документы для организаций.
- [ ] Уточнить возможность планового обслуживания автопарка.

### Критерии качественного ремонта

- [ ] Зафиксировать гарантийные условия.
- [ ] Уточнить, какие документы выдаются после ремонта.
- [ ] Перечислить измеряемые на стенде параметры.
- [ ] Описать правила выбора запчастей.
- [ ] Уточнить, какие детали восстанавливаются, а какие заменяются.
- [ ] Описать порядок согласования дополнительных работ.

### Визуальная полоса

- [ ] Выбрать 5–7 фотографий.
- [ ] Утвердить порядок кадров.
- [ ] Подготовить подписи и `alt`.
- [ ] Определить декоративные изображения.

### Нужно ли проверять агрегат сейчас

- [ ] Разделить профилактическую проверку и ремонт.
- [ ] Уточнить стоимость диагностики.
- [ ] Описать правила предварительной записи.
- [ ] Проверить сезонные рекомендации.
- [ ] Подготовить текст обращения в WhatsApp.

### Реальные кейсы

Доступны:

1. Chevrolet Cruze 1.8 — нестабильная работа генератора.
2. Mercedes Sprinter — отсутствие заряда аккумулятора.
3. Toyota HiLux — отсутствие запуска двигателя.
4. Toyota RAV4 — отсутствие запуска двигателя.

Для каждого кейса требуется:

- [ ] Год выпуска.
- [ ] Пробег.
- [ ] Точная диагностированная причина.
- [ ] Проверяемый результат после ремонта.
- [ ] Гарантийный результат.
- [ ] Срок выполнения.
- [ ] Список использованных компонентов, если его можно публиковать.
- [ ] Подтверждение типа агрегата для HiLux и RAV4.

Формат кейса:

**Автомобиль → симптом → причина → выполненная работа → результат**

### Процесс обращения и ремонта

- [ ] Описать правила записи.
- [ ] Уточнить возможность доставки снятого агрегата.
- [ ] Зафиксировать порядок первичной диагностики.
- [ ] Зафиксировать момент согласования цены.
- [ ] Перечислить способы оплаты.
- [ ] Описать гарантийные обязательства.

### Контакты

- [ ] Выбрать главный телефон.
- [ ] Подготовить ссылки `tel:`.
- [ ] Выбрать основной WhatsApp.
- [ ] Уточнить название объекта для карт.
- [ ] Добавить фотографии фасада, вывески и въезда.
- [ ] Уточнить парковку.
- [ ] Подтвердить, что воскресенье — выходной.
- [ ] Утвердить окончательную форму адреса.

Предлагаемая форма:

> Алматы, ул. Станционная, 4. Заезд с ул. Осипенко, ориентир: ул. П. Осипенко, 9/1.

## Предлагаемая структура `src/data`

```text
src/data/
├── contacts.ts
├── services.ts
├── symptoms.ts
├── componentPurpose.ts
├── repairProcess.ts
├── vehicleContexts.ts
├── qualityCriteria.ts
├── serviceTiming.ts
├── repairCases.ts
├── media.ts
├── navigation.ts
└── index.ts

src/types/
└── content.ts
```

## Предлагаемые TypeScript-интерфейсы

```ts
interface ContactPhone {
  label: string
  display: string
  href: string
  whatsappUrl?: string
  telegramUrl?: string
  isPrimary: boolean
}

interface BusinessHours {
  days: string
  opens: string
  closes: string
}

interface Location {
  city: string
  address: string
  entranceNote: string
  latitude: number
  longitude: number
  googleMapsUrl: string
  yandexMapsUrl: string
  twoGisUrl: string
}

interface ContactsData {
  phones: ContactPhone[]
  hours: BusinessHours[]
  location: Location
  instagramUrl?: string
}
```

```ts
type ServiceCategory = 'starter' | 'alternator' | 'diagnostics' | 'parts'

interface Service {
  id: string
  title: string
  description: string
  category: ServiceCategory
}

type UnitType = 'starter' | 'alternator'

interface SymptomGroup {
  unit: UnitType
  title: string
  symptoms: string[]
  disclaimer: string
}
```

```ts
interface RepairStep {
  id: string
  order: number
  title: string
  description: string
  imageId?: string
}

type VehicleContextType = 'passenger' | 'commercial'

interface VehicleContext {
  type: VehicleContextType
  title: string
  points: string[]
  supportedVehicles?: string[]
}
```

```ts
interface QualityCriterion {
  id: string
  title: string
  description: string
  evidenceImageId?: string
}

interface QualityEconomicsItem {
  id: string
  statement: string
}

interface ServiceTimingCondition {
  id: string
  title: string
  description?: string
  appliesTo: UnitType | 'both'
}
```

```ts
type CaseImageStage =
  | 'vehicle'
  | 'before'
  | 'diagnostics'
  | 'disassembly'
  | 'cleaning'
  | 'assembly'
  | 'after'
  | 'testing'

interface RepairCaseImage {
  id: string
  src: string
  alt: string
  caption?: string
  stage: CaseImageStage
}

interface RepairCase {
  id: string
  vehicle: {
    make: string
    model: string
    engine?: string
    year?: number
    mileageKm?: number
  }
  unit: UnitType
  symptom: string
  cause: string
  workPerformed: string[]
  partsUsed?: string[]
  result: string
  images: RepairCaseImage[]
}
```

```ts
type MediaCategory =
  | 'hero'
  | 'team'
  | 'workshop'
  | 'equipment'
  | 'parts'
  | 'case'
  | 'contacts'

interface MediaAsset {
  id: string
  src: string
  alt: string
  caption?: string
  category: MediaCategory
  decorative: boolean
  source?: string
}
```

## План переноса

1. Уточнить недостающие факты: {главный телефон}, гарантия, диагностика, коммерческий транспорт, оплата и результаты кейсов.
2. Отредактировать тексты спецификации и проверить технические формулировки.
3. Сформировать реестр изображений с `id`, источником, подписью и `alt`.
4. Перенести контакты и карты в `contacts.ts`.
5. Перенести услуги, симптомы, этапы, критерии и сервисные условия в отдельные файлы.
6. Нормализовать четыре кейса до единого интерфейса.
7. Проверить подготовленные данные с мастером.
8. После утверждения данных подключать их к компонентам и начинать вёрстку.

Главный текущий риск — нехватка проверяемых фактов: гарантийных условий, диагностированных причин и результатов ремонта.
