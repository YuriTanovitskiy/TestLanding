import { createContext, useContext } from 'react'

export type Language = 'ru' | 'kk'
interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (text: string) => string
}

export const LanguageContext = createContext<LanguageContextValue>({ language: 'ru', setLanguage: () => {}, t: (text) => text })

export function useLanguage() { return useContext(LanguageContext) }

export function translateContent<T>(value: T, t: (text: string) => string): T {
  if (typeof value === 'string') return t(value) as T
  if (Array.isArray(value)) return value.map((item: unknown) => translateContent(item, t)) as T
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]: [string, unknown]) => [key, translateContent(item, t)])) as T
  }
  return value
}
