import { useEffect, useRef, useState } from 'react'
import { chapterGuidance } from '../../data/chapterCopy'
import { getDestination } from '../../data/destinations'
import { useExperience } from '../../hooks/ExperienceContext'
import { Scene } from '../../types'
import { textureVarsFor } from '../../assets/textures'
import { ChapterAtmosphere } from '../world/ChapterAtmosphere'
import { ChapterTextures } from '../world/ChapterTextures'
import { ChapterWorld } from './ChapterWorld'
import { Eye, Heart, Link2, MessageCircle, Shield, Users, Zap } from 'lucide-react'
import { GatheringHarbor } from './GatheringHarbor'
import { IsleOfReadiness } from './IsleOfReadiness'
import { KingdomOfCulture } from './KingdomOfCulture'
import '../../styles/gathering.css'
import '../../styles/readiness.css'
import '../../styles/culture.css'

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
  const [leaving, setLeaving] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const firstInteractive = progress.visitedIds.filter((id) => id !== dest?.id).length <= 1
  const isGathering = dest?.id === 'prologue'
  const isReadiness = dest?.id === 'readiness'
  const isCulture = dest?.id === 'culture'
  const [signals, setSignals] = useState<string[]>([])
  const usesPlate = isGathering || isReadiness || isCulture

  useEffect(() => {
    setDone(Boolean(dest && progress.completedIds.includes(dest.id)))
    setLeaving(false)
    setSignals([])
  }, [activeChapterId, dest, progress.completedIds])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChapter()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
    }
  }, [closeChapter])

  if (!dest) return null

  const finishInteraction = () => {
    setDone(true)
    if (dest.id === 'forbidden') unlockAchievement('forbidden-island')
    if (isCulture) sound.intensify('music', 1.12, 1.6)
    completeChapter(dest.id)
  }

  const guide = chapterGuidance(dest, firstInteractive)

  const returnToMap = () => {
    sound.play('click')
    if (usesPlate && !reducedMotion) {
      setLeaving(true)
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
      leaveTimer.current = window.setTimeout(() => closeChapter(), 620)
      return
    }
    closeChapter()
  }

  return (
    <div
      className={`chapter chapter-${dest.visualType} transition-${dest.transition} ${reducedMotion ? 'is-still' : ''} ${dest.id === 'ithaca' ? 'is-quiet' : ''} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-heading"
    >
      <div className="chapter-world" style={usesPlate ? undefined : textureVarsFor(dest.visualType)} aria-hidden="true">
        {isGathering ? (
          <GatheringHarbor reduced={reducedMotion} hidden={pageHidden} quality={quality} leaving={leaving} />
        ) : isReadiness ? (
          <IsleOfReadiness
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            signals={signals}
            complete={done || already}
          />
        ) : isCulture ? (
          <KingdomOfCulture
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            voices={signals}
            complete={done || already}
          />
        ) : (
          <>
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
          </>
        )}
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
          <ChapterInteraction destId={dest.id} done={done} onComplete={finishInteraction} onSignals={isReadiness || isCulture ? setSignals : undefined} />
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
                setSignals([])
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
            className="cta-secondary"
            type="button"
            onClick={returnToMap}
          >
            Continue voyage
          </button>
          <button
            className="cta-primary"
            type="button"
            onClick={returnToMap}
          >
            Return to the map
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
  onSignals,
}: {
  destId: string
  done: boolean
  onComplete: () => void
  onSignals?: (ids: string[]) => void
}) {
  const dest = getDestination(destId)
  const { progress, setStrengthsPath, sound } = useExperience()
  const [picked, setPicked] = useState<string[]>([])
  const [signalPhase, setSignalPhase] = useState(0)

  useEffect(() => {
    setPicked(dest?.interaction === 'strengths' && progress.strengthsPath ? [progress.strengthsPath] : [])
    setSignalPhase(0)
    onSignals?.([])
  }, [dest?.interaction, destId, dest, done, onSignals, progress.strengthsPath])

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

  if (dest.interaction === 'beacon') {
    const icons = { watch: Eye, respond: Zap, protect: Shield }
    return (
      <div className="collect collect-beacon">
        {dest.items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Eye
          const on = picked.includes(item.id)
          return (
            <button
              key={item.id}
              className={`beacon-btn ${on ? 'is-on' : 'is-pulse'}`}
              type="button"
              aria-label={`${item.label}. Optional signal.`}
              onClick={() => {
                if (on) return
                const next = [...picked, item.id]
                setPicked(next)
                onSignals?.(next)
                sound.play('click')
                if (next.length >= dest.items.length) onComplete()
              }}
            >
              <Icon size={18} strokeWidth={1.6} />
              {item.label}
            </button>
          )
        })}
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

  if (dest.interaction === 'voices') {
    const icons = { belonging: Heart, communication: MessageCircle, connection: Link2, collaboration: Users }
    return (
      <div className="collect collect-voices">
        {dest.items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Heart
          const on = picked.includes(item.id)
          return (
            <button
              key={item.id}
              className={`voice-btn ${on ? 'is-on' : 'is-pulse'}`}
              type="button"
              aria-label={`${item.label}. Optional city voice.`}
              onClick={() => {
                if (on) return
                const next = [...picked, item.id]
                setPicked(next)
                onSignals?.(next)
                sound.play('click')
                if (next.length >= dest.items.length) onComplete()
              }}
            >
              <Icon size={18} strokeWidth={1.6} />
              {item.label}
            </button>
          )
        })}
      </div>
    )
  }

  const needed = dest.items.length

  return (
    <div className={`collect collect-${dest.interaction} is-count-${picked.length}`}>
        {dest.items.map((item, index) => (
          <button
            key={item.id}
            className={`collect-item ${picked.includes(item.id) ? 'is-on' : ''} ${picked.includes(item.id) ? '' : 'is-pulse'}`}
            type="button"
            aria-label={`${item.label}. Optional.`}
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
