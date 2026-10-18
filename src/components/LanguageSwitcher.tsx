import { useLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const nextLanguage = language === 'ru' ? 'kk' : 'ru'
  return (
    <button
      className="language-switcher"
      type="button"
      lang={nextLanguage}
      aria-label={language === 'ru' ? 'Переключить язык на казахский' : 'Сайт тілін орысшаға ауыстыру'}
      onClick={() => setLanguage(nextLanguage)}
    >
      {language === 'ru' ? 'ҚАЗ' : 'РУС'}
    </button>
  )
}
