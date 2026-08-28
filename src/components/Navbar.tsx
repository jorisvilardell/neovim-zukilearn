import { Zuki } from '@zukquote/zuki-react'
import { useI18n } from '../i18n/useI18n'

export default function Navbar() {
  const { t, lang, setLang } = useI18n()

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        {/* ZukiFavicon forces a helmet, so the head is built from Zuki itself. */}
        <Zuki pose="idle" theme="orange" accessory="beanie" hideLimbs size={40} />
        <div>
          <h1 className="text-lg font-semibold text-slate-100">{t('app.title')}</h1>
          <p className="hidden text-xs text-slate-400 sm:block">{t('app.tagline')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
        className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
      >
        {t('lang.switch')}
      </button>
    </header>
  )
}
