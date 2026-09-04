export const MAP_WORLD = { width: 3600, height: 2200 }

export const MAP_ZOOM = { min: 0.8, max: 1.35, default: 1 }

export const MAP_SAFE = { left: 210, right: 260, top: 150, bottom: 200 }

export const JOURNEY_LAYOUT_IDS = [
  'prologue',
  'readiness',
  'culture',
  'harbor-1',
  'strengths',
  'quartermaster',
  'feast',
  'trials',
  'harbor-2',
  'oracle',
  'opportunity',
  'ithaca',
] as const

export type IslandMeta = {
  x: number
  y: number
  width: number
  height: number
  routeAnchor: { x: number; y: number }
  labelOffset: { x: number; y: number }
  art?: 'gathering' | 'readiness' | 'culture' | 'harbor-1' | 'strengths' | 'quartermaster' | 'feast' | 'trials' | 'harbor-2' | 'oracle' | 'opportunity' | 'ithaca'
}

export const ISLAND_META: Record<string, IslandMeta> = {
  prologue: {
    x: 480,
    y: 1680,
    width: 220,
    height: 147,
    routeAnchor: { x: 0.52, y: 0.82 },
    labelOffset: { x: 0, y: 96 },
    art: 'gathering',
  },
  readiness: {
    x: 810,
    y: 1440,
    width: 210,
    height: 140,
    routeAnchor: { x: 0.32, y: 0.84 },
    labelOffset: { x: 0, y: 102 },
    art: 'readiness',
  },
  culture: {
    x: 1160,
    y: 1180,
    width: 240,
    height: 160,
    routeAnchor: { x: 0.52, y: 0.86 },
    labelOffset: { x: 0, y: 112 },
    art: 'culture',
  },
  'harbor-1': {
    x: 1440,
    y: 1470,
    width: 188,
    height: 125,
    routeAnchor: { x: 0.64, y: 0.96 },
    labelOffset: { x: 0, y: 86 },
    art: 'harbor-1',
  },
  strengths: {
    x: 1640,
    y: 960,
    width: 252,
    height: 168,
    routeAnchor: { x: 0.58, y: 0.94 },
    labelOffset: { x: 0, y: 118 },
    art: 'strengths',
  },
  quartermaster: {
    x: 1930,
    y: 1255,
    width: 198,
    height: 132,
    routeAnchor: { x: 0.54, y: 0.92 },
    labelOffset: { x: 0, y: 90 },
    art: 'quartermaster',
  },
  feast: {
    x: 2180,
    y: 860,
    width: 192,
    height: 128,
    routeAnchor: { x: 0.50, y: 0.93 },
    labelOffset: { x: 0, y: 88 },
    art: 'feast',
  },
  trials: {
    x: 2460,
    y: 1080,
    width: 246,
    height: 164,
    routeAnchor: { x: 0.40, y: 0.92 },
    labelOffset: { x: 0, y: 114 },
    art: 'trials',
  },
  'harbor-2': {
    x: 2710,
    y: 1370,
    width: 190,
    height: 127,
    routeAnchor: { x: 0.50, y: 0.92 },
    labelOffset: { x: 0, y: 88 },
    art: 'harbor-2',
  },
  oracle: {
    x: 2860,
    y: 980,
    width: 248,
    height: 165,
    routeAnchor: { x: 0.32, y: 0.90 },
    labelOffset: { x: 0, y: 118 },
    art: 'oracle',
  },
  opportunity: {
    x: 3040,
    y: 700,
    width: 256,
    height: 171,
    routeAnchor: { x: 0.34, y: 0.91 },
    labelOffset: { x: 0, y: 122 },
    art: 'opportunity',
  },
  ithaca: {
    x: 3220,
    y: 385,
    width: 272,
    height: 181,
    routeAnchor: { x: 0.30, y: 0.91 },
    labelOffset: { x: 0, y: 128 },
    art: 'ithaca',
  },
  forbidden: {
    x: 1680,
    y: 1980,
    width: 140,
    height: 108,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 74 },
  },
}

export function islandRoutePoint(id: string) {
  const meta = ISLAND_META[id]
  const anchor = meta?.routeAnchor ?? { x: 0.5, y: 0.78 }
  return {
    x: (meta?.x ?? 0) + (anchor.x - 0.5) * (meta?.width ?? 0),
    y: (meta?.y ?? 0) + (anchor.y - 0.5) * (meta?.height ?? 0),
  }
}

function polylineT(points: { x: number; y: number }[]) {
  const lengths = [0]
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    lengths.push(lengths[i - 1] + Math.hypot(dx, dy))
  }
  const total = lengths[lengths.length - 1] || 1
  return lengths.map((value) => value / total)
}

function toBezier(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

const journeyPoints = JOURNEY_LAYOUT_IDS.map((id) => islandRoutePoint(id))
const journeyT = polylineT(journeyPoints)

export const VOYAGE_PATH = toBezier(journeyPoints)

export const ROUTE_T: Record<string, number> = Object.fromEntries(
  JOURNEY_LAYOUT_IDS.map((id, index) => [id, journeyT[index]]),
)

export function voyageOverviewPoints(currentId: string, nextId: string | null) {
  const points = [islandRoutePoint(currentId)]
  const index = JOURNEY_LAYOUT_IDS.indexOf(currentId as (typeof JOURNEY_LAYOUT_IDS)[number])
  if (index > 0) points.unshift(islandRoutePoint(JOURNEY_LAYOUT_IDS[index - 1]))
  if (nextId && nextId !== currentId) points.push(islandRoutePoint(nextId))
  if (points.length === 1 && JOURNEY_LAYOUT_IDS[1]) points.push(islandRoutePoint(JOURNEY_LAYOUT_IDS[1]))
  return points
}

export const ISLAND_ART_SPEC = {
  canvas: '1024 × 1024 transparent PNG or WebP',
  notes: [
    'Keep the island centered with padding around the coastline.',
    'Do not bake labels or UI into the artwork.',
    'Preserve alpha. Do not flatten onto a colored rectangle.',
    'Recommended map display width: 180–220 world pixels for major islands.',
    'Gathering of the Crew official art is 1024 × 682 with harbor/pier at routeAnchor 0.52, 0.82.',
    'Safe Harbor I official art is 1024 × 682 with the ship arriving at the right-front dock, routeAnchor 0.64, 0.96.',
    'Temple of Strengths official art is 1024 × 682 with the ship arriving left of the painted sailboat, routeAnchor 0.58, 0.94.',
    'Quartermaster’s Deck official art is 1024 × 682 with the ship arriving at the front dock, clear of the painted caravel, routeAnchor 0.54, 0.92.',
    'Hero’s Feast official art is 1024 × 682 with the ship arriving offshore at the front dock, clear of the painted sailboat, routeAnchor 0.50, 0.93.',
    'Trials of the Crew official art is 1024 × 682 with the ship arriving at the lower-left dock, clear of the painted sailboat, routeAnchor 0.40, 0.92.',
    'Safe Harbor II official art is 1024 × 682 with the ship arriving offshore at the front dock, clear of the painted boats, routeAnchor 0.50, 0.92.',
    'Oracle of AI official art is 1024 × 682 with the ship arriving offshore at the lower-left dock, clear of the painted sailboat, routeAnchor 0.32, 0.90.',
    'Sea of Opportunity official art is 1024 × 682 with the ship arriving offshore at the lower-left dock, clear of the painted sailboat, routeAnchor 0.34, 0.91.',
    'Ithaca official art is 1024 × 682 with the ship arriving offshore at the lower-left harbor, clear of the painted sailboat, routeAnchor 0.30, 0.91.',
  ],
}
