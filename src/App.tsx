import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Editor, { type EditorHandle, type EditorSnapshot } from './components/Editor'
import Footer from './components/Footer'
import KeyLog from './components/KeyLog'
import { displayKey } from './components/keyDisplay'
import LevelNav from './components/LevelNav'
import LevelPanel from './components/LevelPanel'
import Navbar from './components/Navbar'
import ZukiDialogue, { type DialoguePhase } from './components/ZukiDialogue'
import { LEVELS, levelIndex, levelsOfChapter } from './game/levels'
import { loadProgress, resetProgress, saveResult } from './game/progress'
import type { LevelResult } from './game/types'
import { useHashLevel } from './game/useHashLevel'
import { isSolved, starsFor } from './game/validate'
import type { DictKey } from './i18n/dict'
import { useI18n } from './i18n/useI18n'

const RECENT_KEYS = 12
/** How long Zuki takes to confirm a solution, in milliseconds. */
const CHECK_DURATION = 1200
const CHECK_TICK = 60

export default function App() {
  const { t } = useI18n()
  const [progress, setProgress] = useState(loadProgress)
  const firstUnsolved = LEVELS.find((level) => !progress[level.id]) ?? LEVELS[0]
  const { level, goToLevel } = useHashLevel(firstUnsolved.id)

  const [resetNonce, setResetNonce] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  // Counted in a ref too: the solving keystroke must already be included when
  // the editor reports the winning snapshot in the same event.
  const keystrokesRef = useRef(0)
  const editorRef = useRef<EditorHandle | null>(null)
  const [recent, setRecent] = useState<string[]>([])
  const [mode, setMode] = useState<EditorSnapshot['mode']>('normal')
  const [result, setResult] = useState<LevelResult | null>(null)
  const [hintShown, setHintShown] = useState(false)
  // Non-null while Zuki is checking a solution that still has to hold still.
  const [checkProgress, setCheckProgress] = useState<number | null>(null)
  const checkTimer = useRef<number | null>(null)

  const index = levelIndex(level.id)
  const hasNext = index >= 0 && index < LEVELS.length - 1

  const stopChecking = useCallback(() => {
    if (checkTimer.current !== null) {
      window.clearInterval(checkTimer.current)
      checkTimer.current = null
    }
    setCheckProgress(null)
  }, [])

  useEffect(() => stopChecking, [stopChecking])

  const restart = useCallback(() => {
    stopChecking()
    setResetNonce((nonce) => nonce + 1)
    keystrokesRef.current = 0
    setKeystrokes(0)
    setRecent([])
    setResult(null)
    setHintShown(false)
    editorRef.current?.focus()
  }, [stopChecking])

  const selectLevel = useCallback(
    (id: string) => {
      goToLevel(id)
      restart()
    },
    [goToLevel, restart],
  )

  const onKeystroke = useCallback((key: string) => {
    keystrokesRef.current += 1
    setKeystrokes(keystrokesRef.current)
    setRecent((keys) => [...keys, displayKey(key)].slice(-RECENT_KEYS))
  }, [])

  const commitResult = useCallback(() => {
    const solvedWith = Math.max(keystrokesRef.current, 1)
    const levelResult: LevelResult = {
      keystrokes: solvedWith,
      stars: starsFor(level, solvedWith),
    }
    setResult(levelResult)
    setProgress((current) => saveResult(current, level.id, levelResult))
  }, [level])

  const onSnapshot = useCallback(
    (snapshot: EditorSnapshot) => {
      setMode(snapshot.mode)
      if (result) return

      const solved = isSolved(level.validate, snapshot.doc, snapshot.cursor)
      if (!solved) {
        // The buffer moved away from the answer while Zuki was checking.
        if (checkTimer.current !== null) stopChecking()
        return
      }
      if (checkTimer.current !== null) return

      // Let the solution sit for a moment instead of interrupting straight away.
      const startedAt = performance.now()
      setCheckProgress(0)
      checkTimer.current = window.setInterval(() => {
        const ratio = Math.min(1, (performance.now() - startedAt) / CHECK_DURATION)
        setCheckProgress(ratio)
        if (ratio >= 1) {
          stopChecking()
          commitResult()
        }
      }, CHECK_TICK)
    },
    [level, result, commitResult, stopChecking],
  )

  const everySolved = useMemo(
    () => LEVELS.every((item) => progress[item.id]),
    [progress],
  )

  const phase: DialoguePhase = result
    ? everySolved
      ? 'finished'
      : 'solved'
    : checkProgress !== null
      ? 'checking'
      : mode === 'insert'
        ? 'typing'
        : keystrokes > level.par * 2
          ? 'stuck'
          : 'idle'

  const message = (() => {
    switch (phase) {
      case 'checking':
        return t('zuki.checking')
      case 'solved':
        return t(`level.${level.id}.success` as DictKey)
      case 'finished':
        return t('victory.finished')
      case 'typing':
        return t('zuki.typing')
      case 'stuck':
        return t('zuki.stuck')
      default:
        return t(`level.${level.id}.task` as DictKey)
    }
  })()

  // On the first level of a chapter Zuki opens with what the chapter is about.
  const opensChapter = levelsOfChapter(level.chapter)[0]?.id === level.id

  const aside = (() => {
    if (hintShown) return t(`level.${level.id}.hint` as DictKey)
    if (phase === 'solved' || phase === 'finished') return null
    if (phase === 'idle') return opensChapter ? t(`chapter.${level.chapter}.intro` as DictKey) : null
    return t(`level.${level.id}.task` as DictKey)
  })()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-3 sm:p-6 lg:flex-row lg:gap-6">
        <aside className="order-3 w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 lg:order-1 lg:w-60">
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

        <div className="order-1 flex min-w-0 flex-1 flex-col gap-4 lg:order-2">
          <ZukiDialogue
            phase={phase}
            mode={mode}
            message={message}
            aside={aside}
            checkProgress={checkProgress ?? 0}
          />

          <section className="flex flex-col gap-2">
            <KeyLog mode={mode} keystrokes={keystrokes} par={level.par} recent={recent} />
            <div className="h-[45vh] min-h-[16rem] lg:h-[55vh]">
              <Editor
                ref={editorRef}
                level={level}
                resetNonce={resetNonce}
                onSnapshot={onSnapshot}
                onKeystroke={onKeystroke}
              />
            </div>
            <p className="text-xs text-slate-500">{t('editor.hintFocus')}</p>
          </section>
        </div>

        <aside className="order-2 w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 lg:order-3 lg:w-72">
          <LevelPanel
            level={level}
            index={index}
            total={LEVELS.length}
            cleared={Boolean(progress[level.id])}
            result={result}
            hintShown={hintShown}
            hasNext={hasNext}
            onToggleHint={() => {
              setHintShown((value) => !value)
              editorRef.current?.focus()
            }}
            onReset={restart}
            onNext={() => selectLevel(LEVELS[index + 1].id)}
          />
        </aside>
      </main>

      <Footer />
    </div>
  )
}
