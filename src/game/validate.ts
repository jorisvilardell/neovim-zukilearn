import type { Cursor, Level, Validation } from './types'

export function isSolved(validation: Validation, doc: string, cursor: Cursor): boolean {
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
  }
}

export function starsFor(level: Level, keystrokes: number): 1 | 2 | 3 {
  if (keystrokes <= level.par) return 3
  if (keystrokes <= Math.ceil(level.par * 1.5)) return 2
  return 1
}

/** The expected buffer once solved, when the level defines one. */
export function targetDoc(level: Level): string | null {
  const v = level.validate
  return v.kind === 'doc' || v.kind === 'both' ? v.target : null
}
