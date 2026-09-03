import { destinations, JOURNEY_ORDER } from '../data/destinations'
import { publicAsset } from './assets'

const warmed = new Set<string>()

function warm(url: string) {
  if (warmed.has(url) || typeof document === 'undefined') return
  warmed.add(url)
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = url.endsWith('.json') ? 'fetch' : 'audio'
  document.head.appendChild(link)
}

export function preloadStage(stage: 1 | 2 | 3 | 4) {
  if (typeof document === 'undefined') return
  void document.fonts?.ready
  if (stage >= 1) warm(publicAsset('audio/manifest.json'))
  if (stage >= 2) {
    ;['wind-soft.mp3', 'cinematic-bed.mp3'].forEach((file) => warm(publicAsset(`audio/${file}`)))
  }
}

export function preloadNextDestination(currentId: string | null) {
  if (!currentId) {
    preloadStage(2)
    return
  }
  const index = JOURNEY_ORDER.indexOf(currentId)
  const nextId = index >= 0 ? JOURNEY_ORDER[index + 1] : undefined
  const dest = nextId ? destinations.find((item) => item.id === nextId) : undefined
  if (!dest) return
  const file = dest.audio.ambience.endsWith('.mp3') ? dest.audio.ambience : undefined
  if (file) warm(publicAsset(`audio/${file}`))
}

export function mediaFallback<T>(factory: () => T, fallback: T): T {
  try {
    return factory()
  } catch {
    return fallback
  }
}
