import { useEffect, useState } from 'react'
import { chapterGuidance } from '../../data/chapterCopy'
import { getDestination } from '../../data/destinations'
import { useExperience } from '../../hooks/ExperienceContext'
import { Scene } from '../../types'
import { textureVarsFor } from '../../assets/textures'
import { ChapterAtmosphere } from '../world/ChapterAtmosphere'
import { ChapterTextures } from '../world/ChapterTextures'
import { ChapterWorld } from './ChapterWorld'

export function ChapterScene() {
  const {
    activeChapterId,
    closeChapter,
    completeChapter,
    progress,
    setStrengthsPath,
    reducedMotion,
    sound,
    unlockAchievement,
    world,
    quality,
    pageHidden,
    setScene,
    toggleDetails,
  } = useExperience()
  const dest = activeChapterId ? getDestination(activeChapterId) : undefined
  const already = Boolean(dest && progress.completedIds.includes(dest.id))
  const [done, setDone] = useState(already)
  const firstInteractive = progress.visitedIds.filter((id) => id !== dest?.id).length <= 1

  useEffect(() => {
    setDone(Boolean(dest && progress.completedIds.includes(dest.id)))
  }, [activeChapterId, dest, progress.completedIds])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChapter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeChapter])

  if (!dest) return null

  const finishInteraction = () => {
    setDone(true)
    if (dest.id === 'forbidden') unlockAchievement('forbidden-island')
    completeChapter(dest.id)
  }

  const guide = chapterGuidance(dest, firstInteractive)

  return (
    <div
      className={`chapter chapter-${dest.visualType} transition-${dest.transition} ${reducedMotion ? 'is-still' : ''} ${dest.id === 'ithaca' ? 'is-quiet' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-heading"
    >
      <div className="chapter-world" style={textureVarsFor(dest.visualType)} aria-hidden="true">
        <ChapterAtmosphere
          world={world}
          quality={quality}
          visualType={dest.visualType}
          reduced={reducedMotion}
          hidden={pageHidden}
          chapterComplete={done || already}
        />
        <ChapterWorld type={dest.visualType} />
        <ChapterTextures type={dest.visualType} />
      </div>

      <aside className="chapter-panel">
        <p className="chapter-kicker">{dest.chapter ? `Chapter ${dest.chapter}` : 'Waystation'}</p>
        <h2 id="chapter-heading">{dest.headline}</h2>
        {dest.subheading ? <p className="chapter-sub">{dest.subheading}</p> : null}
        <p className="chapter-actual">{dest.actualTitle}</p>
        <div className="chapter-meta">
          <span>{dest.timeRange}</span>
          {dest.presenter ? <span>{dest.presenter}</span> : null}
        </div>
        <p className="chapter-story">{dest.narrative}</p>

        <p className="chapter-guide">{guide.lead}</p>
        <p className="chapter-guide-note">{guide.detail}</p>

        {already && done ? (
          <div className="chapter-complete">
            <p className="chapter-kicker">Already charted</p>
            <p>{dest.completeLine}</p>
          </div>
        ) : (
          <ChapterInteraction destId={dest.id} done={done} onComplete={finishInteraction} />
        )}

        {done && !already ? (
          <div className="chapter-complete" aria-live="polite">
            <p className="chapter-kicker">{dest.completeTitle}</p>
            <p>{dest.completeLine}</p>
          </div>
        ) : null}

        <div className="chapter-actions">
          {already ? (
            <button
              className="cta-secondary"
              type="button"
              onClick={() => {
                setDone(false)
                sound.play('click')
              }}
            >
              Replay chapter
            </button>
          ) : null}
          {dest.interaction === 'strengths' && progress.strengthsPath ? (
            <button
              className="cta-secondary"
              type="button"
              onClick={() => setStrengthsPath(progress.strengthsPath === 'mastery' ? 'discovery' : 'mastery')}
            >
              Change Strengths path
            </button>
          ) : null}
          <button className="cta-secondary" type="button" onClick={() => toggleDetails(true)}>
            View full agenda
          </button>
          {dest.id === 'ithaca' ? (
            <button
              className="cta-primary"
              type="button"
              onClick={() => {
                setScene(Scene.Complete)
              }}
            >
              Finish the Odyssey
            </button>
          ) : null}
          <button
            className="cta-primary"
            type="button"
            onClick={() => {
              sound.play('click')
              closeChapter()
            }}
          >
            {dest.interaction === 'rest' || dest.interaction === 'signal' || dest.interaction === 'feast'
              ? 'Continue the Voyage'
              : 'Return to the map'}
          </button>
        </div>
      </aside>
    </div>
  )
}

function ChapterInteraction({
  destId,
  done,
  onComplete,
}: {
  destId: string
  done: boolean
  onComplete: () => void
}) {
  const dest = getDestination(destId)
  const { progress, setStrengthsPath, sound } = useExperience()
  const [picked, setPicked] = useState<string[]>([])
  const [signalPhase, setSignalPhase] = useState(0)

  useEffect(() => {
    setPicked(dest?.interaction === 'strengths' && progress.strengthsPath ? [progress.strengthsPath] : [])
    setSignalPhase(0)
  }, [dest?.interaction, destId, progress.strengthsPath])

  useEffect(() => {
    if (dest?.interaction !== 'signal') return
    const one = window.setTimeout(() => setSignalPhase(1), 1400)
    const two = window.setTimeout(() => setSignalPhase(2), 2800)
    return () => {
      window.clearTimeout(one)
      window.clearTimeout(two)
    }
  }, [dest?.interaction])

  if (!dest || done) return null

  if (dest.interaction === 'rest') {
    return <p className="chapter-story">The Restless Matador keeps a quiet table.</p>
  }

  if (dest.interaction === 'signal') {
    return (
      <div className={`signal-box phase-${signalPhase}`} aria-live="polite">
        <p>
          {signalPhase === 0
            ? 'The cove is still.'
            : signalPhase === 1
              ? 'Something is interfering with the map.'
              : 'Unknown signal detected.'}
        </p>
      </div>
    )
  }

  if (dest.interaction === 'forbidden') {
    return <p className="chapter-story">You found a place that was never meant to be scheduled.</p>
  }

  if (dest.interaction === 'strengths') {
    return (
      <div className="choice-row">
        {dest.items.map((item) => (
          <button
            key={item.id}
            className={`choice-card ${picked.includes(item.id) || progress.strengthsPath === item.id ? 'is-on' : ''}`}
            type="button"
            aria-label={item.label}
            onClick={() => {
              setStrengthsPath(item.id === 'mastery' ? 'mastery' : 'discovery')
              setPicked([item.id])
              sound.play('click')
              window.setTimeout(onComplete, 350)
            }}
          >
            <strong>{item.label}</strong>
            <span>{item.id === 'discovery' ? 'New to Strengths' : 'Returning to Strengths'}</span>
          </button>
        ))}
      </div>
    )
  }

  if (dest.interaction === 'feast') {
    return (
      <div className="collect collect-feast">
        <button
          className={`collect-item ${picked.includes('olive') ? 'is-on' : ''}`}
          type="button"
          onClick={() => {
            setPicked(['olive'])
            sound.play('hover')
          }}
        >
          A curious olive
        </button>
      </div>
    )
  }

  const needed = dest.interaction === 'voices' ? 3 : dest.items.length

  return (
    <div className={`collect collect-${dest.interaction} is-count-${picked.length}`}>
      {dest.items.map((item, index) => (
        <button
          key={item.id}
          className={`collect-item ${picked.includes(item.id) ? 'is-on' : ''} ${picked.length === 0 ? 'is-pulse' : ''}`}
          type="button"
          aria-label={item.label}
          disabled={dest.interaction === 'trials' && picked.length !== index}
          onClick={() => {
            if (picked.includes(item.id)) return
            const next = [...picked, item.id]
            setPicked(next)
            sound.play('click')
            if (next.length >= needed) onComplete()
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
