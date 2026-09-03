import type { WorldState } from '../../types'

export function WorldLighting({ world }: { world: WorldState }) {
  return (
    <div className={`world-light mood-${world.lightingMood} weather-${world.weather}`} aria-hidden="true">
      <div className="light-wash" />
      {world.lightingMood === 'mysticalGold' || world.lightingMood === 'epicHorizon' ? <div className="god-rays" /> : null}
      {world.weather === 'stormDistant' || world.weather === 'storm' ? <div className="storm-dim" /> : null}
      {world.lightingMood === 'oracleCyan' ? <div className="oracle-pulse" /> : null}
    </div>
  )
}
