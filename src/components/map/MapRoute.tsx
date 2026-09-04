import type { RefObject } from 'react'
import { VOYAGE_PATH } from '../../data/mapWorld'

export function MapRoute({
  pathRef,
  complete,
  reveal,
  finalLeg,
}: {
  pathRef: RefObject<SVGPathElement | null>
  complete: boolean
  reveal: number
  finalLeg?: boolean
}) {
  return (
    <g className="map-route" pointerEvents="none">
      <path
        d={VOYAGE_PATH}
        className="map-route-future"
        fill="none"
        stroke={complete ? 'rgba(201,168,76,0.3)' : 'rgba(90,61,22,0.18)'}
        strokeWidth="1.8"
        strokeDasharray="1.5 13"
        strokeLinecap="round"
      />
      <path
        ref={pathRef}
        d={VOYAGE_PATH}
        className={`map-route-live ${finalLeg ? 'is-final-leg' : ''}`}
        fill="none"
        stroke={complete ? '#c9a84c' : '#d4b25a'}
        strokeWidth="2.1"
        strokeDasharray="3 10"
        strokeLinecap="round"
        pathLength={1}
        strokeDashoffset={1 - reveal}
      />
    </g>
  )
}
