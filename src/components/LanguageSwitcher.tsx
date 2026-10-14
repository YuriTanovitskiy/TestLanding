import { useLanguage } from '../i18n'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  return (
    <div className="language-switcher" role="group" aria-label={t('Язык сайта')}>
      <button type="button" lang="ru" aria-pressed={language === 'ru'} onClick={() => setLanguage('ru')}>Русский</button>
      <button type="button" lang="kk" aria-pressed={language === 'kk'} onClick={() => setLanguage('kk')}>Қазақша</button>
    </div>
  )
}
