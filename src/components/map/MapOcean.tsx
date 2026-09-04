import { textures } from '../../assets/textures'
import { MAP_WORLD } from '../../data/mapWorld'

export function MapOcean({ complete }: { complete?: boolean }) {
  return (
    <div className="map-ocean" aria-hidden="true">
      <div className="map-ocean-depth" />
      <div className="map-ocean-shelf" />
      <div className="map-ocean-shimmer" />
      <div className="map-ocean-glint" />
      <div className="map-ocean-currents" />
      <div className="map-ocean-sun" />
      <div className="map-ocean-paper" style={{ backgroundImage: `url(${textures.paper})` }} />
      <svg className="map-ocean-marks" viewBox={`0 0 ${MAP_WORLD.width} ${MAP_WORLD.height}`} preserveAspectRatio="none">
        <g className="map-rhumb" opacity="0.11" stroke="#c9a84c" fill="none" strokeWidth="0.8">
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2
            return (
              <line
                key={i}
                x1="1680"
                y1="1100"
                x2={1680 + Math.cos(a) * 1900}
                y2={1100 + Math.sin(a) * 1200}
              />
            )
          })}
          <circle cx="1680" cy="1100" r="220" />
          <circle cx="1680" cy="1100" r="480" />
        </g>
        <path d="M 180 420 C 520 360 860 480 1240 400 C 1680 310 2140 390 2580 320" fill="none" stroke="rgba(232,212,176,0.12)" strokeWidth="1.1" />
        <path d="M 260 980 C 720 900 1180 1040 1680 940 C 2140 850 2680 930 3180 840" fill="none" stroke="rgba(126,200,184,0.1)" strokeWidth="1.2" />
        <path d="M 140 1680 C 640 1600 1100 1720 1620 1610 C 2140 1500 2700 1610 3280 1520" fill="none" stroke="rgba(232,212,176,0.08)" strokeWidth="1" />
        <g fill="none" stroke="rgba(236,232,220,0.16)" strokeWidth="1.3">
          <path d="M400 200 Q 440 188 480 204" />
          <path d="M2100 1880 Q 2140 1868 2180 1884" />
          <path d="M980 540 Q 1016 528 1052 544" />
          <path d="M2460 380 Q 2496 368 2532 384" />
          <path d="M720 880 Q 756 868 792 884" />
        </g>
        <g className="map-shoals" fill="rgba(94,196,176,0.08)" stroke="rgba(232,213,176,0.12)" strokeWidth="1">
          <ellipse cx="680" cy="640" rx="46" ry="18" />
          <ellipse cx="1980" cy="1680" rx="38" ry="14" />
          <ellipse cx="2480" cy="480" rx="32" ry="12" />
        </g>
        {complete ? (
          <g className="map-stars" fill="#f0d48a">
            <circle cx="420" cy="180" r="1.2" />
            <circle cx="780" cy="120" r="1" />
            <circle cx="1320" cy="90" r="1.3" />
            <circle cx="1860" cy="140" r="1" />
            <circle cx="2300" cy="80" r="1.2" />
            <circle cx="2740" cy="160" r="1" />
            <circle cx="3180" cy="110" r="1.4" />
            <circle cx="3460" cy="220" r="1" />
          </g>
        ) : null}
      </svg>
    </div>
  )
}
