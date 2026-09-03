import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { EVENT } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'
import { Scene } from '../types'

type IntroPhase = 'loading' | 'entry' | 'prologue' | 'title'

export function CinematicIntro() {
  const {
    scene,
    beginVoyage,
    enterWorld,
    completeIntro,
    skipToTitle,
    reducedMotion,
    toggleDetails,
    sound,
    progress,
    isMobile,
  } = useExperience()
  const root = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const departingPlayed = useRef(false)
  const [phase, setPhase] = useState<IntroPhase>(() => {
    if (skipToTitle || reducedMotion) return 'title'
    return 'loading'
  })
  const [titleReady, setTitleReady] = useState(skipToTitle || reducedMotion)
  const [canSkip, setCanSkip] = useState(skipToTitle || reducedMotion)

  useEffect(() => {
    if (!skipToTitle && !reducedMotion) return
    revealWorldImmediate()
  }, [reducedMotion, skipToTitle])

  useEffect(() => {
    if (phase !== 'loading') return
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setPhase(progress.soundChoiceMade ? 'prologue' : 'entry')
    }
    const timer = window.setTimeout(finish, reducedMotion ? 200 : 1100)
    void document.fonts?.ready.then(finish)
    return () => window.clearTimeout(timer)
  }, [phase, progress.soundChoiceMade, reducedMotion])

  useEffect(() => {
    if (phase !== 'prologue' || !root.current || played.current) return
    played.current = true
    const ctx = gsap.context(() => {
      if (skipToTitle || reducedMotion) {
        revealWorldImmediate()
        setTitleReady(true)
        setPhase('title')
        completeIntro()
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          completeIntro()
          setTitleReady(true)
          setPhase('title')
        },
      })

      gsap.set('.title-card', { autoAlpha: 0 })
      gsap.set('.reveal-layer', { opacity: 0 })
      gsap.set('.ship-silhouette', { opacity: 1 })
      gsap.set('.ship-detail', { opacity: 0 })

      tl.to('.mark', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.8 }, 1.1)
        .fromTo('.prologue-line.first', { opacity: 0, y: 10, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8 }, 2.2)
        .to('.prologue-line.first', { opacity: 0, filter: 'blur(6px)', duration: 1.1 }, 5.4)
        .fromTo('.prologue-line.second', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.8 }, 6.2)
        .to('.prologue-line.second', { opacity: 0, duration: 1.1 }, 9.2)
        .fromTo('.prologue-line.third', { opacity: 0, y: 8 }, { opacity: 0.72, y: 0, duration: 1.6 }, 10)
        .to('.prologue-layer', { opacity: 0, filter: 'blur(8px)', duration: 1.4 }, 12.4)
        .fromTo('.moonline', { width: 0, opacity: 0 }, { width: isMobile ? '58vw' : '38vw', opacity: 1, duration: 2 }, 13.1)
        .to('.intro-veil', { opacity: 0.55, duration: 1.6 }, 13.4)
        .to('.reveal-stars', { opacity: 1, duration: 2.2 }, 13.6)
        .to('.reveal-moon', { opacity: 1, filter: 'blur(0px)', duration: 2.4 }, 14.2)
        .to('.reveal-clouds', { opacity: 1, duration: 2.2 }, 14.8)
        .to('.reveal-mist', { opacity: 1, duration: 2 }, 15.2)
        .to('.reveal-horizon', { opacity: 1, duration: 2.2 }, 15.5)
        .to('.reveal-water', { opacity: 1, duration: 2.4 }, 16)
        .to('.reveal-waves-far', { opacity: 0.5, duration: 1.8 }, 16.5)
        .to('.reveal-ship', { opacity: 1, duration: 2.2 }, 17)
        .to('.ship-detail', { opacity: 1, duration: 1.8 }, 17.8)
        .to('.ship-silhouette', { opacity: 0, duration: 1.6 }, 17.8)
        .to('.reveal-waves-near', { opacity: 1, duration: 1.8 }, 18.4)
        .to('.intro-veil', { opacity: 0, duration: 1.8 }, 18.2)
        .to('.moonline', { opacity: 0, duration: 1.2 }, 19)
        .add(() => sound.setAmbienceProximity(0.85, 2.8), 16.2)
        .fromTo('.title-eyebrow', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 20.4)
        .fromTo('.title-the', { autoAlpha: 0, y: 12, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 21)
        .fromTo('.title-center', { autoAlpha: 0, y: 14, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2 }, 21.5)
        .fromTo('.title-odyssey', { autoAlpha: 0, y: 18, scale: 0.985, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.6 }, 22.2)
        .fromTo('.title-meta', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 23.2)
        .fromTo('.title-motto', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 23.9)
        .fromTo('.title-cta', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 24.5)
        .to('.title-card', { autoAlpha: 1, duration: 0.01 }, 20.3)

      window.setTimeout(() => setCanSkip(true), 1800)
    }, root)
    return () => ctx.revert()
  }, [completeIntro, isMobile, phase, reducedMotion, skipToTitle, sound])

  useEffect(() => {
    if (scene !== Scene.Departing || departingPlayed.current || !root.current) return
    departingPlayed.current = true
    gsap.to(root.current.querySelectorAll('.title-card, .letterbox, .skip-intro'), {
      autoAlpha: 0,
      y: reducedMotion ? 0 : -12,
      filter: reducedMotion ? 'none' : 'blur(8px)',
      duration: reducedMotion ? 0.35 : 0.9,
      ease: 'power2.in',
    })
  }, [reducedMotion, scene])

  const revealWorldImmediate = () => {
    gsap.set('.intro-veil', { opacity: 0 })
    gsap.set('.prologue-layer', { autoAlpha: 0 })
    gsap.set('.moonline', { opacity: 0 })
    gsap.set('.reveal-layer', { opacity: 1 })
    gsap.set('.ship-silhouette', { opacity: 0 })
    gsap.set('.ship-detail', { opacity: 1 })
    gsap.set('.title-card', { autoAlpha: 1 })
    gsap.set('.title-eyebrow, .title-the, .title-center, .title-odyssey, .title-meta, .title-motto, .title-cta', { autoAlpha: 1, y: 0, filter: 'none' })
  }

  const skip = () => {
    gsap.killTweensOf(root.current?.querySelectorAll('*') ?? [])
    revealWorldImmediate()
    setTitleReady(true)
    setPhase('title')
    completeIntro()
    sound.setAmbienceProximity(0.85, 0.8)
  }

  const chooseEntry = (withSound: boolean) => {
    enterWorld(withSound)
    setPhase('prologue')
  }

  return (
    <div className={`intro ${scene === Scene.Departing ? 'is-leaving' : ''}`} ref={root}>
      <div className="letterbox letterbox-top" />
      <div className="letterbox letterbox-bottom" />
      <div className="intro-veil" />
      <div className="moonline" />

      {phase === 'loading' ? (
        <div className="voyage-loader" role="status">
          <p>Charting the course</p>
          <span className="loader-line" />
        </div>
      ) : null}

      {phase === 'entry' ? (
        <div className="entry-gate">
          <p className="eyebrow">The Career Center Odyssey</p>
          <h2>Enter the Odyssey</h2>
          <p className="entry-note">For the full experience, turn your sound on.</p>
          <div className="entry-actions">
            <button className="cta-primary" type="button" onClick={() => chooseEntry(true)}>
              Enter with sound
            </button>
            <button className="cta-secondary" type="button" onClick={() => chooseEntry(false)}>
              Enter silently
            </button>
          </div>
        </div>
      ) : null}

      {phase === 'prologue' ? (
        <div className="intro-copy prologue-layer">
          <CompassMark />
          <p className="prologue-line first">Every great team has a story.</p>
          <p className="prologue-line second">Ours is about to enter a new chapter.</p>
          <p className="prologue-line third">The sea is calling.</p>
        </div>
      ) : null}

      <div className={`title-card ${titleReady || phase === 'title' ? 'is-ready' : ''}`} aria-hidden={!titleReady}>
        <p className="eyebrow title-eyebrow">{EVENT.eyebrow}</p>
        <h1>
          <span className="title-the">The</span>
          <span className="title-center">Career Center</span>
          <em className="title-odyssey">Odyssey</em>
        </h1>
        <div className="title-meta">
          <p className="season">{EVENT.subtitle}</p>
          <p className="when">{EVENT.dateLabel}</p>
          <p className="where">{EVENT.location}</p>
        </div>
        <p className="motto title-motto">{EVENT.motto}</p>
        <div className="cta-row title-cta">
          <MagneticButton
            onClick={() => {
              sound.play('click')
              beginVoyage()
            }}
            onHover={() => sound.play('hover')}
          >
            Begin the Voyage
          </MagneticButton>
          <button className="cta-secondary" type="button" onClick={() => toggleDetails(true)}>
            View expedition details
          </button>
        </div>
      </div>

      {canSkip && phase === 'prologue' ? (
        <button className="skip-intro" type="button" onClick={skip}>
          Skip
        </button>
      ) : null}
    </div>
  )
}

function CompassMark() {
  return (
    <svg className="mark" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="28" fill="none" stroke="#c9a84c" strokeWidth="1.2" />
      <circle cx="40" cy="40" r="4" fill="#d22030" />
      <path d="M40 12 L44 36 L40 33 L36 36 Z" fill="#e8d48b" />
      <path d="M40 68 L36 44 L40 47 L44 44 Z" fill="#c9a84c" />
      <path d="M12 40 L36 36 L33 40 L36 44 Z" fill="#c9a84c" />
      <path d="M68 40 L44 44 L47 40 L44 36 Z" fill="#c9a84c" />
    </svg>
  )
}

function MagneticButton({
  children,
  onClick,
  onHover,
}: {
  children: string
  onClick: () => void
  onHover: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      className="cta-primary cta-voyage"
      type="button"
      onClick={onClick}
      onPointerEnter={onHover}
      onPointerMove={(event) => {
        const node = ref.current
        if (!node) return
        const box = node.getBoundingClientRect()
        const x = event.clientX - (box.left + box.width / 2)
        const y = event.clientY - (box.top + box.height / 2)
        node.style.transform = `translate(${x * 0.1}px, ${y * 0.12}px) scale(1.02)`
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = ''
      }}
    >
      <span className="cta-compass" aria-hidden="true" />
      {children}
    </button>
  )
}
