# The Career Center Odyssey

A cinematic, interactive invitation for **CSUN Career Center Fall 2026 Cross Training**.

Friday, September 11, 2026 · 8:30 AM – 4:00 PM · CSUN Career Center

> One ship. One crew. One day of discovery.

This is a fully static front-end experience. There is no server, database, or backend API. It is designed to deploy on **GitHub Pages**.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run preview` serves the real `dist` folder. Because the production base path is `/odysseyinvite/`, preview the site at:

`http://localhost:4173/odysseyinvite/`

`vite preview` now uses the same `/odysseyinvite/` base as GitHub Pages, so audio and other public files resolve correctly.

## GitHub Pages

The repository name is `odysseyinvite`, so Vite builds assets for:

`https://<user-or-org>.github.io/odysseyinvite/`

### Enable Pages

1. Push `main` to GitHub.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will build and deploy on every push to `main`.

### If the repository is renamed

Update the base path in `vite.config.ts`:

```ts
export const GIT_PAGES_BASE = '/your-repo-name/'
```

Do not hard-code absolute asset URLs such as `/images/ship.png`. Use imported files or `publicAsset()` from `src/utils/assets.ts`.

## Architecture

The invitation is a single React state machine, not a multi-page site:

**Cinematic intro → Begin the Voyage → voyage map → chapters → Ithaca → Odyssey Complete → completed map**

Refresh-safe because there is no `BrowserRouter`. Progress, sound preference, Odyssey XP, achievements, and the Strengths path persist in `localStorage` under `careerCenterOdyssey.state` (the older `careerCenterOdyssey.progress` key is still written for compatibility).

To reset the voyage, open `?dev=true` and use the development navigator, run `resetOdyssey()` in the console on that same URL, or:

```js
localStorage.removeItem('careerCenterOdyssey.state')
localStorage.removeItem('careerCenterOdyssey.progress')
```

Sound starts only after **Enter with sound** or the sound toggle. The manager loads files listed in `public/audio/manifest.json`. If the list is empty, a quiet procedural soundscape is used and no mp3s are requested. See `public/audio/README.md` for the expected filenames.

## Development navigator

Add `?dev=true` to jump to the intro, map, any destination, or the finale without replaying the full voyage. Keep this off for production visitors.

## Phase 4 world systems

A shared world controller now drives time of day, weather, sky, clouds, fog, lighting, particles, camera mood, chapter transitions, and audio crossfades. Quality scales down on mobile or reduced motion. Visual art direction is still the next pass.

## Phase 3 journey

The full functional experience is in place: every destination chapter, XP, achievements, Easter eggs, the Forbidden Island, Strengths path choice, agenda overlay, save/load, and the Odyssey Complete sequence. Visual and audio polish still come later.

## Phase 2 opening

The first visit includes a cinematic entry, a three-line prologue, a progressive moonlight ocean reveal, a sequenced title, and a longer ocean-to-map departure.

## Phase 1 foundation

- Cinematic opening and title reveal
- Living ocean and Career Center Odyssey ship
- Begin the Voyage transition into the map
- Interactive destinations, ship path travel, fog of war
- Voyage progress, sound, reduced-motion and keyboard support

Recommended production art sizes live in `src/assets/README.md`.
