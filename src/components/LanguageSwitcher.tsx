import { useLanguage } from '../i18n'
import type { Language } from '../i18n'

const nextLanguages: Record<Language, Language> = { ru: 'kk', kk: 'en', en: 'ru' }
const labels: Record<Language, string> = { ru: 'РУС', kk: 'ҚАЗ', en: 'ENG' }
const descriptions: Record<Language, string> = {
  ru: 'Переключить язык на казахский',
  kk: 'Сайт тілін ағылшын тіліне ауыстыру',
  en: 'Switch language to Russian',
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const nextLanguage = nextLanguages[language]
  return (
    <button
      className="language-switcher"
      type="button"
      lang={nextLanguage}
      aria-label={descriptions[language]}
      onClick={() => setLanguage(nextLanguage)}
    >
      {labels[nextLanguage]}
    </button>
  )
}
