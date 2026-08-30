<div align="center">
  <h1>🦀 Zukilearn</h1>
  <p><strong>Learn Neovim motions by playing — a Flexbox-Froggy-style game hosted by Zuki.</strong></p>
</div>

---

Zukilearn is a pure frontend game: 36 short levels take you from « what is insert mode » to
macros, each one played inside a real editor. Every level runs in two or three steps, so the
keys it teaches are all used at least once — jump to the bottom with `G`, then back up with `gg`. Vim behavior comes from [CodeMirror 6](https://codemirror.net/) with
[@replit/codemirror-vim](https://github.com/replit/codemirror-vim), so the keys you learn are the
keys you use in Neovim. [Zuki](https://github.com/jorisvilardell/zuki) reacts to how you are doing.

## Chapters

1. **Basics** — modes (`i`, `Esc`, `v`), typing (`i a A`), new lines (`o O`), `:w` and `:q`
2. **Motions** — `h j k l`, `w b e`, `0 ^ $`, `gg G`, `f t`, `{ }`
3. **Operators** — `x`, `dd`, `dw`, `D`, `cw`, `yy p P`, counts, `u` / `Ctrl-r`
4. **Text objects** — `diw`, `daw`, `ci"`, `di(`, `di{`, `dap`
5. **Visual mode** — `v`, `V`, `Ctrl-v` (with `I`), `> <`, case switching
6. **Search & macros** — `/ n N`, `*`, `:%s`, `.`, `q@`

Zuki narrates: he introduces each chapter, states the task, hands out hints on request and
explains what just happened once a level is cleared — no modal ever interrupts you. When the
buffer matches the goal, a short gauge runs before the level is validated, so you can keep
typing and undo without being cut off.

Levels are picked from a collapsible side drawer: a small calendar-style button opens a numbered
grid, one section per chapter, showing which levels are cleared and how many stars they hold.

Each level scores you against a keystroke par: three stars for solving it within par.
Progress and language are stored in `localStorage`; the current level lives in the URL hash.

The tab icon is generated from the mascot itself with `node scripts/gen-favicon.mjs`.

## Development

```bash
pnpm install
pnpm run dev
```

Other scripts: `pnpm run lint`, `pnpm run build`, `pnpm run preview`.

## Deployment

Every push to `main` builds the app and deploys it to GitHub Pages
(`.github/workflows/deploy.yml`). The Pages source must be set to "GitHub Actions" in the
repository settings. The Vite `base` is `/neovim-zukilearn/`.

## License

MIT
