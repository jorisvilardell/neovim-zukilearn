<div align="center">
  <h1>🦀 Zukilearn</h1>
  <p><strong>Learn Neovim motions by playing — a Flexbox-Froggy-style game hosted by Zuki.</strong></p>
</div>

---

Zukilearn is a pure frontend game: 32 short levels take you from `hjkl` to macros, each one
played inside a real editor. Vim behavior comes from [CodeMirror 6](https://codemirror.net/) with
[@replit/codemirror-vim](https://github.com/replit/codemirror-vim), so the keys you learn are the
keys you use in Neovim. [Zuki](https://github.com/jorisvilardell/zuki) reacts to how you are doing.

## Chapters

1. **Motions** — `h j k l`, `w b e`, `0 ^ $`, `gg G`, `f t`, `{ }`
2. **Operators** — `x`, `dd`, `dw`, `D`, `cw`, `yy p`, counts
3. **Text objects** — `diw`, `daw`, `ci"`, `di(`, `di{`, `dap`
4. **Visual mode** — `v`, `V`, `Ctrl-v`, `>`, case switching
5. **Search & macros** — `/ n N`, `*`, `:%s`, `.`, `q@`

Each level scores you against a keystroke par: three stars for solving it within par.
Progress and language are stored in `localStorage`; the current level lives in the URL hash.

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
