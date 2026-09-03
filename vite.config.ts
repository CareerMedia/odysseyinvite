import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages base path
 * -----------------------------------------
 * This repository is CareerMedia/odysseyinvite, so the public site
 * is served from https://<user>.github.io/odysseyinvite/
 *
 * If the repository is renamed, change GIT_PAGES_BASE to match:
 *   '/your-repo-name/'
 *
 * Use '/' only if the site is hosted at the domain root.
 */
export const GIT_PAGES_BASE = '/odysseyinvite/'

export default defineConfig(({ command, mode }) => ({
  // Dev stays at `/`. Production build AND `vite preview` use the GitHub Pages subdirectory
  // so audio, fonts, and other public files resolve the same way they will on the live site.
  base: command === 'serve' && mode === 'development' ? '/' : GIT_PAGES_BASE,
  plugins: [react()],
}))
