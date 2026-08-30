import type { DictKey } from '../i18n/dict'
import { useI18n } from '../i18n/useI18n'
import { targetDoc } from '../game/validate'
import type { Level, LevelResult, LevelStep } from '../game/types'

type Props = {
  level: Level
  index: number
  total: number
  step: LevelStep
  stepIndex: number
  cleared: boolean
  result: LevelResult | null
  hintShown: boolean
  hasNext: boolean
  onToggleHint: () => void
  onReset: () => void
  onNext: () => void
}

export default function LevelPanel({
  level,
  index,
  total,
  step,
  stepIndex,
  cleared,
  result,
  hintShown,
  hasNext,
  onToggleHint,
  onReset,
  onNext,
}: Props) {
  const { t } = useI18n()
  const target = targetDoc(step.validate)
  const cursorTarget =
    step.validate.kind === 'cursor' || step.validate.kind === 'both' ? step.validate : null

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs tracking-widest text-orange-400 uppercase">
            {t('panel.level', { index: index + 1, total })}
            {level.steps.length > 1 && (
              <span className="ml-2 text-slate-500 normal-case">
                {t('panel.step', { index: stepIndex + 1, total: level.steps.length })}
              </span>
            )}
          </p>
          <h2 className="truncate text-lg font-semibold text-slate-100">
            {t(`level.${level.id}.title` as DictKey)}
          </h2>
        </div>
        {cleared && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            ✓ {t('panel.solved')}
          </span>
        )}
      </header>

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

      {target !== null && (
        <div>
          <h3 className="mb-2 text-xs tracking-widest text-slate-500 uppercase">
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

      {result && (
        <p className="text-lg text-amber-400">
          {'★'.repeat(result.stars)}
          <span className="text-slate-700">{'★'.repeat(3 - result.stars)}</span>
          <span className="ml-2 align-middle text-sm text-slate-400">
            {t('victory.stars', {
              stars: result.stars,
              keystrokes: result.keystrokes,
              par: level.par,
            })}
          </span>
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {result && hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-orange-400"
          >
            {t('victory.next')} →
          </button>
        )}
        <button
          type="button"
          onClick={onToggleHint}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
        >
          {hintShown ? t('panel.hideHint') : t('panel.hint')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
        >
          {result ? t('zuki.retry') : t('panel.replay')}
        </button>
      </div>
    </section>
  )
}
