import { CHAPTERS, LEVELS, levelsOfChapter } from '../game/levels'
import type { DictKey } from '../i18n/dict'
import { useI18n } from '../i18n/useI18n'
import type { Progress } from '../game/types'

type Props = {
  currentId: string
  progress: Progress
  onSelect: (id: string) => void
  onReset: () => void
}

export default function LevelNav({ currentId, progress, onSelect, onReset }: Props) {
  const { t } = useI18n()
  const done = Object.keys(progress).length

  return (
    <nav className="flex flex-col gap-5">
      <div>
        <h2 className="text-xs uppercase tracking-widest text-slate-500">{t('nav.levels')}</h2>
        <p className="text-sm text-slate-400">
          {t('nav.progress', { done, total: LEVELS.length })}
        </p>
      </div>

      {CHAPTERS.map((chapter) => (
        <div key={chapter}>
          <h3 className="mb-2 text-sm font-medium text-slate-300">
            {t(`nav.chapter.${chapter}` as DictKey)}
          </h3>
          <ul className="flex flex-col gap-1">
            {levelsOfChapter(chapter).map((level) => {
              const result = progress[level.id]
              const active = level.id === currentId
              return (
                <li key={level.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(level.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                      active
                        ? 'bg-orange-500/15 text-orange-200'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{t(`level.${level.id}.title` as DictKey)}</span>
                    <span className="shrink-0 font-mono text-xs text-amber-400">
                      {result ? '★'.repeat(result.stars) : ''}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <button
        type="button"
        onClick={onReset}
        className="mt-2 self-start text-xs text-slate-500 underline-offset-4 transition hover:text-rose-400 hover:underline"
      >
        {t('nav.reset')}
      </button>
    </nav>
  )
}
