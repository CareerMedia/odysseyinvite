import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { mapTextureVars, textures } from '../assets/textures'
import { destinations, getDestination, VOYAGE_PATH } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'
import { DestinationKind, DestStatus } from '../types'
import { nextAvailableId, storyCompletion } from '../utils/voyageState'
import { DestinationArt } from './DestinationArt'
import { AmbientParticles } from './AmbientParticles'

gsap.registerPlugin(MotionPathPlugin)

export function VoyageMap({ fromOcean }: { fromOcean: boolean }) {
  const {
    progress,
    arriveAt,
    revealAround,
    reducedMotion,
    isMobile,
    sound,
    requestDestination,
    enterChapter,
    statusOf,
    mapFocus,
    world,
    forbiddenReveal,
    endForbiddenReveal,
    lockedHint,
  } = useExperience()
  const root = useRef<HTMLDivElement>(null)
  const camera = useRef<HTMLDivElement>(null)
  const mapShip = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const sailing = useRef(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const current = useMemo(
    () => destinations.find((item) => item.id === progress.currentDestinationId) ?? destinations[0],
    [progress.currentDestinationId],
  )
  const completion = storyCompletion(progress)

  useLayoutEffect(() => {
    if (!mapShip.current || !pathRef.current) return
    gsap.set(mapShip.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.55],
        autoRotate: 90,
        start: current.routePosition,
        end: current.routePosition,
      },
    })
    setMapReady(true)
  }, [current.routePosition])

  useEffect(() => {
    if (!fromOcean) return
    window.setTimeout(() => sound.play('paper'), reducedMotion ? 80 : 4800)
  }, [fromOcean, reducedMotion, sound])

  useEffect(() => {
    if (!camera.current || !mapFocus) return
    if (mapFocus.mode === 'full') {
      gsap.to(camera.current, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power2.out' })
      return
    }
    const dest = destinations.find((item) => item.id === (mapFocus.id ?? progress.currentDestinationId))
    if (!dest || isMobile) return
    gsap.to(camera.current, {
      x: (0.5 - dest.position.x / 1700) * 48,
      y: (0.5 - dest.position.y / 980) * 32,
      scale: mapFocus.mode === 'destination' ? 1.08 : 1,
      duration: 1.2,
      ease: 'power2.out',
    })
  }, [isMobile, mapFocus, progress.currentDestinationId])

  const sailTo = (id: string) => {
    if (!requestDestination(id)) return
    const target = destinations.find((item) => item.id === id)
    const path = pathRef.current
    const ship = mapShip.current
    if (!target || !path || !ship || sailing.current) {
      enterChapter(id)
      return
    }

    revealAround(id)
    if (reducedMotion || target.id === current.id) {
      arriveAt(id)
      enterChapter(id)
      return
    }

    sailing.current = true
    sound.play('paper')
    const start = current.routePosition
    const end = target.routePosition
    const duration = Math.max(1.4, Math.abs(end - start) * 7)

    gsap.to(ship, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.7],
        autoRotate: 90,
        start,
        end,
      },
      duration,
      ease: 'power1.inOut',
      onComplete: () => {
        sailing.current = false
        arriveAt(id)
        enterChapter(id)
        sound.play('chime')
      },
    })

    if (camera.current && !isMobile) {
      gsap.to(camera.current, {
        x: (0.5 - target.position.x / 1700) * 40,
        y: (0.5 - target.position.y / 980) * 28,
        duration,
        ease: 'power1.inOut',
      })
    }
  }

  return (
    <div
      className={`map-world ${mapReady ? 'is-ready' : ''} time-${world.timeOfDay} ${world.timeOfDay === 'twilight' ? 'is-twilight' : ''} ${progress.revealedIds.includes('forbidden') && !progress.completedIds.includes('forbidden') ? 'is-rising' : ''} ${forbiddenReveal ? 'is-revealing' : ''}`}
      style={mapTextureVars()}
      ref={root}
    >
      <div className="map-camera" ref={camera}>
        <svg className="map-art" viewBox="0 0 1700 980" role="img" aria-label="Illustrated voyage map of the Career Center Odyssey">
          <defs>
            <linearGradient id="seaPaint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2a6a78" />
              <stop offset="0.5" stopColor="#1d5360" />
              <stop offset="1" stopColor="#2f6e62" />
            </linearGradient>
            <radialGradient id="islandGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#e8d48b" stopOpacity="0.45" />
              <stop offset="1" stopColor="#e8d48b" stopOpacity="0" />
            </radialGradient>
            <pattern id="mapParchment" patternUnits="userSpaceOnUse" width="280" height="280">
              <image href={textures.paper} width="280" height="280" preserveAspectRatio="xMidYMid slice" />
            </pattern>
            <pattern id="mapLeather" patternUnits="userSpaceOnUse" width="240" height="240">
              <image href={textures.leather} width="240" height="240" preserveAspectRatio="xMidYMid slice" />
            </pattern>
            <pattern id="mapTerrain" patternUnits="userSpaceOnUse" width="260" height="260">
              <image href={textures.terrain} width="260" height="260" preserveAspectRatio="xMidYMid slice" />
            </pattern>
            <pattern id="mapWood" patternUnits="userSpaceOnUse" width="180" height="180">
              <image href={textures.wood} width="180" height="180" preserveAspectRatio="xMidYMid slice" />
            </pattern>
            <mask id="fogMask">
              <rect width="1700" height="980" fill="white" />
              {(progress.voyageComplete
                ? destinations
                    .filter((item) => item.kind !== DestinationKind.Hidden || progress.revealedIds.includes(item.id))
                    .map((item) => item.id)
                : progress.revealedIds
              ).map((id) => {
                const dest = destinations.find((item) => item.id === id)
                if (!dest) return null
                const r = progress.voyageComplete ? 240 : id === 'prologue' ? 200 : 140
                return (
                  <path
                    key={id}
                    fill="black"
                    d={`M ${dest.position.x - r} ${dest.position.y} C ${dest.position.x - r * 0.6} ${dest.position.y - r} ${dest.position.x + r * 0.5} ${dest.position.y - r * 0.85} ${dest.position.x + r} ${dest.position.y} C ${dest.position.x + r * 0.55} ${dest.position.y + r * 0.9} ${dest.position.x - r * 0.4} ${dest.position.y + r} ${dest.position.x - r} ${dest.position.y} Z`}
                  />
                )
              })}
            </mask>
          </defs>

          <rect width="1700" height="980" fill="url(#mapParchment)" />
          <rect width="1700" height="980" fill="#c4a56a" opacity="0.55" style={{ mixBlendMode: 'color' }} />
          <rect width="1700" height="980" fill="url(#mapLeather)" opacity="0.18" style={{ mixBlendMode: 'multiply' }} />
          <path d="M 80 40 H 1620 M 80 120 H 1620 M 80 200 H 1620 M 80 280 H 1620 M 80 360 H 1620 M 80 440 H 1620 M 80 520 H 1620 M 80 600 H 1620 M 80 680 H 1620 M 80 760 H 1620 M 80 840 H 1620 M 80 920 H 1620" stroke="#5a3d16" strokeWidth="0.4" opacity="0.12" />
          <path d="M 40 80 C 280 40 520 220 820 160 C 1120 100 1380 260 1660 140 L 1700 0 L 0 0 Z" fill="#c9b17a" opacity="0.45" />
          <path d="M 80 200 C 260 280 220 520 420 620 C 700 780 980 720 1280 820 C 1480 880 1600 760 1680 860 L 1700 980 L 0 980 L 0 240 Z" fill="url(#seaPaint)" opacity="0.72" />
          <path d="M 120 260 C 300 340 280 540 460 640 C 740 790 1020 740 1300 840" fill="none" stroke="#1a4450" strokeWidth="18" opacity="0.12" />
          <path d="M 200 300 C 360 360 340 500 500 560 C 640 610 720 540 780 500" fill="none" stroke="#7ec8b8" strokeWidth="1.2" opacity="0.22" />
          <path d="M 860 420 C 980 380 1080 430 1220 400 C 1360 370 1480 300 1600 250" fill="none" stroke="#e8d48b" strokeWidth="1" opacity="0.18" />
          <path d="M 60 700 C 200 640 260 760 420 820 C 200 900 80 820 60 700 Z" fill="#c4b07a" />
          <path d="M 60 700 C 200 640 260 760 420 820 C 200 900 80 820 60 700 Z" fill="url(#mapTerrain)" opacity="0.4" style={{ mixBlendMode: 'multiply' }} />
          <path d="M 1480 40 C 1580 20 1660 80 1680 40 L 1700 0 L 1460 0 Z" fill="#b9975c" />
          <path d="M 1480 40 C 1580 20 1660 80 1680 40 L 1700 0 L 1460 0 Z" fill="url(#mapTerrain)" opacity="0.35" style={{ mixBlendMode: 'multiply' }} />
          <circle cx="240" cy="400" r="2" fill="#c9a84c" opacity="0.55" />
          <circle cx="710" cy="690" r="2" fill="#c9a84c" opacity="0.4" />
          <circle cx="1180" cy="510" r="2" fill="#c9a84c" opacity="0.45" />

          <MapCartouche />
          <CompassRose unstable={world.weather === 'oracleAnomaly' || forbiddenReveal || world.weather === 'storm'} />
          <SeaBeast />
          <MapStories />

          <path
            ref={pathRef}
            d={VOYAGE_PATH}
            fill="none"
            stroke={progress.voyageComplete ? '#c9a84c' : '#5a3d16'}
            strokeWidth="2.2"
            strokeDasharray="3 10"
            opacity="0.75"
          />

          {destinations.map((dest) => {
            const status = statusOf(dest.id)
            if (dest.kind === DestinationKind.Hidden && status === DestStatus.Locked) return null
            const revealed = status !== DestStatus.Locked
            const isCurrent = status === DestStatus.Current
            const isOpen = dest.id === hovered
            return (
              <g
                key={dest.id}
                className={`destination is-${status} ${revealed ? 'is-revealed' : ''} ${isCurrent ? 'is-current' : ''} ${isOpen ? 'is-open' : ''} ${status === DestStatus.Completed ? `is-memory-${dest.visualType}` : ''}`}
                tabIndex={status === DestStatus.Locked ? -1 : 0}
                role="button"
                aria-label={`${dest.mythicTitle}. ${status}. ${dest.actualTitle}. ${dest.timeRange}`}
                onMouseEnter={() => {
                  setHovered(dest.id)
                  if (revealed) sound.play('hover')
                }}
                onMouseLeave={() => setHovered(null)}
                onClick={() => sailTo(dest.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    sailTo(dest.id)
                  }
                }}
              >
                {revealed || isOpen ? <circle cx={dest.position.x} cy={dest.position.y} r="48" fill="url(#islandGlow)" /> : null}
                <DestinationArt type={dest.visualType} x={dest.position.x} y={dest.position.y} />
                <circle
                  className="marker-core"
                  cx={dest.position.x}
                  cy={dest.position.y + 26}
                  r={dest.kind === DestinationKind.Minor ? 4 : 6}
                  fill={status === DestStatus.Completed ? '#2a8a8a' : isCurrent ? '#d22030' : revealed ? '#c9a84c' : '#7a6840'}
                />
                {isCurrent ? (
                  <circle className="marker-ring" cx={dest.position.x} cy={dest.position.y + 26} r="10" fill="none" stroke="#c9a84c" strokeWidth="1.2" />
                ) : null}
                <circle className="destination-hit" cx={dest.position.x} cy={dest.position.y} r={isMobile ? 36 : 28} />
                <g className="destination-label" transform={`translate(${dest.position.x}, ${dest.position.y - 42})`}>
                  <rect x="-78" y="-16" width="156" height={dest.chapter ? 38 : 26} rx="3" fill="rgba(16, 22, 32, 0.72)" />
                  {dest.chapter ? (
                    <text textAnchor="middle" fill="#e8d48b" fontFamily="Cinzel, serif" fontSize="10" letterSpacing="1.4">
                      {dest.chapter}
                    </text>
                  ) : null}
                  <text y={dest.chapter ? 16 : 4} textAnchor="middle" fill="#e8d5b0" fontFamily="Cinzel, serif" fontSize={dest.kind === DestinationKind.Minor ? 11 : 13}>
                    {dest.mythicTitle}
                  </text>
                  {lockedHint === dest.id ? (
                    <text y={dest.chapter ? 32 : 20} textAnchor="middle" fill="#d22030" fontFamily="Manrope, sans-serif" fontSize="9">
                      Locked · Chart the previous destination
                    </text>
                  ) : null}
                </g>
              </g>
            )
          })}

          <g ref={mapShip} className="map-ship">
            <g className="map-ship-body">
              <ellipse cx="0" cy="11" rx="16" ry="4" fill="rgba(60,40,10,0.28)" />
              <path d="M-16 4 C -4 -2 8 -2 18 4 C 10 10 -6 10 -16 4 Z" fill="#6a4022" />
              <path d="M-16 4 C -4 -2 8 -2 18 4 C 10 10 -6 10 -16 4 Z" fill="url(#mapWood)" opacity="0.45" style={{ mixBlendMode: 'multiply' }} />
              <path d="M2 -16 L 2 4" stroke="#3a2416" strokeWidth="1.6" />
              <path d="M2 -14 L 14 -8 L 2 -4 Z" fill="#efe4c8" />
              <g transform="translate(12 -18)">
                <path d="M0 0 L 0 10" stroke="#3a2416" strokeWidth="1" />
                <path d="M0 1 L 9 5 L 0 8 Z" fill="#d22030" />
              </g>
            </g>
          </g>

          <g mask="url(#fogMask)" pointerEvents="none">
            <path d="M 40 40 C 220 10 380 90 560 40 C 780 -10 980 80 1200 30 C 1420 -10 1600 70 1680 20 L 1700 0 L 0 0 Z" fill="rgba(236,232,220,0.42)" />
            <path d="M 80 360 C 260 300 420 400 640 340 C 860 280 1100 400 1400 320 C 1580 270 1680 360 1700 300 L 1700 980 L 0 980 L 0 420 Z" fill="rgba(220,214,196,0.38)" />
          </g>

          <MapEasterEggs />
          <KrakenTentacle unlocked={progress.unlockedAchievementIds.includes('kraken-encounter')} />
        </svg>
        <div className="map-parchment" />
        <div className="map-stain" />
        <FogLayer />
        <AmbientParticles mode="map" reduced={reducedMotion} isMobile={isMobile} />
        {forbiddenReveal ? <ForbiddenReveal onDone={endForbiddenReveal} /> : null}
        {progress.voyageComplete ? (
          <div className="voyage-complete-banner">
            <p>Voyage complete</p>
            <span>
              {completion.done} / {completion.total} destinations · {progress.xp} Odyssey XP · {progress.unlockedAchievementIds.length} achievements
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MapCartouche() {
  return (
    <g transform="translate(90 70)" opacity="0.82">
      <rect x="0" y="0" width="280" height="78" fill="url(#mapParchment)" stroke="#5a3d16" strokeWidth="1.2" />
      <rect x="0" y="0" width="280" height="78" fill="#e8d5b0" opacity="0.55" style={{ mixBlendMode: 'color' }} />
      <rect x="6" y="6" width="268" height="66" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
      <text x="140" y="32" textAnchor="middle" fill="#8b1e24" fontFamily="Cinzel, serif" fontSize="11" letterSpacing="2">
        EXPEDITION CHART
      </text>
      <text x="140" y="56" textAnchor="middle" fill="#2a2114" fontFamily="Cinzel, serif" fontSize="16">
        The Career Center Odyssey
      </text>
    </g>
  )
}

function CompassRose({ unstable }: { unstable: boolean }) {
  const { progress } = useExperience()
  const here = getDestination(progress.currentDestinationId) ?? destinations[0]
  const next = getDestination(nextAvailableId(progress) ?? 'ithaca') ?? destinations[destinations.length - 2]
  const angle = Math.atan2(next.position.y - here.position.y, next.position.x - here.position.x) * (180 / Math.PI) + 90
  const settled = progress.voyageComplete || progress.currentDestinationId === 'ithaca'

  return (
    <g transform="translate(1540 820)" opacity="0.8" aria-hidden="true">
      <circle r="46" fill="none" stroke="#5a3d16" strokeWidth="1.2" />
      <circle r="28" fill="none" stroke="#5a3d16" strokeWidth="0.8" />
      <g
        className={`compass-needle ${unstable ? 'is-unstable' : ''}`}
        style={{ transform: `rotate(${settled ? 0 : angle}deg)` }}
      >
        <path d="M0 -40 L 6 -6 L 0 0 L -6 -6 Z" fill="#8b1e24" />
        <path d="M0 40 L -6 6 L 0 0 L 6 6 Z" fill="#5a3d16" />
        <path d="M-40 0 L -6 -6 L 0 0 L -6 6 Z" fill="#5a3d16" />
        <path d="M40 0 L 6 6 L 0 0 L 6 -6 Z" fill="#5a3d16" />
      </g>
      <text y="-52" textAnchor="middle" fill="#5a3d16" fontFamily="Cinzel, serif" fontSize="11">N</text>
    </g>
  )
}

function SeaBeast() {
  return (
    <g transform="translate(430 860)" opacity="0.28" fill="none" stroke="#3d2a12" strokeWidth="1.4">
      <path d="M0 0 C 20 -20 48 -16 70 6 C 88 24 120 16 138 -4" />
      <path d="M70 6 C 74 -10 90 -18 104 -8" />
      <circle cx="146" cy="-8" r="3" fill="#3d2a12" />
    </g>
  )
}

function MapStories() {
  return (
    <g opacity="0.32" fill="#5a3d16">
      <path d="M1180 720 L 1192 690 L 1206 722 Z" />
      <rect x="1320" y="780" width="28" height="10" rx="2" transform="rotate(-8 1334 785)" />
      <circle cx="1560" cy="640" r="7" fill="none" stroke="#5a3d16" />
      <path d="M200 180 C 220 160 250 168 260 190" fill="none" stroke="#5a3d16" strokeDasharray="3 4" />
    </g>
  )
}

function ForbiddenReveal({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 4200)
    return () => window.clearTimeout(id)
  }, [onDone])

  return (
    <div className="island-reveal" role="status">
      <div className="island-reveal-copy">
        <p>Uncharted land discovered</p>
        <p>The Forbidden Island</p>
      </div>
    </div>
  )
}

function MapEasterEggs() {
  const { unlockAchievement, progress } = useExperience()
  const [star, setStar] = useState(false)

  useEffect(() => {
    if (progress.unlockedAchievementIds.includes('wish-star')) return
    const tick = () => setStar((current) => !current)
    const id = window.setInterval(tick, 16000)
    return () => window.clearInterval(id)
  }, [progress.unlockedAchievementIds])

  const egg = (
    id: string,
    label: string,
    x: number,
    y: number,
    drawing: ReactNode,
  ) =>
    progress.unlockedAchievementIds.includes(id) ? null : (
      <g
        className="map-egg"
        tabIndex={0}
        role="button"
        aria-label={label}
        transform={`translate(${x} ${y})`}
        onClick={() => unlockAchievement(id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            unlockAchievement(id)
          }
        }}
      >
        {drawing}
      </g>
    )

  return (
    <g>
      {egg('ancient-artifact', 'A half-buried amphora', 250, 520, <path d="M0 12 L -6 0 L 0 -14 L 6 0 Z" fill="#8b6914" />)}
      {egg('poseidon-trident', "Poseidon's trident", 1420, 520, <path d="M0 16 L 0 -12 M -8 -4 L 0 -12 L 8 -4" stroke="#2a6a78" strokeWidth="2" fill="none" />)}
      {egg('lost-treasure', 'A lost treasure chest', 720, 820, <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#8b5a32" stroke="#c9a84c" />)}
      {star && !progress.unlockedAchievementIds.includes('wish-star') ? (
        <g
          className="map-egg map-star"
          tabIndex={0}
          role="button"
          aria-label="A rare shooting star"
          transform="translate(1100 160)"
          onClick={() => unlockAchievement('wish-star')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              unlockAchievement('wish-star')
            }
          }}
        >
          <path d="M0 0 L 36 12" stroke="#e8d48b" strokeWidth="1.6" />
          <circle r="3" fill="#e8d48b" />
        </g>
      ) : null}
    </g>
  )
}

function FogLayer() {
  return (
    <div className="fog-layer" aria-hidden="true">
      <div className="fog-cloud" style={{ width: '36vw', height: '18vw', top: '8%', left: '18%' }} />
      <div className="fog-cloud" style={{ width: '42vw', height: '16vw', top: '28%', left: '52%', animationDuration: '28s' }} />
      <div className="fog-cloud" style={{ width: '30vw', height: '14vw', top: '58%', left: '36%', animationDuration: '24s' }} />
    </div>
  )
}

function KrakenTentacle({ unlocked }: { unlocked: boolean }) {
  const { unlockAchievement, reducedMotion } = useExperience()
  const arm = useRef<SVGGElement>(null)
  const [visible, setVisible] = useState(reducedMotion && !unlocked)

  useEffect(() => {
    if (unlocked || reducedMotion) return
    let timeout = 0
    const cycle = () => {
      setVisible(true)
      timeout = window.setTimeout(() => {
        setVisible(false)
        timeout = window.setTimeout(cycle, 14000 + Math.random() * 12000)
      }, 5200)
    }
    timeout = window.setTimeout(cycle, 6000)
    return () => window.clearTimeout(timeout)
  }, [reducedMotion, unlocked])

  useEffect(() => {
    if (!arm.current || reducedMotion) return
    gsap.fromTo(
      arm.current,
      { y: 40, rotate: -8, opacity: 0 },
      { y: 0, rotate: 6, opacity: 1, duration: 1.4, yoyo: true, repeat: 1, ease: 'sine.inOut' },
    )
  }, [reducedMotion, visible])

  if (unlocked || !visible) return null

  return (
    <g
      ref={arm}
      className="kraken"
      tabIndex={0}
      role="button"
      aria-label="A strange tentacle rising from the painted sea. Investigate."
      transform="translate(780 780)"
      onClick={() => unlockAchievement('kraken-encounter')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          unlockAchievement('kraken-encounter')
        }
      }}
    >
      <path
        className="kraken-arm"
        d="M10 70 C 0 40 18 28 8 8 C 2 -6 24 -8 28 8 C 32 28 16 40 26 70"
        fill="#4a2c3a"
        stroke="#2a1818"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="16" r="3" fill="#8b1e24" />
      <circle cx="14" cy="30" r="2.4" fill="#8b1e24" />
      <circle cx="10" cy="44" r="2.2" fill="#8b1e24" />
    </g>
  )
}
