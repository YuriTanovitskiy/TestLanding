import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LanguageContext } from './i18n'
import type { Language } from './i18n'
import { kazakh } from './data/kazakh'
interface LanguageProviderProps { children: ReactNode }
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('autocraft-language') === 'kk' ? 'kk' : 'ru' } catch { return 'ru' }
  })
  const t = (text: string) => language === 'kk' ? kazakh[text] ?? text : text
  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === 'kk' ? 'AutoCRAFT KZ — стартерлер мен генераторларды жөндеу' : 'AutoCRAFT KZ — ремонт стартеров и генераторов'
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'kk'
      ? 'Алматыда стартерлер мен генераторларды диагностикалау және жөндеу. AutoCRAFT KZ.'
      : 'Диагностика и ремонт стартеров и генераторов в Алматы. AutoCRAFT KZ.')
    try { localStorage.setItem('autocraft-language', language) } catch { /* Storage can be disabled. */ }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

