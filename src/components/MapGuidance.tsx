import { useExperience } from '../hooks/ExperienceContext'

export function MapGuidance() {
  const { progress, markMapGuidanceSeen } = useExperience()
  if (progress.mapGuidanceSeen) return null

  return (
    <div className="map-guide" aria-labelledby="map-guide-title">
      <p className="chapter-kicker">How to navigate</p>
      <h2 id="map-guide-title">The whole chart is open.</h2>
      <p>Select any island to visit that destination.</p>
      <p>Use Next in the chapter tracker to follow the recommended course.</p>
      <p>Activities inside each chapter are optional. Return to the map whenever you&apos;re ready.</p>
      <button className="cta-primary" type="button" onClick={markMapGuidanceSeen}>
        Got it
      </button>
    </div>
  )
}
