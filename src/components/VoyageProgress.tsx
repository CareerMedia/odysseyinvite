import { ChevronRight } from 'lucide-react'
import { useExperience } from '../hooks/ExperienceContext'
import { currentStoryChapter, nextAvailableId, nextMajorId, storyCompletion } from '../utils/voyageState'
import { DestStatus } from '../types'
import { getDestination, majorDestinations } from '../data/destinations'

export function VoyageProgress() {
  const { progress, statusOf, advanceVoyage, enterChapter } = useExperience()
  const current = currentStoryChapter(progress)
  const { ratio } = storyCompletion(progress)
  const nextId = nextMajorId(progress) ?? nextAvailableId(progress)
  const nextDest = nextId ? getDestination(nextId) : undefined
  const chapterLabel =
    current.kind === 'finale'
      ? 'ITHACA'
      : current.chapterIndex <= 0
        ? 'PROLOGUE'
        : `CHAPTER ${current.chapter} OF VII`

  return (
    <div className="voyage-progress chrome" aria-label="Voyage progress">
      <div className="progress-head">
        <p>
          {chapterLabel}
          {progress.voyageComplete ? ' · VOYAGE COMPLETE' : ` · Voyage ${Math.round(ratio * 100)}%`}
        </p>
        <button
          className="progress-next"
          type="button"
          onClick={advanceVoyage}
          aria-label={nextDest ? `Continue to ${nextDest.mythicTitle}` : 'Finish the Odyssey'}
        >
          {nextDest ? 'Next' : 'Finish'}
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span>⚓</span>
        {majorDestinations.map((dest, index) => {
          const status = statusOf(dest.id)
          const done = status === DestStatus.Completed || status === DestStatus.Visited
          const now = status === DestStatus.Current || status === DestStatus.Available || dest.id === nextId
          return (
            <span className="progress-seg" key={dest.id}>
              <span className="progress-line" />
              {index === majorDestinations.length - 1 ? (
                <button
                  className={`progress-island ${done || now ? 'is-now' : ''}`}
                  type="button"
                  title={dest.mythicTitle}
                  onClick={() => enterChapter(dest.id)}
                >
                  🏝
                </button>
              ) : (
                <button
                  className={`progress-dot ${done ? 'is-done' : ''} ${now ? 'is-now' : ''}`}
                  type="button"
                  title={dest.mythicTitle}
                  onClick={() => enterChapter(dest.id)}
                />
              )}
            </span>
          )
        })}
      </div>
      {nextDest ? <p className="progress-hint">Next: {nextDest.mythicTitle}</p> : null}
    </div>
  )
}
