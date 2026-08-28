import { useCallback, useEffect, useState } from 'react'
import { LEVELS, levelById } from './levels'

function idFromHash(): string | null {
  const match = window.location.hash.match(/^#\/level\/([\w-]+)$/)
  return match && levelById(match[1]) ? match[1] : null
}

/** Keeps the current level id in the URL hash, without a router library. */
export function useHashLevel(fallbackId: string) {
  const [levelId, setLevelId] = useState<string>(() => idFromHash() ?? fallbackId)

  useEffect(() => {
    const onHashChange = () => {
      const next = idFromHash()
      if (next) setLevelId(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goToLevel = useCallback((id: string) => {
    if (!levelById(id)) return
    setLevelId(id)
    window.location.hash = `#/level/${id}`
  }, [])

  const level = levelById(levelId) ?? LEVELS[0]
  return { level, goToLevel }
}
