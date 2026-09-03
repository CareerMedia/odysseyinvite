import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { AchievementToast } from './components/AchievementToast'
import { ChapterScene } from './components/chapters/ChapterScene'
import { CinematicIntro } from './components/CinematicIntro'
import { DevNavigator } from './components/DevNavigator'
import { EventDetailsPanel } from './components/EventDetailsPanel'
import { ExpeditionChrome } from './components/ExpeditionChrome'
import { OceanScene } from './components/OceanScene'
import { OdysseyComplete } from './components/OdysseyComplete'
import { SoundController } from './components/SoundController'
import { VoyageMap } from './components/VoyageMap'
import { VoyageProgress } from './components/VoyageProgress'
import { XPDisplay } from './components/XPDisplay'
import { SceneTransition } from './components/world/SceneTransition'
import { ExperienceProvider, useExperience } from './hooks/ExperienceContext'
import { EVENT } from './data/destinations'
import { Scene } from './types'
import { worldCssVars } from './utils/worldDerive'
import './styles/ocean.css'
import './styles/intro.css'
import './styles/map.css'
import './styles/ui.css'
import './styles/chapter.css'
import './styles/world.css'

function World() {
  const { scene, setScene, reducedMotion, lockedHint, world, quality, uiHidden, wipe } = useExperience()
  const showOcean = scene === Scene.Cinematic || scene === Scene.Departing
  const showMap = scene === Scene.Map || scene === Scene.Departing || scene === Scene.Chapter
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (scene !== Scene.Departing) return
    const wait = reducedMotion ? 800 : 7200
    const timer = window.setTimeout(() => setScene(Scene.Map), wait)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, scene, setScene])

  useEffect(() => {
    const onChange = () => {
      const hidden = document.hidden
      setPaused(hidden)
      if (hidden) gsap.globalTimeline.pause()
      else gsap.globalTimeline.resume()
    }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return (
    <div
      className={`world time-${world.timeOfDay} weather-${world.weather} quality-${quality} ${showMap ? 'is-map' : ''} ${scene === Scene.Chapter ? 'is-chapter' : ''} ${paused ? 'is-paused' : ''} ${uiHidden ? 'is-cinematic' : ''}`}
      style={worldCssVars(world)}
    >
      <h1 className="sr-only">
        {EVENT.title} — {EVENT.subtitle}. {EVENT.date}. {EVENT.time}. {EVENT.location}.
      </h1>
      {showOcean ? <OceanScene /> : null}
      {showMap ? <VoyageMap fromOcean={scene === Scene.Departing} /> : null}
      {scene === Scene.Cinematic || scene === Scene.Departing ? <CinematicIntro /> : null}
      {scene === Scene.Map ? <ExpeditionChrome /> : null}
      {scene === Scene.Map ? <VoyageProgress /> : null}
      {scene === Scene.Map ? <XPDisplay /> : null}
      {scene === Scene.Chapter ? <ChapterScene /> : null}
      {scene === Scene.Complete ? <OdysseyComplete /> : null}
      <SceneTransition wipe={wipe} />
      <SoundController />
      <EventDetailsPanel />
      <AchievementToast />
      <DevNavigator />
      {lockedHint ? (
        <p className="locked-hint" role="status">
          {lockedHint}
        </p>
      ) : null}
      <div className="grain" />
      <div className="vignette" />
    </div>
  )
}

export default function App() {
  return (
    <ExperienceProvider>
      <World />
    </ExperienceProvider>
  )
}
