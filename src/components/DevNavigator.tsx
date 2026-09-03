import { destinations } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'
import { Scene } from '../types'

export function DevNavigator() {
  const { isDev, jumpTo, resetVoyage, scene } = useExperience()
  if (!isDev) return null

  return (
    <div className="dev-nav" aria-label="Development navigator">
      <p>DEV</p>
      <button type="button" onClick={() => jumpTo(Scene.Cinematic)}>
        Intro
      </button>
      <button type="button" onClick={() => jumpTo(Scene.Map)}>
        Map
      </button>
      <button type="button" onClick={() => jumpTo(Scene.Complete)}>
        Finale
      </button>
      {destinations.map((dest) => (
        <button key={dest.id} type="button" onClick={() => jumpTo(dest.id)}>
          {dest.mythicTitle}
        </button>
      ))}
      <button type="button" onClick={resetVoyage}>
        Reset voyage
      </button>
      <small>{scene}</small>
    </div>
  )
}
