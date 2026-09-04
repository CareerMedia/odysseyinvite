import { DEPART_WORLD, DESTINATION_ENV, INTRO_WORLD, LIGHT_WASH, SKY, mapWorld } from '../data/world'
import { Scene, type ProgressState, type QualityLevel, type SceneId, type WorldState } from '../types'
import { qualityScale } from './quality'

export function deriveWorld(
  scene: SceneId,
  activeChapterId: string | null,
  progress: ProgressState,
  quality: QualityLevel,
): WorldState {
  const scale = qualityScale(quality)
  const latestId = progress.currentDestinationId
  const latest = DESTINATION_ENV[latestId]

  let next: WorldState
  if (scene === Scene.Cinematic) next = INTRO_WORLD
  else if (scene === Scene.Departing) next = DEPART_WORLD
  else if (scene === Scene.Chapter && activeChapterId && DESTINATION_ENV[activeChapterId]) {
    const env = DESTINATION_ENV[activeChapterId]
    next = {
      timeOfDay: env.timeOfDay,
      weather: env.weather,
      windIntensity: env.windIntensity,
      fogIntensity: env.fogIntensity,
      oceanIntensity: env.oceanIntensity,
      lightingMood: env.lightingMood,
      particleDensity: 0.7,
      cameraMood: env.cameraMood,
      audioMood: env.audioMood,
      particleMode: env.particleMode,
    }
  } else if (scene === Scene.Complete) {
    next = {
      ...mapWorld(true, latest),
      audioMood: 'ithacaSunset',
      timeOfDay: 'goldenHour',
      lightingMood: 'sunsetGold',
    }
  } else {
    next = mapWorld(progress.voyageComplete, latest, latestId)
  }

  return {
    ...next,
    particleDensity: next.particleDensity * scale.particles,
    fogIntensity: next.fogIntensity * (scale.fogLayers === 1 ? 0.55 : 1),
    windIntensity: quality === 'low' ? next.windIntensity * 0.45 : next.windIntensity,
  }
}

export function worldCssVars(world: WorldState): Record<string, string> {
  const sky = SKY[world.timeOfDay]
  return {
    '--sky-top': sky.top,
    '--sky-mid': sky.mid,
    '--sky-horizon': sky.horizon,
    '--sky-glow': sky.glow,
    '--sun-color': sky.sun,
    '--sun-x': sky.sunX,
    '--sun-y': sky.sunY,
    '--star-opacity': String(sky.starOpacity),
    '--fog-intensity': String(world.fogIntensity),
    '--wind-intensity': String(world.windIntensity),
    '--particle-density': String(world.particleDensity),
    '--light-wash': LIGHT_WASH[world.lightingMood],
  }
}

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
