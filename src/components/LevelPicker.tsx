import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, LEVELS, levelIndex, levelsOfChapter } from '../game/levels'
import type { DictKey } from '../i18n/dict'
import { useI18n } from '../i18n/useI18n'
import type { Progress } from '../game/types'

type Props = {
  currentId: string
  progress: Progress
  onSelect: (id: string) => void
  onResetProgress: () => void
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="3.5" width="15" height="14" rx="2.5" />
      <path d="M2.5 7.5h15M6.5 2v3M13.5 2v3" strokeLinecap="round" />
      <circle cx="7" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="7" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function LevelPicker({ currentId, progress, onSelect, onResetProgress }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const index = levelIndex(currentId)
  const done = Object.keys(progress).length

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1.5 text-sm text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
      >
        <GridIcon />
        <span className="font-mono text-xs">
          {index + 1}/{LEVELS.length}
        </span>
        <span className="hidden sm:inline">{t('nav.showLevels')}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-label={t('nav.levels')}
            className="flex h-full w-[19rem] max-w-[85vw] flex-col gap-4 overflow-y-auto border-r border-slate-800 bg-slate-950 p-4 shadow-2xl outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xs tracking-widest text-slate-500 uppercase">
                  {t('nav.levels')}
                </h2>
                <p className="text-sm text-slate-400">
                  {t('nav.progress', { done, total: LEVELS.length })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('nav.hideLevels')}
                className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-slate-400 transition hover:border-orange-400 hover:text-orange-300"
              >
                ✕
              </button>
            </div>

            {CHAPTERS.map((chapter) => (
              <section key={chapter}>
                <h3 className="mb-2 text-sm font-medium text-slate-300">
                  {t(`nav.chapter.${chapter}` as DictKey)}
                </h3>
                {/* Compact numbered grid, the way a date picker shows its days. */}
                <div className="grid grid-cols-6 gap-1.5">
                  {levelsOfChapter(chapter).map((level) => {
                    const number = levelIndex(level.id) + 1
                    const result = progress[level.id]
                    const active = level.id === currentId
                    const base =
                      'flex h-9 flex-col items-center justify-center rounded-md border text-xs transition'
                    const tone = active
                      ? 'border-orange-400 bg-orange-500/20 text-orange-200'
                      : result
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    return (
                      <button
                        key={level.id}
                        type="button"
                        title={t(`level.${level.id}.title` as DictKey)}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => {
                          onSelect(level.id)
                          setOpen(false)
                        }}
                        className={`${base} ${tone}`}
                      >
                        <span className="font-mono leading-none">{number}</span>
                        <span className="mt-0.5 h-2 text-[0.5rem] leading-none text-amber-400">
                          {result ? '★'.repeat(result.stars) : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}

            <p className="mt-1 truncate text-xs text-slate-500">
              {index + 1}. {t(`level.${currentId}.title` as DictKey)}
            </p>

            <button
              type="button"
              onClick={onResetProgress}
              className="self-start text-xs text-slate-500 underline-offset-4 transition hover:text-rose-400 hover:underline"
            >
              {t('nav.reset')}
            </button>
          </div>

          <button
            type="button"
            aria-label={t('nav.hideLevels')}
            onClick={() => setOpen(false)}
            className="flex-1 cursor-default bg-slate-950/70 backdrop-blur-sm"
          />
        </div>
      )}
    </>
  )
}
