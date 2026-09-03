import { useExperience } from '../hooks/ExperienceContext'

export function MapGuidance() {
  const { progress, markMapGuidanceSeen } = useExperience()
  if (progress.mapGuidanceSeen) return null

  return (
    <div className="map-guide" role="dialog" aria-labelledby="map-guide-title">
      <p className="chapter-kicker">How to navigate</p>
      <h2 id="map-guide-title">Your voyage is charted one destination at a time.</h2>
      <p>Select the glowing destination to continue.</p>
      <p>Interactions inside each chapter are optional.</p>
      <p>Return to the map whenever you&apos;re ready to continue.</p>
      <button className="cta-primary" type="button" onClick={markMapGuidanceSeen}>
        Got it
      </button>
    </div>
  )
}
