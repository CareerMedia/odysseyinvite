import { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { useExperience } from '../../hooks/ExperienceContext'
import { destinations, getDestination } from '../../data/destinations'
import { nextAvailableId } from '../../utils/voyageState'
import { MAP_WORLD } from '../../data/mapWorld'

export function MapDecor({
  unstable,
  settled,
}: {
  unstable: boolean
  settled: boolean
}) {
  const { progress } = useExperience()
  const here = getDestination(progress.currentDestinationId) ?? destinations[0]
  const next = getDestination(nextAvailableId(progress) ?? 'ithaca') ?? destinations[destinations.length - 2]
  const angle = Math.atan2(next.position.y - here.position.y, next.position.x - here.position.x) * (180 / Math.PI) + 90

  return (
    <g className="map-decor" pointerEvents="none">
      <g transform="translate(720 520)" opacity="0.28" className="map-compass map-compass-faint">
        <circle r="86" fill="none" stroke="#c9a84c" strokeWidth="1" />
        <circle r="52" fill="none" stroke="#c9a84c" strokeWidth="0.6" />
        <path d="M0 -86 L 0 86 M -86 0 L 86 0" stroke="#c9a84c" strokeWidth="0.6" />
        <text y="-96" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel, serif" fontSize="14">N</text>
      </g>
      <g transform="translate(3280 1960)" opacity="0.78" className="map-compass">
        <circle r="58" fill="none" stroke="#c9a84c" strokeWidth="1.2" />
        <circle r="34" fill="none" stroke="#c9a84c" strokeWidth="0.7" />
        <path d="M0 -58 L 0 58 M -58 0 L 58 0" stroke="#c9a84c" strokeWidth="0.5" />
        <g className={`compass-needle ${unstable ? 'is-unstable' : ''}`} style={{ transform: `rotate(${settled ? 0 : angle}deg)` }}>
          <path d="M0 -48 L 6 -7 L 0 0 L -6 -7 Z" fill="#8b1e24" />
          <path d="M0 48 L -6 7 L 0 0 L 6 7 Z" fill="#5a3d16" />
        </g>
        <text y="-68" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel, serif" fontSize="13">N</text>
        <text y="4" x="66" fill="#c9a84c" fontFamily="Cinzel, serif" fontSize="11">E</text>
        <text y="4" x="-78" fill="#c9a84c" fontFamily="Cinzel, serif" fontSize="11">W</text>
        <text y="74" textAnchor="middle" fill="#c9a84c" fontFamily="Cinzel, serif" fontSize="11">S</text>
      </g>
      <g className="map-creature" opacity="0.16" fill="#3d2a12">
        <path d="M1480 1860 C 1540 1830 1620 1850 1680 1820 C 1740 1790 1800 1810 1760 1860 C 1710 1920 1580 1940 1490 1900 Z" />
        <path d="M1660 1830 C 1690 1800 1740 1808 1768 1788" fill="none" stroke="#3d2a12" strokeWidth="2" />
      </g>
      <g className="map-whale" opacity="0.14" fill="none" stroke="#3d2a12" strokeWidth="2">
        <path d="M1960 540 C 2000 520 2060 528 2100 548 C 2068 568 2010 572 1968 556" />
        <path d="M2100 548 C 2128 536 2148 552 2132 568" />
      </g>
      <g opacity="0.18" fill="#5a3d16">
        <path d="M640 620 L 654 588 L 668 624 Z" />
        <path d="M2280 1760 L 2290 1740 L 2302 1762 Z" />
        <circle cx="2040" cy="1880" r="8" fill="none" stroke="#5a3d16" />
        <circle cx="1320" cy="480" r="6" fill="none" stroke="#5a3d16" />
        <path d="M1520 420 C 1540 400 1570 408 1580 430" fill="none" stroke="#5a3d16" strokeDasharray="3 4" />
      </g>
      <text x="220" y="300" fill="rgba(201,168,76,0.3)" fontFamily="Cinzel, serif" fontSize="17" letterSpacing="5">
        DISCOVER · EXPLORE · PREPARE · BELONG · BECOME
      </text>
      <text x="2480" y="1680" fill="rgba(201,168,76,0.22)" fontFamily="Cinzel, serif" fontSize="15" letterSpacing="4">
        DIFFERENT PEOPLE · BRIGHTER POSSIBILITIES
      </text>
      <text x={MAP_WORLD.width / 2} y="2110" textAnchor="middle" fill="rgba(201,168,76,0.22)" fontFamily="Cinzel, serif" fontSize="16" letterSpacing="5">
        A CALMER SEA, A BRIGHTER YOU
      </text>
    </g>
  )
}

export function MapEasterEggs() {
  const { unlockAchievement, progress } = useExperience()
  const [star, setStar] = useState(false)

  useEffect(() => {
    if (progress.unlockedAchievementIds.includes('wish-star')) return
    const id = window.setInterval(() => setStar((current) => !current), 16000)
    return () => window.clearInterval(id)
  }, [progress.unlockedAchievementIds])

  const egg = (id: string, label: string, x: number, y: number, drawing: ReactNode) =>
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
      {egg('ancient-artifact', 'A half-buried amphora', 640, 1120, <path d="M0 12 L -6 0 L 0 -14 L 6 0 Z" fill="#8b6914" />)}
      {egg('poseidon-trident', "Poseidon's trident", 2320, 480, <path d="M0 16 L 0 -12 M -8 -4 L 0 -12 L 8 -4" stroke="#2a6a78" strokeWidth="2" fill="none" />)}
      {egg('lost-treasure', 'A lost treasure chest', 1480, 1900, <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#8b5a32" stroke="#c9a84c" />)}
      {star && !progress.unlockedAchievementIds.includes('wish-star') ? (
        <g
          className="map-egg map-star"
          tabIndex={0}
          role="button"
          aria-label="A rare shooting star"
          transform="translate(2100 220)"
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

export function KrakenTentacle({ unlocked }: { unlocked: boolean }) {
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
    gsap.fromTo(arm.current, { y: 40, rotate: -8, opacity: 0 }, { y: 0, rotate: 6, opacity: 1, duration: 1.4, yoyo: true, repeat: 1, ease: 'sine.inOut' })
  }, [reducedMotion, visible])

  if (unlocked || !visible) return null

  return (
    <g
      ref={arm}
      className="kraken"
      tabIndex={0}
      role="button"
      aria-label="A strange tentacle rising from the painted sea. Investigate."
      transform="translate(1500 2020)"
      onClick={() => unlockAchievement('kraken-encounter')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          unlockAchievement('kraken-encounter')
        }
      }}
    >
      <path className="kraken-arm" d="M10 70 C 0 40 18 28 8 8 C 2 -6 24 -8 28 8 C 32 28 16 40 26 70" fill="#4a2c3a" stroke="#2a1818" strokeWidth="1.5" />
      <circle cx="8" cy="16" r="3" fill="#8b1e24" />
      <circle cx="14" cy="30" r="2.4" fill="#8b1e24" />
      <circle cx="10" cy="44" r="2.2" fill="#8b1e24" />
    </g>
  )
}

export function ForbiddenReveal({ onDone }: { onDone: () => void }) {
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
