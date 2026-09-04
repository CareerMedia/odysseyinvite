import { MAP_WORLD } from '../../data/mapWorld'

type Bank = {
  id: string
  speed: 'far' | 'near'
  unlock?: string
  d: string
}

const BANKS: Bank[] = [
  {
    id: 'edge-west',
    speed: 'far',
    d: 'M-40 40 C 80 10 160 70 240 40 C 320 8 380 90 300 150 C 210 210 40 180 -20 130 Z',
  },
  {
    id: 'north-mid',
    speed: 'far',
    unlock: 'strengths',
    d: 'M1680 40 C 1860 -20 2080 70 2240 20 C 2420 -30 2580 90 2460 170 C 2280 250 1900 220 1720 160 C 1600 120 1560 80 1680 40 Z',
  },
  {
    id: 'east-high',
    speed: 'far',
    unlock: 'opportunity',
    d: 'M2860 80 C 3040 10 3260 90 3440 40 C 3620 -10 3680 140 3520 210 C 3320 290 3000 250 2840 180 C 2740 140 2740 110 2860 80 Z',
  },
  {
    id: 'ithaca-haze',
    speed: 'near',
    unlock: 'ithaca',
    d: 'M3000 220 C 3140 160 3320 240 3480 180 C 3600 130 3660 260 3500 320 C 3320 390 3080 350 2960 290 C 2880 250 2900 240 3000 220 Z',
  },
  {
    id: 'trials-bank',
    speed: 'near',
    unlock: 'trials',
    d: 'M2380 980 C 2520 900 2740 980 2880 920 C 3020 860 3080 1020 2920 1100 C 2720 1200 2480 1160 2340 1080 C 2260 1040 2280 1010 2380 980 Z',
  },
  {
    id: 'south-bank',
    speed: 'near',
    unlock: 'harbor-2',
    d: 'M2280 1680 C 2460 1600 2700 1700 2920 1640 C 3100 1590 3180 1760 2980 1840 C 2740 1940 2400 1900 2220 1800 C 2120 1740 2160 1710 2280 1680 Z',
  },
  {
    id: 'south-edge',
    speed: 'far',
    d: 'M80 1980 C 260 1920 520 2040 780 1960 C 980 1900 1040 2100 820 2160 C 520 2240 160 2180 20 2080 C -40 2040 0 2000 80 1980 Z',
  },
]

export function MapClouds({
  clearedIds,
}: {
  clearedIds: string[]
}) {
  const open = new Set(clearedIds)
  return (
    <div className="map-clouds" aria-hidden="true">
      <svg className="map-fog-art" viewBox={`0 0 ${MAP_WORLD.width} ${MAP_WORLD.height}`} width={MAP_WORLD.width} height={MAP_WORLD.height}>
        {BANKS.map((bank) => (
          <path
            key={bank.id}
            className={`map-fog-shape is-${bank.speed} ${bank.unlock && open.has(bank.unlock) ? 'is-parted' : ''}`}
            d={bank.d}
          />
        ))}
      </svg>
    </div>
  )
}
