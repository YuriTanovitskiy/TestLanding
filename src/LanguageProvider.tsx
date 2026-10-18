import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LanguageContext } from './i18n'
import type { Language } from './i18n'
import { kazakh } from './data/kazakh'
import { english } from './data/english'

const metadata: Record<Language, { title: string; description: string }> = {
  ru: { title: 'AutoCRAFT KZ — ремонт стартеров и генераторов', description: 'Диагностика и ремонт стартеров и генераторов в Алматы. AutoCRAFT KZ.' },
  kk: { title: 'AutoCRAFT KZ — стартерлер мен генераторларды жөндеу', description: 'Алматыда стартерлер мен генераторларды диагностикалау және жөндеу. AutoCRAFT KZ.' },
  en: { title: 'AutoCRAFT KZ — starter and alternator repair', description: 'Starter and alternator diagnostics and repair in Almaty. AutoCRAFT KZ.' },
}
interface LanguageProviderProps { children: ReactNode }
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('autocraft-language')
      return saved === 'kk' || saved === 'en' ? saved : 'ru'
    } catch { return 'ru' }
  })
  const dictionary = language === 'kk' ? kazakh : language === 'en' ? english : undefined
  const t = (text: string) => dictionary?.[text] ?? text
  useEffect(() => {
    document.documentElement.lang = language
    document.title = metadata[language].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata[language].description)
    try { localStorage.setItem('autocraft-language', language) } catch { /* Storage can be disabled. */ }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

