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
  art?: 'gathering'
}

export const ISLAND_META: Record<string, IslandMeta> = {
  prologue: {
    x: 540,
    y: 1760,
    width: 220,
    height: 147,
    routeAnchor: { x: 0.52, y: 0.82 },
    labelOffset: { x: 0, y: 92 },
    art: 'gathering',
  },
  readiness: {
    x: 1040,
    y: 1360,
    width: 158,
    height: 118,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 78 },
  },
  culture: {
    x: 1520,
    y: 1080,
    width: 168,
    height: 128,
    routeAnchor: { x: 0.48, y: 0.78 },
    labelOffset: { x: 0, y: 84 },
  },
  'harbor-1': {
    x: 820,
    y: 1600,
    width: 128,
    height: 98,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 70 },
  },
  strengths: {
    x: 1880,
    y: 760,
    width: 168,
    height: 128,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 84 },
  },
  quartermaster: {
    x: 2140,
    y: 1240,
    width: 150,
    height: 112,
    routeAnchor: { x: 0.5, y: 0.82 },
    labelOffset: { x: 0, y: 76 },
  },
  feast: {
    x: 2380,
    y: 660,
    width: 150,
    height: 112,
    routeAnchor: { x: 0.5, y: 0.78 },
    labelOffset: { x: 0, y: 76 },
  },
  trials: {
    x: 2600,
    y: 1120,
    width: 168,
    height: 128,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 84 },
  },
  'harbor-2': {
    x: 2760,
    y: 1540,
    width: 128,
    height: 98,
    routeAnchor: { x: 0.5, y: 0.8 },
    labelOffset: { x: 0, y: 70 },
  },
  oracle: {
    x: 2920,
    y: 900,
    width: 160,
    height: 120,
    routeAnchor: { x: 0.5, y: 0.76 },
    labelOffset: { x: 0, y: 80 },
  },
  opportunity: {
    x: 3060,
    y: 620,
    width: 168,
    height: 120,
    routeAnchor: { x: 0.5, y: 0.78 },
    labelOffset: { x: 0, y: 80 },
  },
  ithaca: {
    x: 3140,
    y: 340,
    width: 188,
    height: 138,
    routeAnchor: { x: 0.46, y: 0.8 },
    labelOffset: { x: 0, y: 88 },
  },
  forbidden: {
    x: 1640,
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
  ],
}
