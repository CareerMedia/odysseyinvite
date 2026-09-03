import { useExperience } from '../hooks/ExperienceContext'
import { currentStoryChapter, storyCompletion } from '../utils/voyageState'
import { DestStatus } from '../types'
import { majorDestinations } from '../data/destinations'

export function VoyageProgress() {
  const { progress, statusOf } = useExperience()
  const current = currentStoryChapter(progress)
  const { ratio } = storyCompletion(progress)
  const chapterLabel =
    current.kind === 'finale'
      ? 'ITHACA'
      : current.chapterIndex <= 0
        ? 'PROLOGUE'
        : `CHAPTER ${current.chapter} OF VII`

  return (
    <div className="voyage-progress chrome" aria-label="Voyage progress">
      <p>
        {chapterLabel}
        {progress.voyageComplete ? ' · VOYAGE COMPLETE' : ` · Voyage ${Math.round(ratio * 100)}%`}
      </p>
      <div className="progress-track" aria-hidden="true">
        <span>⚓</span>
        {majorDestinations.map((dest, index) => {
          const status = statusOf(dest.id)
          const done = status === DestStatus.Completed
          const now = status === DestStatus.Current
          return (
            <span className="progress-seg" key={dest.id}>
              <span className="progress-line" />
              {index === majorDestinations.length - 1 ? (
                <span title={dest.mythicTitle}>🏝</span>
              ) : (
                <span className={`progress-dot ${done ? 'is-done' : ''} ${now ? 'is-now' : ''}`} title={dest.mythicTitle} />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
