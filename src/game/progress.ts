import type { LevelResult, Progress } from './types'

const KEY = 'zukilearn.progress.v1'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Progress) : {}
  } catch {
    return {}
  }
}

export function saveResult(progress: Progress, levelId: string, result: LevelResult): Progress {
  const previous = progress[levelId]
  // Keep the best run: more stars first, then fewer keystrokes.
  const keep =
    previous &&
    (previous.stars > result.stars ||
      (previous.stars === result.stars && previous.keystrokes <= result.keystrokes))
  const next: Progress = { ...progress, [levelId]: keep ? previous : result }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable (private mode): progress stays in memory only.
  }
  return next
}

export function resetProgress(): Progress {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  return {}
}
