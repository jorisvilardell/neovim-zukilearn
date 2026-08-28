import { useEffect, useRef } from 'react'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { search } from '@codemirror/search'
import { vim, getCM } from '@replit/codemirror-vim'
import type { Cursor, Level } from '../game/types'

export type VimMode = 'normal' | 'insert' | 'visual' | 'replace'

export type EditorSnapshot = {
  doc: string
  cursor: Cursor
  mode: VimMode
}

type Props = {
  level: Level
  /** Bumped by the parent to reload the level from scratch. */
  resetNonce: number
  onSnapshot: (snapshot: EditorSnapshot) => void
  onKeystroke: (key: string) => void
}

const editorTheme = EditorView.theme(
  {
    '&': { fontSize: '16px', backgroundColor: 'transparent', height: '100%' },
    '.cm-scroller': {
      fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, monospace',
      lineHeight: '1.7',
      padding: '0.75rem 0',
    },
    '.cm-content': { caretColor: '#f97316' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#475569',
      border: 'none',
      paddingRight: '0.75rem',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(148, 163, 184, 0.08)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#f97316' },
    '.cm-fat-cursor': { background: '#f97316', color: '#0f172a' },
    '&:not(.cm-focused) .cm-fat-cursor': { background: 'none', outline: '1px solid #f97316' },
    '.cm-selectionBackground, ::selection': { backgroundColor: 'rgba(249, 115, 22, 0.3)' },
    '.cm-panels': { backgroundColor: '#0f172a', color: '#e2e8f0' },
    '.cm-vim-panel': { padding: '0.25rem 0.5rem', fontFamily: 'monospace' },
  },
  { dark: true },
)

/** Modifier-only presses are not keystrokes a vim user would count. */
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'])

function readMode(view: EditorView): VimMode {
  const cm = getCM(view) as { state?: { vim?: Record<string, unknown> } } | null
  const state = cm?.state?.vim
  if (!state) return 'normal'
  if (state.insertMode) return state.replaceMode ? 'replace' : 'insert'
  if (state.visualMode) return 'visual'
  return 'normal'
}

function snapshotOf(view: EditorView): EditorSnapshot {
  const head = view.state.selection.main.head
  const line = view.state.doc.lineAt(head)
  return {
    doc: view.state.doc.toString(),
    cursor: { line: line.number - 1, col: head - line.from },
    mode: readMode(view),
  }
}

export default function Editor({ level, resetNonce, onSnapshot, onKeystroke }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  // Callbacks live in refs so that changing them never rebuilds the editor.
  const snapshotRef = useRef(onSnapshot)
  const keystrokeRef = useRef(onKeystroke)
  snapshotRef.current = onSnapshot
  keystrokeRef.current = onKeystroke

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const extensions: Extension[] = [
      // vim() must come first so its keymap wins over the default one.
      vim({ status: true }),
      lineNumbers(),
      highlightActiveLine(),
      history(),
      search(),
      indentUnit.of('  '),
      EditorState.tabSize.of(2),
      editorTheme,
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged || update.selectionSet || update.focusChanged) {
          snapshotRef.current(snapshotOf(update.view))
        }
      }),
      EditorView.domEventHandlers({
        keydown: (event) => {
          if (!MODIFIER_KEYS.has(event.key)) keystrokeRef.current(event.key)
          return false
        },
      }),
    ]

    const view = new EditorView({
      state: EditorState.create({ doc: level.doc, extensions }),
      parent: host,
    })
    viewRef.current = view

    const offset = view.state.doc.line(level.cursor.line + 1).from + level.cursor.col
    view.dispatch({ selection: { anchor: offset, head: offset } })
    view.focus()
    snapshotRef.current(snapshotOf(view))

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [level, resetNonce])

  return (
    <div
      ref={hostRef}
      className="h-full overflow-auto rounded-xl border border-slate-700/70 bg-slate-900/80"
      onClick={() => viewRef.current?.focus()}
    />
  )
}
