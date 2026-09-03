import { WEATHER_CLOUD_SPEED } from '../../data/world'
import type { QualityLevel, WorldState } from '../../types'

export function WorldClouds({ world, quality }: { world: WorldState; quality: QualityLevel }) {
  const layers = quality === 'low' ? 1 : quality === 'medium' ? 2 : 3
  const speed = WEATHER_CLOUD_SPEED[world.weather]
  const anomaly = world.weather === 'oracleAnomaly'

  return (
    <div
      className={`world-clouds weather-${world.weather} ${anomaly ? 'is-anomaly' : ''}`}
      style={{ ['--cloud-speed' as string]: String(speed) }}
      aria-hidden="true"
    >
      {layers >= 1 ? <div className="cloud-layer cloud-far" /> : null}
      {layers >= 2 ? <div className="cloud-layer cloud-mid" /> : null}
      {layers >= 3 ? <div className="cloud-layer cloud-near" /> : null}
    </div>
  )
}
