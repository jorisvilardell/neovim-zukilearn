import { useState } from 'react'
import type { DictKey } from '../i18n/dict'
import { useI18n } from '../i18n/useI18n'
import { targetDoc } from '../game/validate'
import type { Level } from '../game/types'

type Props = {
  level: Level
  index: number
  total: number
  solved: boolean
  onReset: () => void
}

export default function LevelPanel({ level, index, total, solved, onReset }: Props) {
  const { t } = useI18n()
  const [showHint, setShowHint] = useState(false)
  const target = targetDoc(level)
  const cursorTarget =
    level.validate.kind === 'cursor' || level.validate.kind === 'both' ? level.validate : null

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-400">
            {t('panel.level', { index: index + 1, total })}
          </p>
          <h2 className="text-xl font-semibold text-slate-100">
            {t(`level.${level.id}.title` as DictKey)}
          </h2>
        </div>
        {solved && (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            ✓ {t('panel.solved')}
          </span>
        )}
      </header>

      <div>
        <h3 className="mb-1 text-xs uppercase tracking-widest text-slate-500">{t('panel.task')}</h3>
        <p className="text-slate-200">{t(`level.${level.id}.task` as DictKey)}</p>
      </div>

      <div>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-slate-500">{t('panel.keys')}</h3>
        <div className="flex flex-wrap gap-2">
          {level.teaches.map((key) => (
            <kbd
              key={key}
              className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2 py-1 font-mono text-sm text-orange-300"
            >
              {key}
            </kbd>
          ))}
        </div>
      </div>

      {target !== null && (
        <div>
          <h3 className="mb-2 text-xs uppercase tracking-widest text-slate-500">
            {t('panel.target')}
          </h3>
          <pre className="overflow-x-auto rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 font-mono text-sm text-emerald-300">
            {target}
          </pre>
        </div>
      )}

      {cursorTarget && (
        <p className="text-sm text-slate-400">
          {t('panel.targetCursor', { line: cursorTarget.line + 1, col: cursorTarget.col + 1 })}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
        >
          {showHint ? t('panel.hideHint') : t('panel.hint')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
        >
          {t('panel.replay')}
        </button>
      </div>

      {showHint && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          {t(`level.${level.id}.hint` as DictKey)}
        </p>
      )}
    </section>
  )
}
