import type { QualityLevel, WorldState } from '../../types'

export function WorldSky({ world, quality }: { world: WorldState; quality: QualityLevel }) {
  const showMoon = world.timeOfDay === 'predawn' || world.timeOfDay === 'twilight'
  const showStars = world.timeOfDay === 'predawn' || world.timeOfDay === 'twilight' || world.timeOfDay === 'goldenHour'

  return (
    <div className={`world-sky time-${world.timeOfDay} quality-${quality}`} aria-hidden="true">
      <div className="sky-wash" />
      <div className="sky-haze" />
      {showStars ? <div className="sky-stars" /> : null}
      <div className={`celestial ${showMoon ? 'is-moon' : 'is-sun'}`} />
      <div className="horizon-band" />
    </div>
  )
}
