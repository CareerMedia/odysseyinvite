import { X } from 'lucide-react'
import { destinations, EVENT } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'
import { Scene } from '../types'

export function EventDetailsPanel() {
  const { detailsOpen, toggleDetails, beginVoyage, scene, progress } = useExperience()
  if (!detailsOpen) return null

  return (
    <div className="panel-backdrop" onClick={() => toggleDetails(false)} role="presentation">
      <div
        className="panel agenda-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="panel-chapter">{EVENT.eyebrow}</p>
        <h2 id="details-title">Expedition Details</h2>
        <p className="actual">{EVENT.subtitle}</p>
        <div className="panel-meta">
          <span>{EVENT.date}</span>
          <span>{EVENT.time}</span>
          <span>{EVENT.location}</span>
        </div>
        <p className="panel-teaser">{EVENT.motto}</p>
        <ol className="agenda-list">
          {destinations
            .filter((dest) => dest.kind !== 'hidden')
            .map((dest) => (
              <li key={dest.id} className={progress.completedIds.includes(dest.id) ? 'is-done' : ''}>
                <strong>{dest.mythicTitle}</strong>
                <span>
                  {dest.timeRange}
                  {dest.presenter ? ` · ${dest.presenter}` : ''}
                </span>
                <em>{dest.actualTitle}</em>
              </li>
            ))}
        </ol>
        <div className="panel-actions">
          <button className="cta-secondary" type="button" onClick={() => toggleDetails(false)}>
            <X size={14} /> Close
          </button>
          {scene === Scene.Cinematic ? (
            <button
              className="cta-primary"
              type="button"
              onClick={() => {
                toggleDetails(false)
                beginVoyage()
              }}
            >
              Begin the Voyage
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
