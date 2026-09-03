# Future production artwork

Phase 1 uses layered CSS and SVG illustrations so the invitation already feels cinematic without large raster files.

When final painted artwork is ready, drop optimized assets here and import them through JavaScript so Vite can hash paths for GitHub Pages.

## Recommended locations and sizes

| Asset | Path | Ideal size | Notes |
| --- | --- | --- | --- |
| Opening ocean plate | `src/assets/environments/ocean-night.webp` | 2400 × 1400 | Optional painted backdrop behind procedural waves |
| Hero ship | `src/assets/ship/odyssey-ship.webp` | 1600 × 900, transparent | Replaces the SVG vessel if needed |
| Voyage map | `src/assets/map/voyage-map.webp` | 3400 × 2000 | Full illustrated chart |
| Island plates | `src/assets/destinations/{id}.webp` | 1600 × 1200 | One per major chapter |
| Fog / cloud tiles | `src/assets/effects/fog.webp` | 1200 × 800, transparent | Soft-edged, tileable |
| Ambient audio | `public/audio/*.mp3` | 96–128 kbps | Optional replacements for procedural sound |

Do not place files at absolute URLs such as `/images/ship.png`. Import from `src/assets` or use `publicAsset()` from `src/utils/assets.ts`.
