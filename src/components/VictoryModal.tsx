import { useI18n } from '../i18n/useI18n'
import type { LevelResult } from '../game/types'

type Props = {
  result: LevelResult
  par: number
  hasNext: boolean
  onNext: () => void
  onRetry: () => void
  onClose: () => void
}

export default function VictoryModal({ result, par, hasNext, onNext, onRetry, onClose }: Props) {
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold text-emerald-300">{t('victory.title')}</h2>
        <p className="mt-2 text-slate-300">
          {t('victory.stars', {
            stars: result.stars,
            keystrokes: result.keystrokes,
            par,
          })}
        </p>
        <p className="mt-3 text-3xl text-amber-400">
          {'★'.repeat(result.stars)}
          <span className="text-slate-700">{'★'.repeat(3 - result.stars)}</span>
        </p>
        {!hasNext && <p className="mt-3 text-slate-300">{t('victory.finished')}</p>}
        <div className="mt-6 flex flex-wrap gap-2">
          {hasNext && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-orange-400"
            >
              {t('victory.next')}
            </button>
          )}
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:border-orange-400"
          >
            {t('victory.retry')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-slate-400 transition hover:text-slate-200"
          >
            {t('victory.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
