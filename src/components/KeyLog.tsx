import { useI18n } from '../i18n/useI18n'
import type { VimMode } from './Editor'

type Props = {
  mode: VimMode
  keystrokes: number
  par: number
  freePlay: boolean
  recent: string[]
}

const MODE_STYLES: Record<VimMode, string> = {
  normal: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  insert: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  visual: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  replace: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
}

export default function KeyLog({ mode, keystrokes, par, freePlay, recent }: Props) {
  const { t } = useI18n()

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span
        className={`rounded-md border px-2 py-0.5 font-mono font-semibold tracking-wide ${MODE_STYLES[mode]}`}
      >
        {t(`editor.mode.${mode}`)}
      </span>
      <span className="text-slate-400">
        {t('editor.keystrokes')}:{' '}
        <span className={!freePlay && keystrokes > par ? 'text-amber-400' : 'text-emerald-400'}>
          {keystrokes}
        </span>{' '}
        <span className="text-slate-500">
          ({freePlay ? t('editor.freePlay') : t('editor.par', { par })})
        </span>
      </span>
      <span className="ml-auto flex gap-1">
        {recent.map((key, index) => (
          <kbd
            key={`${key}-${index}`}
            className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-300"
          >
            {key}
          </kbd>
        ))}
      </span>
    </div>
  )
}
