import type { RefObject } from 'react'

export function MapShip({ shipRef }: { shipRef: RefObject<SVGGElement | null> }) {
  return (
    <g ref={shipRef} className="map-ship">
      <g className="map-ship-body">
        <g className="map-ship-wake">
          <ellipse cx="-16" cy="11" rx="20" ry="5" fill="rgba(230,240,245,0.18)" />
          <path d="M-28 11 C -20 8 -12 14 -6 11" fill="none" stroke="rgba(230,240,245,0.28)" strokeWidth="1.1" />
        </g>
        <g className="map-ship-hull">
          <path d="M-18 5 C -4 -2 10 -2 20 5 C 10 12 -8 12 -18 5 Z" fill="#6a4022" />
          <path d="M-18 5 C -4 -2 10 -2 20 5 C 10 12 -8 12 -18 5 Z" fill="url(#mapWood)" opacity="0.42" />
        </g>
        <path className="map-ship-mast" d="M1 -18 L 1 5" stroke="#3a2416" strokeWidth="1.7" />
        <path className="map-ship-sail" d="M1 -16 L 15 -8 L 1 -3 Z" fill="#efe4c8" />
      </g>
    </g>
  )
}
