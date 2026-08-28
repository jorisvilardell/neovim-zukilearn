import { useI18n } from '../i18n/useI18n'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500 sm:px-6">
      <span>
        {t('footer.builtWith')}{' '}
        <a
          href="https://github.com/jorisvilardell/zuki"
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 hover:underline"
        >
          Zuki
        </a>
        {' · '}
        <a
          href="https://github.com/jorisvilardell/neovim-zukilearn"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {t('footer.source')}
        </a>
      </span>
    </footer>
  )
}
