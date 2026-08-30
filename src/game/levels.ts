import type { ChapterId, Level } from './types'

export const CHAPTERS: ChapterId[] = [
  'basics',
  'motions',
  'operators',
  'textobjects',
  'visual',
  'search',
]

const doc = (...lines: string[]) => lines.join('\n')

/**
 * Levels are played in steps on a single buffer: every key a level advertises
 * has to be used at least once before the level is cleared. Docs never end
 * with a newline so that `doc` validation stays an exact string comparison.
 */
export const LEVELS: Level[] = [
  // ----------------------------------------------------------------- basics
  {
    id: 'modes',
    chapter: 'basics',
    doc: doc('vim has modes.', 'normal moves, insert types, visual selects.'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'mode', mode: 'insert' } },
      { validate: { kind: 'mode', mode: 'normal' } },
      { validate: { kind: 'mode', mode: 'visual' } },
      { validate: { kind: 'mode', mode: 'normal' } },
    ],
    par: 4,
    teaches: ['i', 'Esc', 'v'],
  },
  {
    id: 'insert-text',
    chapter: 'basics',
    doc: 'hello',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: 'Zuki hello' } },
      { validate: { kind: 'doc', target: 'Zuki hello!' } },
    ],
    par: 16,
    teaches: ['i', 'a', 'A', 'Esc'],
  },
  {
    id: 'open-line',
    chapter: 'basics',
    doc: 'first line',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('first line', 'second line') } },
      { validate: { kind: 'doc', target: doc('zero line', 'first line', 'second line') } },
    ],
    par: 30,
    teaches: ['o', 'O', 'Esc'],
  },
  {
    id: 'save-quit',
    chapter: 'basics',
    doc: doc('In a terminal, :w writes the file and :q closes vim.', 'Here the game listens to them instead.'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'command', command: 'w' } },
      { validate: { kind: 'command', command: 'q' } },
    ],
    par: 8,
    teaches: [':w', ':q', ':wq', ':q!'],
  },

  // ---------------------------------------------------------------- motions
  {
    id: 'hjkl',
    chapter: 'motions',
    doc: doc('. . . . . . .', '. . . . . . .', '. . . X . . .', '. . . . . . .'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 2, col: 6 } },
      { validate: { kind: 'cursor', line: 0, col: 0 } },
    ],
    par: 16,
    teaches: ['h', 'j', 'k', 'l'],
  },
  {
    id: 'word',
    chapter: 'motions',
    doc: 'Zuki the crab moves fast across the buffer',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 0, col: 25 } },
      { validate: { kind: 'cursor', line: 0, col: 9 } },
    ],
    par: 8,
    teaches: ['w', 'b'],
  },
  {
    id: 'end-of-word',
    chapter: 'motions',
    doc: 'neovim rewards precise motions',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 0, col: 21 } },
      { validate: { kind: 'cursor', line: 0, col: 29 } },
    ],
    par: 4,
    teaches: ['e', 'b'],
  },
  {
    id: 'line-ends',
    chapter: 'motions',
    doc: doc('jump to the very end of this line', 'and back to the very beginning'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 0, col: 32 } },
      { validate: { kind: 'cursor', line: 1, col: 0 } },
    ],
    par: 3,
    teaches: ['0', '^', '$'],
  },
  {
    id: 'file-ends',
    chapter: 'motions',
    doc: doc('line one', 'line two', 'line three', 'line four', 'line five', 'the end'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 5, col: 0 } },
      { validate: { kind: 'cursor', line: 0, col: 0 } },
    ],
    par: 3,
    teaches: ['gg', 'G'],
  },
  {
    id: 'goto-line',
    chapter: 'motions',
    doc: doc(
      'alpha',
      'bravo',
      'charlie',
      'delta',
      'echo',
      'foxtrot',
      'golf',
      'hotel',
      'india',
      'juliett',
    ),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 6, col: 0 } },
      { validate: { kind: 'cursor', line: 1, col: 0 } },
    ],
    par: 5,
    teaches: ['7G', '2G', ':7'],
  },
  {
    id: 'find-char',
    chapter: 'motions',
    doc: 'find the ; then stop right there',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 0, col: 9 } },
      { validate: { kind: 'cursor', line: 0, col: 8 } },
    ],
    par: 5,
    teaches: ['f', 't', '0'],
  },
  {
    id: 'paragraphs',
    chapter: 'motions',
    doc: doc(
      'first paragraph line one',
      'first paragraph line two',
      '',
      'second paragraph line one',
      '',
      'third paragraph line one',
    ),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 4, col: 0 } },
      { validate: { kind: 'cursor', line: 2, col: 0 } },
    ],
    par: 3,
    teaches: ['{', '}'],
  },

  // -------------------------------------------------------------- operators
  {
    id: 'delete-char',
    chapter: 'operators',
    doc: 'Zukii the crab',
    cursor: { line: 0, col: 4 },
    steps: [
      { validate: { kind: 'doc', target: 'Zuki the crab' } },
      { validate: { kind: 'doc', target: 'Zukii the crab' } },
      { validate: { kind: 'doc', target: 'Zuki the crab' } },
    ],
    par: 4,
    teaches: ['x', 'u', 'Ctrl-r'],
  },
  {
    id: 'delete-line',
    chapter: 'operators',
    doc: doc('keep this line', 'delete this line', 'keep this line too'),
    cursor: { line: 1, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('keep this line', 'keep this line too') } },
      {
        validate: {
          kind: 'doc',
          target: doc('keep this line', 'keep this line too', 'delete this line'),
        },
      },
    ],
    par: 4,
    teaches: ['dd', 'p'],
  },
  {
    id: 'delete-word',
    chapter: 'operators',
    doc: 'vim deletes junk words fast',
    cursor: { line: 0, col: 12 },
    steps: [
      { validate: { kind: 'doc', target: 'vim deletes words fast' } },
      { validate: { kind: 'doc', target: 'vim deletes fast' } },
    ],
    par: 4,
    teaches: ['dw', 'de'],
  },
  {
    id: 'delete-to-end',
    chapter: 'operators',
    doc: 'keep this. delete the rest of this line',
    cursor: { line: 0, col: 10 },
    steps: [
      { validate: { kind: 'doc', target: 'keep this.' } },
      { validate: { kind: 'doc', target: 'keep this. delete the rest of this line' } },
      { validate: { kind: 'doc', target: '' } },
    ],
    par: 5,
    teaches: ['D', 'u', '0', 'd$'],
  },
  {
    id: 'change-word',
    chapter: 'operators',
    doc: 'zuki is a bug',
    cursor: { line: 0, col: 10 },
    steps: [
      { validate: { kind: 'doc', target: 'zuki is a crab' } },
      { validate: { kind: 'doc', target: 'Zuki is a crab' } },
    ],
    par: 14,
    teaches: ['cw', '0', 'Esc'],
  },
  {
    id: 'yank-put',
    chapter: 'operators',
    doc: 'copy me',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('copy me', 'copy me') } },
      { validate: { kind: 'doc', target: doc('copy me', 'copy me', 'copy me') } },
    ],
    par: 5,
    teaches: ['yy', 'p', 'P'],
  },
  {
    id: 'counts',
    chapter: 'operators',
    doc: doc('keep', 'drop 1', 'drop 2', 'drop 3', 'keep too'),
    cursor: { line: 1, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('keep', 'keep too') } },
      {
        validate: {
          kind: 'doc',
          target: doc('keep', 'drop 1', 'drop 2', 'drop 3', 'keep too'),
        },
      },
    ],
    par: 4,
    teaches: ['3dd', 'u'],
  },
  {
    id: 'move-line',
    chapter: 'operators',
    doc: doc('second', 'first'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: 'first' } },
      { validate: { kind: 'doc', target: doc('first', 'second') } },
    ],
    par: 3,
    teaches: ['dd', 'p'],
  },

  // ------------------------------------------------------------ textobjects
  {
    id: 'inner-word',
    chapter: 'textobjects',
    doc: 'total = old + new',
    cursor: { line: 0, col: 9 },
    steps: [
      { validate: { kind: 'doc', target: 'total =  + new' } },
      { validate: { kind: 'doc', target: 'total =  + old' } },
    ],
    par: 11,
    teaches: ['diw', 'ciw'],
  },
  {
    id: 'a-word',
    chapter: 'textobjects',
    doc: 'remove the noise word here',
    cursor: { line: 0, col: 13 },
    steps: [
      { validate: { kind: 'doc', target: 'remove the word here' } },
      { validate: { kind: 'doc', target: 'remove the here' } },
    ],
    par: 6,
    teaches: ['daw'],
  },
  {
    id: 'inner-quotes',
    chapter: 'textobjects',
    doc: 'const greeting = "hello"',
    cursor: { line: 0, col: 20 },
    steps: [
      { validate: { kind: 'doc', target: 'const greeting = "zuki"' } },
      { validate: { kind: 'doc', target: 'const greeting = ""' } },
    ],
    par: 11,
    teaches: ['ci"', 'di"'],
  },
  {
    id: 'inner-parens',
    chapter: 'textobjects',
    doc: 'call(remove, these, args)',
    cursor: { line: 0, col: 8 },
    steps: [
      { validate: { kind: 'doc', target: 'call()' } },
      { validate: { kind: 'doc', target: 'call(zuki)' } },
    ],
    par: 11,
    teaches: ['di(', 'ci('],
  },
  {
    id: 'inner-braces',
    chapter: 'textobjects',
    doc: 'const zuki = { theme: "orange" }',
    cursor: { line: 0, col: 20 },
    steps: [
      { validate: { kind: 'doc', target: 'const zuki = {}' } },
      { validate: { kind: 'doc', target: 'const zuki = {crab}' } },
    ],
    par: 11,
    teaches: ['di{', 'ci{'],
  },
  {
    id: 'a-paragraph',
    chapter: 'textobjects',
    doc: doc(
      'keep this line',
      '',
      'delete this paragraph',
      'delete this line too',
      '',
      'keep this last line',
    ),
    cursor: { line: 2, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('keep this line', '', 'keep this last line') } },
      {
        validate: {
          kind: 'doc',
          target: doc(
            'keep this line',
            '',
            'delete this paragraph',
            'delete this line too',
            '',
            'keep this last line',
          ),
        },
      },
      {
        validate: {
          kind: 'doc',
          target: doc('keep this line', '', '', 'keep this last line'),
        },
      },
    ],
    par: 8,
    teaches: ['dap', 'u', 'dip'],
  },

  // ----------------------------------------------------------------- visual
  {
    id: 'visual-char',
    chapter: 'visual',
    doc: 'visual mode selects text',
    cursor: { line: 0, col: 7 },
    steps: [
      { validate: { kind: 'doc', target: 'visual  selects text' } },
      { validate: { kind: 'doc', target: 'visual  SELECTS text' } },
    ],
    par: 7,
    teaches: ['v', 'e', 'd', 'U'],
  },
  {
    id: 'visual-line',
    chapter: 'visual',
    doc: doc('keep the first line', 'drop the middle line', 'keep the last line'),
    cursor: { line: 1, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('keep the first line', 'keep the last line') } },
      { validate: { kind: 'doc', target: '' } },
    ],
    par: 8,
    teaches: ['V', 'j', 'd', 'gg'],
  },
  {
    id: 'visual-block',
    chapter: 'visual',
    doc: doc('- alpha', '- bravo', '- charlie'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('alpha', 'bravo', 'charlie') } },
      { validate: { kind: 'doc', target: doc('- alpha', '- bravo', '- charlie') } },
    ],
    par: 14,
    teaches: ['Ctrl-v', 'x', 'I'],
  },
  {
    id: 'visual-indent',
    chapter: 'visual',
    doc: doc('if (zuki) {', 'call()', '}'),
    cursor: { line: 1, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('if (zuki) {', '  call()', '}') } },
      { validate: { kind: 'doc', target: doc('if (zuki) {', 'call()', '}') } },
    ],
    par: 5,
    teaches: ['V', '>', '<'],
  },
  {
    id: 'visual-case',
    chapter: 'visual',
    doc: 'SHOUTING LINE HERE',
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: 'shouting line here' } },
      { validate: { kind: 'doc', target: 'SHOUTING LINE HERE' } },
    ],
    par: 5,
    teaches: ['V', 'u', 'U', '~'],
  },

  // ----------------------------------------------------------------- search
  {
    id: 'search-next',
    chapter: 'search',
    doc: doc('find the hidden crab', 'somewhere in this buffer', 'the crab is here'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 2, col: 4 } },
      { validate: { kind: 'cursor', line: 0, col: 16 } },
    ],
    par: 9,
    teaches: ['/', 'n', 'N'],
  },
  {
    id: 'search-word',
    chapter: 'search',
    doc: doc('zuki waves', 'other line', 'zuki waves again'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'cursor', line: 2, col: 0 } },
      { validate: { kind: 'cursor', line: 0, col: 0 } },
    ],
    par: 3,
    teaches: ['*', '#'],
  },
  {
    id: 'substitute',
    chapter: 'search',
    doc: doc('bug in line one', 'bug in line two', 'bug in line three'),
    cursor: { line: 0, col: 0 },
    steps: [
      {
        validate: {
          kind: 'doc',
          target: doc('crab in line one', 'crab in line two', 'crab in line three'),
        },
      },
      {
        validate: {
          kind: 'doc',
          target: doc('crab in line 1', 'crab in line two', 'crab in line three'),
        },
      },
    ],
    par: 30,
    teaches: [':%s/old/new/g', ':%s/old/new/'],
  },
  {
    id: 'dot-repeat',
    chapter: 'search',
    doc: doc('drop junk here', 'drop junk there', 'drop junk everywhere'),
    cursor: { line: 0, col: 5 },
    steps: [
      { validate: { kind: 'doc', target: doc('drop here', 'drop there', 'drop everywhere') } },
      {
        validate: {
          kind: 'doc',
          target: doc('drop here!', 'drop there!', 'drop everywhere!'),
        },
      },
    ],
    par: 14,
    teaches: ['dw', '.', 'A'],
  },
  {
    id: 'macro',
    chapter: 'search',
    doc: doc('1 alpha', '2 bravo', '3 charlie', '4 delta'),
    cursor: { line: 0, col: 0 },
    steps: [
      { validate: { kind: 'doc', target: doc('alpha', 'bravo', 'charlie', 'delta') } },
      {
        validate: {
          kind: 'doc',
          target: doc('- alpha', '- bravo', '- charlie', '- delta'),
        },
      },
    ],
    par: 26,
    teaches: ['qa', 'q', '@a', 'I'],
  },
]

export function levelIndex(id: string): number {
  return LEVELS.findIndex((level) => level.id === id)
}

export function levelById(id: string): Level | undefined {
  return LEVELS.find((level) => level.id === id)
}

export function levelsOfChapter(chapter: ChapterId): Level[] {
  return LEVELS.filter((level) => level.chapter === chapter)
}
