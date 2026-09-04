# Map island artwork

Official destination islands sit on the draggable ocean chart as transparent images.

## Replacement rule

`MapIsland` already accepts an imported image. To add the next official island, import the file and register it in `ISLAND_ART` inside `src/components/VoyageMap.tsx`. Do not change destination IDs, click handling, or camera logic.

## Recommended source canvas

- **1024 × 1024** transparent PNG or WebP
- Island centered, with padding around the coastline
- No baked labels, buttons, or UI
- Keep the alpha channel. Do not flatten onto black, white, or navy

## Display size on the chart

World pixels at default zoom (the camera handles readability on smaller screens):

| Destination | Suggested width |
| --- | --- |
| Major islands | 160–180 |
| Gathering of the Crew | 220 (official art) |
| Isle of Readiness | 210 (official art, tall lighthouse) |
| Kingdom of Culture | 240 (official art, wider city) |
| Safe Harbor I | 188 (official art, smaller waystation) |
| Temple of Strengths | 252 (official art, slightly more monumental) |
| Quartermaster’s Deck | 198 (official art, compact waystation) |
| Hero’s Feast | 192 (official art, compact waystation) |
| Trials of the Crew | 246 (official art, challenge-course chapter) |
| Safe Harbor II | 190 (official art, compact waystation) |
| Oracle of AI | 248 (official art, distinctive cyan observatory — still map-scale) |
| Sea of Opportunity | 256 (official art, slightly broader citadel — last major stop before Ithaca) |
| Ithaca | 272 (official art, slightly more prominent final destination) |
| Waystations | 120–150 |

Placeholders on the chart are temporary coastline silhouettes. They are not final island art.

## Route anchors

`routeAnchor` is relative to the island box, not the viewport. Harbor / dock destinations should terminate in the water just in front of the pier.

Gathering of the Crew uses `{ x: 0.52, y: 0.82 }`.

Isle of Readiness uses `{ x: 0.32, y: 0.84 }` so the ship arrives at the dock, not the lighthouse tower.

Kingdom of Culture uses `{ x: 0.52, y: 0.86 }` so the ship arrives at the front harbor.

Safe Harbor I uses `{ x: 0.64, y: 0.96 }` so the ship arrives in open water at the right-front dock, clear of the painted sailboat.

Temple of Strengths uses `{ x: 0.58, y: 0.94 }` so the ship arrives in the water left of the painted sailboat, at the front of the dock rather than the temple roof.

Quartermaster’s Deck uses `{ x: 0.54, y: 0.92 }` so the ship arrives in open water at the front dock, clear of the painted caravel on the left.

Hero’s Feast uses `{ x: 0.50, y: 0.93 }` so the ship arrives offshore at the front dock, clear of the painted sailboat.

Trials of the Crew uses `{ x: 0.40, y: 0.92 }` so the ship arrives in open water at the lower-left dock, clear of the painted sailboat.

Safe Harbor II uses `{ x: 0.50, y: 0.92 }` so the ship arrives offshore at the front dock, clear of the painted sailboat and rowboat.

Oracle of AI uses `{ x: 0.32, y: 0.90 }` so the ship arrives in open water at the lower-left dock, clear of the painted sailboat.

Sea of Opportunity uses `{ x: 0.34, y: 0.91 }` so the ship arrives in open water at the lower-left dock, clear of the painted sailboat.

Ithaca uses `{ x: 0.30, y: 0.91 }` so the ship arrives in open water at the lower-left harbor, clear of the painted sailboat.
