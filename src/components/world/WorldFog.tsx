import type { QualityLevel, WorldState } from '../../types'

export function WorldFog({ world, quality, framed }: { world: WorldState; quality: QualityLevel; framed?: boolean }) {
  const layers = quality === 'low' ? 1 : quality === 'medium' ? 2 : 3
  if (world.fogIntensity < 0.05) return null

  return (
    <div
      className={`world-fog ${framed ? 'is-framed' : ''} weather-${world.weather}`}
      style={{ opacity: world.fogIntensity }}
      aria-hidden="true"
    >
      <div className="fog-band fog-a" />
      {layers > 1 ? <div className="fog-band fog-b" /> : null}
      {layers > 2 ? <div className="fog-band fog-c" /> : null}
    </div>
  )
}
