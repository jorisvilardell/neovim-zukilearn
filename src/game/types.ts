export type ChapterId =
  | 'basics'
  | 'motions'
  | 'operators'
  | 'textobjects'
  | 'visual'
  | 'search'

export type VimMode = 'normal' | 'insert' | 'visual' | 'replace'

export type Cursor = { line: number; col: number }

export type Validation =
  | { kind: 'doc'; target: string }
  | { kind: 'cursor'; line: number; col: number }
  | { kind: 'both'; target: string; line: number; col: number }
  | { kind: 'predicate'; fn: (doc: string, cursor: Cursor) => boolean }
  /** Waits for the editor to be in a given vim mode. */
  | { kind: 'mode'; mode: VimMode }
  /** Waits for an ex command such as :w or :q to be run. */
  | { kind: 'command'; command: string }

/** One task inside a level. Steps run on the same buffer, one after another. */
export type LevelStep = {
  validate: Validation
  /** Shown as the expected buffer when the check itself is tolerant. */
  expects?: string
}

export type Level = {
  id: string
  chapter: ChapterId
  doc: string
  cursor: Cursor
  /** Played in order; the level is cleared when the last one is done. */
  steps: LevelStep[]
  /** Keystroke budget for a three-star clear, for the whole level. */
  par: number
  /** Keys highlighted as the lesson of this level. */
  teaches: string[]
  /** Free play: keystrokes are not scored, so beginners can experiment. */
  freePlay?: boolean
}

export type LevelResult = {
  keystrokes: number
  stars: 1 | 2 | 3
}

export type Progress = Record<string, LevelResult>
