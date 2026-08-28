// Renders public/favicon.svg from the Zuki component itself, so the tab icon
// always matches the mascot in the app. Run with: node scripts/gen-favicon.mjs
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Zuki } from '@zukquote/zuki-react'

const html = renderToStaticMarkup(
  createElement(Zuki, { pose: 'idle', theme: 'orange', accessory: 'beanie', hideLimbs: true, size: 64 }),
)
import { writeFileSync } from 'node:fs'

writeFileSync(new URL('../public/favicon.svg', import.meta.url), `${html}\n`)

