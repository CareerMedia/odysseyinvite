import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useExperience } from '../hooks/ExperienceContext'
import { usePointer } from '../hooks/usePointer'
import { Scene } from '../types'
import { AmbientParticles, StarField } from './AmbientParticles'
import { OceanLife } from './OceanLife'
import { OdysseyShip } from './OdysseyShip'

export function OceanScene() {
  const { scene, reducedMotion, isMobile, skipToTitle, progress, world, pageHidden } = useExperience()
  const camera = useRef<HTMLDivElement>(null)
  const ship = useRef<HTMLDivElement>(null)
  const mist = useRef<HTMLDivElement>(null)
  const flatten = useRef<HTMLDivElement>(null)
  const departing = scene === Scene.Departing
  const [revealed, setRevealed] = useState(
    () => skipToTitle || departing || (progress.introCompleted && scene !== Scene.Cinematic),
  )
  const pointer = usePointer(!isMobile && !reducedMotion && scene !== Scene.Map)

  useEffect(() => {
    if (departing || skipToTitle) setRevealed(true)
  }, [departing, skipToTitle])

  useEffect(() => {
    const reveal = () => setRevealed(true)
    window.addEventListener('odyssey-intro-reveal', reveal)
    return () => window.removeEventListener('odyssey-intro-reveal', reveal)
  }, [])

  useEffect(() => {
    if (!camera.current || reducedMotion || departing) return
    gsap.to(camera.current, {
      x: pointer.x * 8,
      y: pointer.y * 4,
      duration: 2.2,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [departing, pointer.x, pointer.y, reducedMotion])

  useEffect(() => {
    if (!camera.current || reducedMotion || departing) return
    const drift = gsap.to(camera.current, {
      y: '+=6',
      duration: 9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
    return () => {
      drift.kill()
    }
  }, [departing, reducedMotion])

  useEffect(() => {
    if (!departing || !camera.current || !ship.current || !mist.current) return
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.to(camera.current, { scale: 1.04, duration: 0.6 })
        gsap.to(flatten.current, { opacity: 0.55, duration: 0.6 })
        return
      }
      const tl = gsap.timeline()
      tl.to('.cta-voyage', { scale: 0.98, duration: 0.18 }, 0)
        .to(camera.current, { scale: 1.08, y: 18, duration: 1.4, ease: 'power2.inOut' }, 0.4)
        .to(ship.current, { x: 36, duration: 1.8, ease: 'power1.in' }, 0.8)
        .to('.waves svg', { animationDuration: '6s', duration: 1.2 }, 1.4)
        .to(camera.current, { scale: 1.2, y: 28, duration: 1.4, ease: 'power2.inOut' }, 1.8)
        .to(ship.current, { x: 90, scale: 1.06, duration: 1.8, ease: 'power2.in' }, 2.2)
        .to(mist.current, { opacity: 0.85, xPercent: 18, duration: 1.5, ease: 'sine.inOut' }, 3.2)
        .to(camera.current, { scale: 1.42, y: -70, duration: 1.7, ease: 'power3.inOut' }, 3.8)
        .to(flatten.current, { opacity: 0.72, duration: 1.6, ease: 'power2.inOut' }, 4.4)
        .to(camera.current, { scale: 1.58, y: -120, filter: 'saturate(0.72) blur(1px)', duration: 1.6, ease: 'power2.in' }, 5.1)
        .to(ship.current, { scale: 0.42, y: -40, opacity: 0.35, duration: 1.5, ease: 'power2.in' }, 5.2)
        .to(mist.current, { opacity: 1, duration: 1.1 }, 5.6)
    })
    return () => ctx.revert()
  }, [departing, reducedMotion])

  return (
    <div className={`ocean ${departing ? 'is-departing' : ''} ${revealed ? 'is-revealed' : ''}`} data-sea={world.oceanIntensity} aria-hidden="true">
      <div className="ocean-camera" ref={camera}>
        <div className="ocean-layer sky" />
        <div className="reveal-layer reveal-stars">
          <StarField reduced={reducedMotion} isMobile={isMobile} pointer={pointer} />
        </div>
        <div
          className="moon-wrap reveal-layer reveal-moon"
          style={{ transform: `translate(${pointer.x * -3}px, ${pointer.y * -2}px)` }}
        >
          <div className="moon-halo" />
          <div className="moon" />
        </div>
        <div className="ocean-layer horizon-glow reveal-layer reveal-horizon" />
        <div className="ocean-layer distant-land reveal-layer reveal-horizon">
          <svg viewBox="0 0 1400 200" preserveAspectRatio="none">
            <path d="M0 160 C 80 140 140 150 200 130 C 280 104 340 148 420 128 C 500 108 560 150 640 138 C 760 118 820 156 940 132 C 1040 112 1120 150 1220 128 C 1300 114 1360 140 1400 128 L 1400 200 L 0 200 Z" fill="#0a1624" />
            <path d="M180 150 C 220 118 250 120 280 150" fill="#0c1b2c" />
            <path d="M860 146 C 910 100 960 104 1000 150" fill="#0c1b2c" />
            <circle className="island-light" cx="248" cy="128" r="2.2" fill="#e8a54b" />
            <circle className="island-light" cx="930" cy="118" r="2" fill="#e8d48b" />
          </svg>
        </div>
        <div
          className="ocean-layer clouds reveal-layer reveal-clouds"
          style={{ transform: `translate(${pointer.x * -6}px, ${pointer.y * -3}px)` }}
        >
          <div className="cloud cloud-a" />
          <div className="cloud cloud-b" />
          <div className="cloud cloud-c" />
          <div className="cloud cloud-d" />
        </div>
        <div className="ocean-layer water-body reveal-layer reveal-water">
          <div className="moon-path" />
          <div className="moon-glint g1" />
          <div className="moon-glint g2" />
          <div className="moon-glint g3" />
          <div className="moon-glint g4" />
          <div className="water-caustic" />
        </div>
        <WaveBand className="waves waves-far reveal-layer reveal-waves-far" fill="#14344a" path="far" />
        <WaveBand className="waves waves-mid reveal-layer reveal-waves-far" fill="#0f2c40" path="mid" />
        <div className="ship-stage" ref={ship}>
          <OdysseyShip reduced={reducedMotion} departing={departing} intensity={world.oceanIntensity} />
        </div>
        <WaveBand className="waves waves-near reveal-layer reveal-waves-near" fill="#0b2234" path="near" />
        <WaveBand className="waves waves-foam reveal-layer reveal-waves-near" fill="#16384c" path="foam" foam />
        <div
          className="ocean-layer mist reveal-layer reveal-mist"
          style={{ transform: `translate(${pointer.x * 8}px, ${pointer.y * 3}px)` }}
        />
        <OceanLife reduced={reducedMotion} active={!departing && revealed && !pageHidden} />
        <AmbientParticles mode="ocean" reduced={reducedMotion || isMobile || pageHidden} isMobile={isMobile} />
      </div>
      <div className="mist-sweep" ref={mist} />
      <div className="ocean-flatten" ref={flatten} />
    </div>
  )
}

const PATHS = {
  far: 'M0 96 C 160 70 240 122 400 94 C 560 68 640 124 800 92 C 960 64 1040 120 1200 90 C 1320 74 1380 100 1440 88 L 1440 180 L 0 180 Z',
  mid: 'M0 88 C 110 48 190 128 310 86 C 430 48 510 130 640 88 C 770 46 850 128 980 86 C 1100 50 1180 126 1300 90 C 1370 72 1410 96 1440 84 L 1440 180 L 0 180 Z',
  near: 'M0 80 C 90 36 170 126 280 78 C 400 28 470 132 600 76 C 730 24 800 136 930 80 C 1060 30 1130 128 1260 82 C 1350 54 1400 100 1440 76 L 1440 180 L 0 180 Z',
  foam: 'M0 86 C 90 42 170 132 280 84 C 400 34 470 138 600 82 C 730 30 800 142 930 86 C 1060 36 1130 134 1260 88 C 1350 60 1400 106 1440 82 L 1440 180 L 0 180 Z',
}

function WaveBand({
  className,
  fill,
  path,
  foam = false,
}: {
  className: string
  fill: string
  path: keyof typeof PATHS
  foam?: boolean
}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d={PATHS[path]} fill={fill} />
        {foam ? (
          <path
            d="M0 90 C 90 46 170 136 280 88 C 400 38 470 142 600 86 C 730 34 800 146 930 90 C 1060 40 1130 138 1260 92 C 1350 64 1400 110 1440 86"
            fill="none"
            stroke="rgba(210,232,232,0.22)"
            strokeWidth="2.5"
          />
        ) : null}
      </svg>
    </div>
  )
}
