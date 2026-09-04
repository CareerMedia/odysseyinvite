import { useExperience } from '../hooks/ExperienceContext'

export function MapGuidance() {
  const { progress, markMapGuidanceSeen } = useExperience()
  if (progress.mapGuidanceSeen) return null

  return (
    <div className="map-guide" aria-labelledby="map-guide-title">
      <p className="chapter-kicker">The chart is open</p>
      <h2 id="map-guide-title">Drag to explore the chart</h2>
      <p>Scroll or pinch to zoom. Use + and − if you prefer.</p>
      <p>Select the glowing destination to continue. Next only shows you the course — it does not open a chapter.</p>
      <button className="cta-primary" type="button" onClick={markMapGuidanceSeen}>
        Got it
      </button>
    </div>
  )
}
