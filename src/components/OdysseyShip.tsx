import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import type { OceanIntensity } from '../types'

type OdysseyShipProps = {
  reduced: boolean
  departing?: boolean
  intensity?: OceanIntensity
}

const MOTION: Record<OceanIntensity, { bob: number; pitch: number; roll: number; duration: number }> = {
  calm: { bob: 4, pitch: 0.6, roll: 0.3, duration: 5.2 },
  normal: { bob: 9, pitch: 1.7, roll: 0.8, duration: 3.4 },
  active: { bob: 14, pitch: 2.8, roll: 1.3, duration: 2.8 },
  stormy: { bob: 16, pitch: 3.4, roll: 1.6, duration: 2.4 },
  magical: { bob: 7, pitch: 1.2, roll: 0.6, duration: 4.2 },
}

export function OdysseyShip({ reduced, departing = false, intensity = 'normal' }: OdysseyShipProps) {
  const root = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!root.current || reduced) return
    const motion = MOTION[departing ? 'active' : intensity]
    const ctx = gsap.context(() => {
      gsap.to('.ship-bob', { y: departing ? -18 : -motion.bob, duration: motion.duration, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.ship-pitch', { rotation: departing ? 3.6 : motion.pitch, duration: motion.duration + 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 74%' })
      gsap.to('.ship-roll', { rotation: departing ? 1.6 : motion.roll, duration: motion.duration + 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 80%' })
      gsap.to('.ship-drift', { x: departing ? 6 : 3, duration: 6.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.sail-sway', { rotation: departing ? 3.4 : 2.2, duration: 2.9, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '220px 70px' })
      gsap.to('.flag-wave', { rotation: departing ? 18 : 12, duration: 1.55, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '332px 36px' })
      gsap.to('.rope-sway', { rotation: 1.4, duration: 3.7, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.18, transformOrigin: '220px 60px' })
      gsap.to('.lantern-swing', { rotation: 6, duration: 2.3, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.25, transformOrigin: '50% 0%' })
      gsap.to('.lantern-flicker', { opacity: 0.5, duration: 0.48, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.16 })
      gsap.to('.wake-a', { x: departing ? -22 : -10, opacity: departing ? 0.34 : 0.18, duration: 2.1, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.wake-b', { x: departing ? -30 : -16, opacity: departing ? 0.22 : 0.1, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('.ship-shadow', { scaleX: departing ? 1.08 : 1, opacity: departing ? 0.28 : 0.36, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 50%' })
    }, root)
    return () => ctx.revert()
  }, [departing, intensity, reduced])

  return (
    <svg className="odyssey-ship reveal-layer reveal-ship" viewBox="0 0 420 220" aria-hidden="true">
      <g ref={root}>
        <ellipse className="ship-shadow" cx="214" cy="190" rx="122" ry="11" fill="rgba(0,0,0,0.48)" />
        <ellipse className="wake-b" cx="78" cy="178" rx="62" ry="9" fill="rgba(200,230,235,0.14)" />
        <ellipse className="wake-a" cx="112" cy="173" rx="44" ry="6" fill="rgba(220,240,245,0.22)" />

        <g className="ship-drift">
          <g className="ship-bob">
            <g className="ship-roll">
              <g className="ship-pitch">
                <g className="ship-silhouette">
                  <path d="M68 150 C 120 126 176 118 224 118 C 292 118 344 130 378 152 C 350 180 300 192 220 194 C 138 192 92 178 68 150 Z" fill="#061018" />
                  <path d="M220 46 L 220 150 L 304 146 L 224 54 Z" fill="#061018" />
                </g>

                <g className="ship-detail">
                  <path d="M70 148 C 122 127 176 120 224 120 C 294 120 346 132 376 152 C 348 178 298 190 220 192 C 140 190 94 176 70 148 Z" fill="#4a2e1a" />
                  <path d="M80 148 C 126 133 180 126 224 126 C 290 126 340 138 364 152 C 340 170 296 178 220 180 C 146 178 102 166 80 148 Z" fill="#7a4c28" />
                  <path d="M92 145 C 142 134 192 130 234 130 C 286 130 328 138 350 149" stroke="#c9a84c" strokeWidth="1.35" fill="none" opacity="0.82" />
                  <path d="M98 161 H 338" stroke="#3d2414" strokeWidth="1" opacity="0.4" />
                  <path d="M112 152 L 120 177" stroke="#3d2414" strokeWidth="2" />
                  <path d="M164 147 L 170 177" stroke="#3d2414" strokeWidth="2" />
                  <path d="M272 147 L 266 177" stroke="#3d2414" strokeWidth="2" />
                  <path d="M64 150 C 58 146 62 140 72 142" fill="#6a3d20" />
                  <rect x="190" y="116" width="48" height="24" rx="3" fill="#432616" />
                  <rect x="196" y="121" width="13" height="10" fill="#e8a54b" opacity="0.32" />
                  <rect x="216" y="121" width="13" height="10" fill="#e8a54b" opacity="0.24" />

                  <line x1="220" y1="44" x2="220" y2="150" stroke="#3a2416" strokeWidth="4.2" />
                  <g className="rope-sway">
                    <line x1="220" y1="60" x2="128" y2="148" stroke="#5c4030" strokeWidth="1.15" />
                    <line x1="220" y1="72" x2="312" y2="148" stroke="#5c4030" strokeWidth="1.15" />
                    <line x1="132" y1="148" x2="312" y2="148" stroke="#5c4030" strokeWidth="0.9" />
                  </g>

                  <g className="sail-sway">
                    <path d="M224 54 C 292 68 312 108 306 146 L 224 146 Z" fill="#efe4c8" />
                    <path d="M224 54 C 292 68 312 108 306 146 L 224 146 Z" fill="url(#sailLight)" />
                    <path d="M236 76 C 272 86 286 112 284 132" stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.5" />
                    <text x="248" y="118" fill="#8b6914" fontFamily="Cinzel, serif" fontSize="11" letterSpacing="1.6">
                      CC
                    </text>
                  </g>

                  <g className="flag-wave">
                    <line x1="332" y1="34" x2="332" y2="88" stroke="#3a2416" strokeWidth="2" />
                    <path d="M332 36 L 368 46 L 332 56 Z" fill="#d22030" />
                  </g>

                  <g className="lantern-swing" style={{ transformBox: 'fill-box', transformOrigin: '150px 128px' }}>
                    <line x1="150" y1="128" x2="150" y2="138" stroke="#3a2416" strokeWidth="1.2" />
                    <circle className="lantern-flicker" cx="150" cy="142" r="4" fill="#e8a54b" />
                    <circle cx="150" cy="142" r="10" fill="#e8a54b" opacity="0.16" />
                  </g>
                  <g className="lantern-swing" style={{ transformBox: 'fill-box', transformOrigin: '296px 128px' }}>
                    <line x1="296" y1="128" x2="296" y2="138" stroke="#3a2416" strokeWidth="1.2" />
                    <circle className="lantern-flicker" cx="296" cy="142" r="4" fill="#e8a54b" />
                    <circle cx="296" cy="142" r="10" fill="#e8a54b" opacity="0.16" />
                  </g>
                  <circle cx="220" cy="110" r="3.1" fill="#e8d48b" />
                </g>
              </g>
            </g>
          </g>
        </g>

        <defs>
          <linearGradient id="sailLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff6d8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c9a84c" stopOpacity="0.08" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  )
}
