import { useEffect, useRef, useState } from 'react'
import { chapterGuidance } from '../../data/chapterCopy'
import { getDestination } from '../../data/destinations'
import { useExperience } from '../../hooks/ExperienceContext'
import { textureVarsFor } from '../../assets/textures'
import { ChapterAtmosphere } from '../world/ChapterAtmosphere'
import { ChapterTextures } from '../world/ChapterTextures'
import { ChapterWorld } from './ChapterWorld'
import { Award, Backpack, Coins, Compass, Eye, Flag, Handshake, Heart, Link2, MapPin, MessageCircle, Package, Scale, Shield, ShipWheel, Sparkles, Sunrise, Users, Zap } from 'lucide-react'
import { GatheringHarbor } from './GatheringHarbor'
import { IsleOfReadiness } from './IsleOfReadiness'
import { KingdomOfCulture } from './KingdomOfCulture'
import { HerosFeast } from './HerosFeast'
import { QuartermastersDeck } from './QuartermastersDeck'
import { TempleOfStrengths } from './TempleOfStrengths'
import { TrialsOfTheCrew } from './TrialsOfTheCrew'
import { SafeHarborII } from './SafeHarborII'
import { OracleOfAI } from './OracleOfAI'
import { SeaOfOpportunity } from './SeaOfOpportunity'
import { IthacaArrival } from './IthacaArrival'
import '../../styles/gathering.css'
import '../../styles/readiness.css'
import '../../styles/culture.css'
import '../../styles/temple.css'
import '../../styles/deck.css'
import '../../styles/feast.css'
import '../../styles/trials.css'
import '../../styles/harbor2.css'
import '../../styles/oracle.css'
import '../../styles/opportunity.css'
import '../../styles/ithaca.css'

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
    toggleDetails,
    finishOdyssey,
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
  const isStrengths = dest?.id === 'strengths'
  const isDeck = dest?.id === 'quartermaster'
  const isFeast = dest?.id === 'feast'
  const isTrials = dest?.id === 'trials'
  const isHarbor2 = dest?.id === 'harbor-2'
  const isOracle = dest?.id === 'oracle'
  const isOpportunity = dest?.id === 'opportunity'
  const isIthaca = dest?.id === 'ithaca'
  const [signals, setSignals] = useState<string[]>([])
  const [harborPhase, setHarborPhase] = useState(0)
  const [finale, setFinale] = useState(false)
  const usesPlate = isGathering || isReadiness || isCulture || isStrengths || isDeck || isFeast || isTrials || isHarbor2 || isOracle || isOpportunity || isIthaca

  useEffect(() => {
    setDone(Boolean(dest && progress.completedIds.includes(dest.id)))
  }, [activeChapterId, dest, progress.completedIds])

  useEffect(() => {
    setLeaving(false)
    setFinale(false)
    setSignals([])
    setHarborPhase(0)
  }, [activeChapterId])

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
    if (isOracle) sound.intensify('music', 1.1, 1.6)
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
      className={`chapter chapter-${dest.visualType} transition-${dest.transition} ${reducedMotion ? 'is-still' : ''} ${dest.id === 'ithaca' ? 'is-quiet' : ''} ${leaving ? 'is-leaving' : ''} ${finale ? 'is-finale' : ''}`}
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
        ) : isStrengths ? (
          <TempleOfStrengths
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            path={progress.strengthsPath}
            complete={done || already}
          />
        ) : isDeck ? (
          <QuartermastersDeck
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            finds={signals}
            complete={done || already}
            onExplore={(id) => {
              if (done || already || signals.includes(id)) return
              const next = [...signals, id]
              setSignals(next)
              sound.play('click')
              if (next.length >= 3) finishInteraction()
            }}
          />
        ) : isFeast ? (
          <HerosFeast
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            foundOlive={signals.includes('olive')}
            onOlive={() => {
              if (signals.includes('olive')) return
              setSignals(['olive'])
              sound.play('hover')
              unlockAchievement('curious-olive')
            }}
          />
        ) : isTrials ? (
          <TrialsOfTheCrew
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            principles={signals}
            complete={done || already}
            onExplore={(id) => {
              if (done || already || signals.includes(id)) return
              const next = [...signals, id]
              setSignals(next)
              sound.playTrial(id as 'trust' | 'communicate' | 'collaborate')
              if (next.length >= 3) finishInteraction()
            }}
          />
        ) : isHarbor2 ? (
          <SafeHarborII
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            phase={harborPhase}
            alerted={already && done}
            onPhase={(next) => {
              setHarborPhase(next)
              if (next >= 2) sound.cueHarborSignal()
              if (next >= 2 && !done && !already) finishInteraction()
            }}
            onInspect={() => {
              sound.playHarborInspect()
              if (harborPhase >= 2) return
              setHarborPhase(2)
              sound.cueHarborSignal()
              if (!done && !already) finishInteraction()
            }}
          />
        ) : isOracle ? (
          <OracleOfAI
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            principles={signals}
            complete={done || already}
            onExplore={(id) => {
              if (done || already || signals.includes(id)) return
              const next = [...signals, id]
              setSignals(next)
              sound.playOracle(id as 'ask' | 'evaluate' | 'create')
              if (next.length >= 3) finishInteraction()
            }}
          />
        ) : isOpportunity ? (
          <SeaOfOpportunity
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            briefing={signals}
            complete={done || already}
            onExplore={(id) => {
              if (done || already || signals.includes(id)) return
              const next = [...signals, id]
              setSignals(next)
              sound.playBriefing(id as 'terrain' | 'role' | 'mission')
              if (next.length >= 3) finishInteraction()
            }}
          />
        ) : isIthaca ? (
          <IthacaArrival
            reduced={reducedMotion}
            hidden={pageHidden}
            quality={quality}
            leaving={leaving}
            finale={finale}
            reflections={signals}
            complete={done || already}
            rich={progress.completedIds.length >= 6}
            onExplore={(id) => {
              if (done || already || signals.includes(id)) return
              const next = [...signals, id]
              setSignals(next)
              sound.playReflection(id as 'discover' | 'carry' | 'next')
              if (next.length >= 3) finishInteraction()
            }}
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

        {already && done && dest.interaction !== 'strengths' ? (
          <div className="chapter-complete">
            <p className="chapter-kicker">Already charted</p>
            <p>{dest.completeLine}</p>
          </div>
        ) : (
          <ChapterInteraction destId={dest.id} done={done} onComplete={finishInteraction} onSignals={isReadiness || isCulture || isDeck || isFeast || isTrials || isOracle || isOpportunity || isIthaca ? setSignals : undefined} picks={isHarbor2 ? (harborPhase >= 2 ? ['signal'] : harborPhase >= 1 ? ['drift'] : []) : isDeck || isFeast || isTrials || isOracle || isOpportunity || isIthaca ? signals : undefined} />
        )}

        {done && (dest.interaction === 'strengths' || !already) ? (
          <div className="chapter-complete" aria-live="polite">
            <p className="chapter-kicker">{already ? 'Already charted' : dest.completeTitle}</p>
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
                setHarborPhase(0)
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
              className="cta-primary cta-finale"
              type="button"
              aria-label="Finish the Odyssey. Optional cinematic close."
              onClick={() => {
                if (finale) return
                sound.playIthacaArrive()
                if (!done && !already) finishInteraction()
                sound.intensify('music', 0.7, 2.2)
                if (reducedMotion) {
                  finishOdyssey()
                  return
                }
                setFinale(true)
                if (leaveTimer.current) window.clearTimeout(leaveTimer.current)
                leaveTimer.current = window.setTimeout(() => finishOdyssey(), 3600)
              }}
            >
              <Compass size={16} strokeWidth={1.6} aria-hidden="true" />
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
  picks,
}: {
  destId: string
  done: boolean
  onComplete: () => void
  onSignals?: (ids: string[]) => void
  picks?: string[]
}) {
  const dest = getDestination(destId)
  const { progress, setStrengthsPath, sound, unlockAchievement } = useExperience()
  const [picked, setPicked] = useState<string[]>([])
  const [signalPhase, setSignalPhase] = useState(0)

  useEffect(() => {
    setPicked(dest?.interaction === 'strengths' && progress.strengthsPath ? [progress.strengthsPath] : picks ?? [])
    setSignalPhase(0)
    if (dest?.interaction !== 'crates' && dest?.interaction !== 'trials' && dest?.interaction !== 'oracle' && dest?.interaction !== 'briefing' && dest?.interaction !== 'reflection') onSignals?.([])
  }, [dest?.interaction, destId, dest, done, onSignals, picks, progress.strengthsPath])

  useEffect(() => {
    if (dest?.interaction !== 'signal' || picks) return
    const one = window.setTimeout(() => setSignalPhase(1), 1400)
    const two = window.setTimeout(() => setSignalPhase(2), 2800)
    return () => {
      window.clearTimeout(one)
      window.clearTimeout(two)
    }
  }, [dest?.interaction, picks])

  if (!dest || (done && dest.interaction !== 'strengths')) return null

  if (dest.interaction === 'rest') {
    return <p className="chapter-story">The Restless Matador keeps a quiet table.</p>
  }

  if (dest.interaction === 'signal') {
    const phase = picks?.includes('signal') ? 2 : picks?.includes('drift') ? 1 : signalPhase
    return (
      <div className={`signal-box phase-${phase}`} aria-live="polite">
        <p>
          {phase === 0
            ? 'The cove is still.'
            : phase === 1
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
    const icons = { discovery: Compass, mastery: Award }
    const selected = progress.strengthsPath ?? (picked[0] as 'discovery' | 'mastery' | undefined)
    return (
      <>
        <div className="path-row">
          {dest.items.map((item) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Compass
            const on = selected === item.id
            return (
              <button
                key={item.id}
                className={`path-btn ${on ? 'is-on' : 'is-pulse'}`}
                type="button"
                aria-label={`${item.label}. ${item.id === 'discovery' ? 'New to Strengths' : 'Returning to Strengths'}. Optional.`}
                onClick={() => {
                  const path = item.id === 'mastery' ? 'mastery' : 'discovery'
                  setStrengthsPath(path)
                  setPicked([item.id])
                  sound.play(path === 'mastery' ? 'discover' : 'chime')
                  if (!done) window.setTimeout(onComplete, 350)
                }}
              >
                <Icon size={20} strokeWidth={1.6} />
                <strong>{item.label}</strong>
                <span>{item.id === 'discovery' ? 'New to Strengths' : 'Returning to Strengths'}</span>
              </button>
            )
          })}
        </div>
        {selected ? (
          <div className="path-status">
            <p className="chapter-kicker">{selected === 'discovery' ? 'Path of Discovery selected' : 'Path of Mastery selected'}</p>
            <p>{selected === 'discovery' ? 'Begin by discovering the strengths you already carry.' : 'Build upon the strengths you already know.'}</p>
          </div>
        ) : null}
      </>
    )
  }

  if (dest.interaction === 'feast') {
    const found = (picks ?? picked).includes('olive')
    return (
      <div className="collect collect-feast">
        <button
          className={`olive-btn ${found ? 'is-on' : ''}`}
          type="button"
          aria-label="A curious olive. Optional easter egg."
          onClick={() => {
            if (found) return
            setPicked(['olive'])
            onSignals?.(['olive'])
            sound.play('hover')
            unlockAchievement('curious-olive')
          }}
        >
          A curious olive
        </button>
      </div>
    )
  }

  if (dest.interaction === 'trials') {
    const icons = { trust: Handshake, communicate: MessageCircle, collaborate: Users }
    const selected = picks ?? picked
    return (
      <div className="collect collect-trials">
        {dest.items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Handshake
          const on = selected.includes(item.id)
          return (
            <button
              key={item.id}
              className={`trial-btn ${on ? 'is-on' : 'is-pulse'}`}
              type="button"
              aria-label={`${item.label}. Optional crew principle.`}
              onClick={() => {
                if (on) return
                const next = [...selected, item.id]
                setPicked(next)
                onSignals?.(next)
                sound.playTrial(item.id as 'trust' | 'communicate' | 'collaborate')
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

  if (dest.interaction === 'oracle') {
    const icons = { ask: MessageCircle, evaluate: Scale, create: Sparkles }
    const notes = { ask: 'Ask better questions', evaluate: 'Evaluate what you receive', create: 'Create with intention' }
    const selected = picks ?? picked
    const latest = selected[selected.length - 1] as keyof typeof notes | undefined
    return (
      <>
        <div className="collect collect-oracle">
          {dest.items.map((item) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Sparkles
            const on = selected.includes(item.id)
            return (
              <button
                key={item.id}
                className={`oracle-btn ${on ? 'is-on' : 'is-pulse'}`}
                type="button"
                data-id={item.id}
                aria-label={`${item.label}. Optional Oracle principle.`}
                onClick={() => {
                  if (on) return
                  const next = [...selected, item.id]
                  setPicked(next)
                  onSignals?.(next)
                  sound.playOracle(item.id as 'ask' | 'evaluate' | 'create')
                  if (next.length >= dest.items.length) onComplete()
                }}
              >
                <Icon size={18} strokeWidth={1.6} />
                {item.label}
              </button>
            )
          })}
        </div>
        {latest ? <p className="oracle-note">{notes[latest]}</p> : null}
      </>
    )
  }

  if (dest.interaction === 'briefing') {
    const icons = { terrain: MapPin, role: ShipWheel, mission: Flag }
    const selected = picks ?? picked
    return (
      <div className="collect collect-briefing">
        {dest.items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Compass
          const on = selected.includes(item.id)
          return (
            <button
              key={item.id}
              className={`opp-btn ${on ? 'is-on' : 'is-pulse'}`}
              type="button"
              data-id={item.id}
              aria-label={`${item.label}. Optional briefing point.`}
              onClick={() => {
                if (on) return
                const next = [...selected, item.id]
                setPicked(next)
                onSignals?.(next)
                sound.playBriefing(item.id as 'terrain' | 'role' | 'mission')
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

  if (dest.interaction === 'reflection') {
    const icons = { discover: Sparkles, carry: Backpack, next: Sunrise }
    const shorts = { discover: 'Discover', carry: 'Carry Forward', next: 'Next' }
    const selected = picks ?? picked
    const latest = selected[selected.length - 1]
    const latestItem = dest.items.find((item) => item.id === latest)
    return (
      <>
        <div className="collect collect-reflection">
          {dest.items.map((item) => {
            const Icon = icons[item.id as keyof typeof icons] ?? Sparkles
            const on = selected.includes(item.id)
            return (
              <button
                key={item.id}
                className={`ithaca-btn ${on ? 'is-on' : 'is-pulse'}`}
                type="button"
                data-id={item.id}
                aria-label={`${item.label}. Optional reflection. No typed response required.`}
                onClick={() => {
                  if (on) return
                  const next = [...selected, item.id]
                  setPicked(next)
                  onSignals?.(next)
                  sound.playReflection(item.id as 'discover' | 'carry' | 'next')
                  if (next.length >= dest.items.length) onComplete()
                }}
              >
                <Icon size={18} strokeWidth={1.6} />
                {shorts[item.id as keyof typeof shorts] ?? item.label}
              </button>
            )
          })}
        </div>
        {latestItem ? <p className="ithaca-note">{latestItem.label}</p> : null}
      </>
    )
  }

  if (dest.interaction === 'crates') {
    const icons = { spaces: MapPin, equipment: Package, payroll: Coins }
    const selected = picks ?? picked
    return (
      <div className="collect collect-crates">
        {dest.items.map((item) => {
          const Icon = icons[item.id as keyof typeof icons] ?? Package
          const on = selected.includes(item.id)
          return (
            <button
              key={item.id}
              className={`crate-btn ${on ? 'is-on' : 'is-pulse'}`}
              type="button"
              aria-label={`${item.label}. Optional.`}
              onClick={() => {
                if (on) return
                const next = [...selected, item.id]
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
