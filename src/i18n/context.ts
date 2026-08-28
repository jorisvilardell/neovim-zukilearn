import { createContext } from 'react'
import type { DictKey, Lang } from './dict'

export type I18n = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: DictKey, vars?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18n | null>(null)
