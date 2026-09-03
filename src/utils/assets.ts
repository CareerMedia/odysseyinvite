/**
 * GitHub Pages-safe public asset URLs.
 * Always go through this helper instead of hard-coding `/audio/...` paths.
 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
