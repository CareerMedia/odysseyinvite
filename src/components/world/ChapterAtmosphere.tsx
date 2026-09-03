import type { QualityLevel, VisualType, WorldState } from '../../types'
import { AmbientEvents } from './AmbientEvents'
import { ChapterVessel } from './ChapterVessel'
import { LocalLights } from './LocalLights'
import { LighthouseBeam } from './LighthouseBeam'
import { OracleAnomaly } from './OracleAnomaly'
import { SceneCamera } from './SceneCamera'
import { SceneSilhouettes } from './SceneSilhouettes'
import { Waterfall } from './Waterfall'
import { WorldClouds } from './WorldClouds'
import { WorldFog } from './WorldFog'
import { WorldLighting } from './WorldLighting'
import { WorldParticles } from './WorldParticles'
import { WorldSky } from './WorldSky'

export function ChapterAtmosphere({
  world,
  quality,
  visualType,
  reduced,
  hidden,
  chapterComplete,
}: {
  world: WorldState
  quality: QualityLevel
  visualType: VisualType
  reduced: boolean
  hidden: boolean
  chapterComplete: boolean
}) {
  return (
    <div className="chapter-atmosphere" aria-hidden="true">
      <SceneCamera world={world} reduced={reduced}>
        <WorldSky world={world} quality={quality} />
        <WorldClouds world={world} quality={quality} />
        <div className={`depth-mountains type-${visualType}`} />
        {visualType === 'temple' || visualType === 'trials' ? <Waterfall /> : null}
        {visualType === 'fortress' ? <LighthouseBeam active={chapterComplete} reduced={reduced} /> : null}
        <WorldLighting world={world} />
        <LocalLights type={visualType} />
        <SceneSilhouettes type={visualType} />
        <ChapterVessel type={visualType} ocean={world.oceanIntensity} reduced={reduced} />
        {visualType === 'oracle' ? <OracleAnomaly active /> : null}
        <WorldFog world={world} quality={quality} framed />
        <WorldParticles
          mode={world.particleMode}
          density={world.particleDensity}
          quality={quality}
          reduced={reduced}
          hidden={hidden}
        />
        <AmbientEvents world={world} active={!hidden} reduced={reduced} hidden={hidden} />
      </SceneCamera>
    </div>
  )
}
