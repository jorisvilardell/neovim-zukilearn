/** Turn a KeyboardEvent.key into something that looks like vim notation. */
export function displayKey(key: string): string {
  switch (key) {
    case ' ':
      return '␣'
    case 'Escape':
      return 'Esc'
    case 'Enter':
      return '⏎'
    case 'Backspace':
      return '⌫'
    case 'Tab':
      return '⇥'
    case 'ArrowLeft':
      return '←'
    case 'ArrowRight':
      return '→'
    case 'ArrowUp':
      return '↑'
    case 'ArrowDown':
      return '↓'
    default:
      return key
  }
}
