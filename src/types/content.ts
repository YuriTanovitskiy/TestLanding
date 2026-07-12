export interface ContactPhone {
  label: string
  display: string
  href: string
  whatsappUrl?: string
  telegramUrl?: string
}

export interface SymptomGroup {
  id: string
  title: string
  items: string[]
}

export interface RepairStep {
  id: string
  title: string
  description: string
}

export interface QualityCriterion {
  title: string
  description: string
}

export interface ServiceTimingItem {
  title: string
  description: string
}

export interface RepairCase {
  id: string
  vehicle: string
  symptom: string
  work: string
  result: string
  images: Array<{
    src: string
    alt: string
  }>
}

export interface MediaItem {
  src: string
  alt: string
  caption: string
}

