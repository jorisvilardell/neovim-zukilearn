import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Project page on GitHub Pages: https://<user>.github.io/neovim-zukilearn/
export default defineConfig({
  base: '/neovim-zukilearn/',
  plugins: [react(), tailwindcss()],
})
