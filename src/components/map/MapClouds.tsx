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
    d: 'M2980 180 C 3160 110 3360 190 3540 140 C 3660 90 3720 280 3540 390 C 3360 500 3120 510 2940 400 C 2860 340 2880 220 2980 180 Z',
  },
  {
    id: 'trials-bank',
    speed: 'near',
    unlock: 'trials',
    d: 'M2280 900 C 2400 820 2580 880 2700 840 C 2820 800 2860 980 2720 1080 C 2560 1200 2360 1180 2240 1080 C 2180 1020 2200 920 2280 900 Z',
  },
  {
    id: 'strengths-haze',
    speed: 'near',
    unlock: 'strengths',
    d: 'M1460 810 C 1580 730 1740 790 1840 750 C 1940 710 1980 890 1860 970 C 1720 1070 1540 1050 1440 950 C 1380 890 1400 830 1460 810 Z',
  },
  {
    id: 'feast-haze',
    speed: 'near',
    unlock: 'feast',
    d: 'M2020 720 C 2140 640 2300 700 2400 660 C 2500 620 2540 800 2420 880 C 2280 980 2100 960 2000 860 C 1940 800 1960 740 2020 720 Z',
  },
  {
    id: 'quartermaster-haze',
    speed: 'near',
    unlock: 'quartermaster',
    d: 'M1760 1120 C 1880 1040 2040 1100 2140 1060 C 2240 1020 2280 1200 2160 1280 C 2020 1380 1840 1360 1740 1260 C 1680 1200 1700 1140 1760 1120 Z',
  },
  {
    id: 'harbor1-haze',
    speed: 'near',
    unlock: 'harbor-1',
    d: 'M1330 1390 C 1440 1330 1570 1390 1630 1370 C 1690 1350 1710 1490 1610 1550 C 1510 1620 1370 1590 1290 1510 C 1250 1470 1270 1410 1330 1390 Z',
  },
  {
    id: 'harbor2-haze',
    speed: 'near',
    unlock: 'harbor-2',
    d: 'M2540 1240 C 2660 1160 2820 1220 2920 1180 C 3020 1140 3060 1320 2940 1400 C 2800 1500 2620 1480 2520 1380 C 2460 1320 2480 1260 2540 1240 Z',
  },
  {
    id: 'oracle-haze',
    speed: 'near',
    unlock: 'oracle',
    d: 'M2720 840 C 2860 760 3040 810 3160 780 C 3260 750 3300 920 3160 1000 C 3000 1100 2800 1080 2680 980 C 2620 920 2640 860 2720 840 Z',
  },
  {
    id: 'opportunity-haze',
    speed: 'near',
    unlock: 'opportunity',
    d: 'M2900 560 C 3040 480 3220 530 3340 500 C 3440 470 3480 640 3340 720 C 3180 820 2980 800 2860 700 C 2800 640 2820 580 2900 560 Z',
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
