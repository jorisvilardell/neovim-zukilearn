import type { Cursor, Level, Validation, VimMode } from './types'

export function isSolved(
  validation: Validation,
  doc: string,
  cursor: Cursor,
  mode: VimMode,
): boolean {
  switch (validation.kind) {
    case 'doc':
      return doc === validation.target
    case 'cursor':
      return cursor.line === validation.line && cursor.col === validation.col
    case 'both':
      return (
        doc === validation.target &&
        cursor.line === validation.line &&
        cursor.col === validation.col
      )
    case 'predicate':
      return validation.fn(doc, cursor)
    case 'mode':
      return mode === validation.mode
    case 'command':
      // Ex commands are reported by the editor, not read from the buffer.
      return false
  }
}

export function starsFor(level: Level, keystrokes: number): 1 | 2 | 3 {
  if (keystrokes <= level.par) return 3
  if (keystrokes <= Math.ceil(level.par * 1.5)) return 2
  return 1
}

/** The expected buffer for one validation, when it defines one. */
export function targetDoc(validation: Validation): string | null {
  return validation.kind === 'doc' || validation.kind === 'both' ? validation.target : null
}
