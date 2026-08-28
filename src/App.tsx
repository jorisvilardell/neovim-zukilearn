import { useCallback, useMemo, useState } from 'react'
import Editor, { type EditorSnapshot } from './components/Editor'
import Footer from './components/Footer'
import KeyLog from './components/KeyLog'
import { displayKey } from './components/keyDisplay'
import LevelNav from './components/LevelNav'
import LevelPanel from './components/LevelPanel'
import Navbar from './components/Navbar'
import VictoryModal from './components/VictoryModal'
import ZukiCoach, { type CoachState } from './components/ZukiCoach'
import { LEVELS, levelIndex } from './game/levels'
import { loadProgress, resetProgress, saveResult } from './game/progress'
import type { LevelResult } from './game/types'
import { useHashLevel } from './game/useHashLevel'
import { isSolved, starsFor } from './game/validate'
import { useI18n } from './i18n/useI18n'

const RECENT_KEYS = 12

export default function App() {
  const { t } = useI18n()
  const [progress, setProgress] = useState(loadProgress)
  const firstUnsolved = LEVELS.find((level) => !progress[level.id]) ?? LEVELS[0]
  const { level, goToLevel } = useHashLevel(firstUnsolved.id)

  const [resetNonce, setResetNonce] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  const [mode, setMode] = useState<EditorSnapshot['mode']>('normal')
  const [result, setResult] = useState<LevelResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const index = levelIndex(level.id)
  const hasNext = index >= 0 && index < LEVELS.length - 1

  const restart = useCallback(() => {
    setResetNonce((nonce) => nonce + 1)
    setKeystrokes(0)
    setRecent([])
    setResult(null)
    setModalOpen(false)
  }, [])

  const selectLevel = useCallback(
    (id: string) => {
      goToLevel(id)
      restart()
    },
    [goToLevel, restart],
  )

  const onKeystroke = useCallback((key: string) => {
    setKeystrokes((count) => count + 1)
    setRecent((keys) => [...keys, displayKey(key)].slice(-RECENT_KEYS))
  }, [])

  const onSnapshot = useCallback(
    (snapshot: EditorSnapshot) => {
      setMode(snapshot.mode)
      if (result) return
      if (!isSolved(level.validate, snapshot.doc, snapshot.cursor)) return
      // The keystroke that solved the level is counted by the same event batch.
      setKeystrokes((count) => {
        const solvedWith = Math.max(count, 1)
        const levelResult: LevelResult = { keystrokes: solvedWith, stars: starsFor(level, solvedWith) }
        setResult(levelResult)
        setModalOpen(true)
        setProgress((current) => saveResult(current, level.id, levelResult))
        return count
      })
    },
    [level, result],
  )

  const coachState: CoachState = useMemo(() => {
    const everySolved = LEVELS.every((item) => progress[item.id])
    if (result) return everySolved ? 'finished' : 'solved'
    if (mode === 'insert') return 'typing'
    if (keystrokes > level.par * 2) return 'stuck'
    return 'idle'
  }, [result, mode, keystrokes, level.par, progress])

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
        <aside className="order-3 w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 lg:order-1 lg:w-64 lg:overflow-y-auto">
          <LevelNav
            currentId={level.id}
            progress={progress}
            onSelect={selectLevel}
            onReset={() => {
              if (window.confirm(t('nav.resetConfirm'))) {
                setProgress(resetProgress())
                restart()
              }
            }}
          />
        </aside>

        <section className="order-1 flex min-h-[24rem] flex-1 flex-col gap-3 lg:order-2">
          <KeyLog mode={mode} keystrokes={keystrokes} par={level.par} recent={recent} />
          <div className="min-h-[20rem] flex-1">
            <Editor
              level={level}
              resetNonce={resetNonce}
              onSnapshot={onSnapshot}
              onKeystroke={onKeystroke}
            />
          </div>
          <p className="text-xs text-slate-500">{t('editor.hintFocus')}</p>
        </section>

        <aside className="order-2 w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 lg:order-3 lg:w-80">
          <LevelPanel
            level={level}
            index={index}
            total={LEVELS.length}
            solved={Boolean(progress[level.id])}
            onReset={restart}
          />
          <div className="mt-6 border-t border-slate-800 pt-4">
            <ZukiCoach state={coachState} mode={mode} />
          </div>
        </aside>
      </main>

      <Footer />

      {modalOpen && result && (
        <VictoryModal
          result={result}
          par={level.par}
          hasNext={hasNext}
          onNext={() => selectLevel(LEVELS[index + 1].id)}
          onRetry={restart}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
