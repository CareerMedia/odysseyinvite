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
| Ithaca | 180–200 |
| Waystations | 120–150 |

Placeholders on the chart are temporary coastline silhouettes. They are not final island art.

## Route anchors

`routeAnchor` is relative to the island box, not the viewport. Harbor / dock destinations should terminate in the water just in front of the pier.

Gathering of the Crew uses `{ x: 0.52, y: 0.82 }`.
