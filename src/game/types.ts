export type ChapterId = 'motions' | 'operators' | 'textobjects' | 'visual' | 'search'

export type Cursor = { line: number; col: number }

export type Validation =
  | { kind: 'doc'; target: string }
  | { kind: 'cursor'; line: number; col: number }
  | { kind: 'both'; target: string; line: number; col: number }
  | { kind: 'predicate'; fn: (doc: string, cursor: Cursor) => boolean }

export type Level = {
  id: string
  chapter: ChapterId
  doc: string
  cursor: Cursor
  validate: Validation
  /** Keystroke budget for a three-star clear. */
  par: number
  /** Keys highlighted as the lesson of this level. */
  teaches: string[]
}

export type LevelResult = {
  keystrokes: number
  stars: 1 | 2 | 3
}

export type Progress = Record<string, LevelResult>
