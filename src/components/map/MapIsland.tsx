import type { Destination } from '../../types'
import type { DestStatusId } from '../../types'
import { ISLAND_META } from '../../data/mapWorld'
import { IslandWaterBase } from './IslandWaterBase'

const SHAPES: Record<string, string> = {
  harbor: 'M22 86 C 18 62 34 40 58 34 C 84 28 108 40 122 52 C 142 68 154 86 138 94 C 110 104 70 108 40 100 C 28 96 24 90 22 86 Z',
  fortress: 'M30 90 C 26 60 44 28 78 22 C 108 18 136 36 146 60 C 154 80 148 98 124 104 C 90 112 48 108 30 90 Z',
  city: 'M18 88 C 28 54 56 26 96 24 C 130 22 156 48 162 74 C 166 92 148 104 118 108 C 78 114 32 106 18 88 Z',
  cove: 'M26 78 C 36 48 70 30 108 36 C 136 40 152 64 144 82 C 132 100 90 110 54 100 C 34 94 22 86 26 78 Z',
  temple: 'M34 96 C 40 50 70 16 110 18 C 146 20 164 58 154 86 C 146 106 112 116 76 114 C 50 112 32 106 34 96 Z',
  deck: 'M20 82 C 32 54 68 38 112 42 C 142 46 160 70 148 86 C 128 104 78 110 40 100 C 26 96 16 90 20 82 Z',
  feast: 'M24 84 C 40 46 82 28 124 36 C 152 42 166 72 150 90 C 128 108 76 112 38 100 C 26 96 20 90 24 84 Z',
  trials: 'M28 94 C 22 58 48 20 92 18 C 128 16 162 46 166 78 C 168 100 138 114 96 116 C 58 118 32 108 28 94 Z',
  cove2: 'M28 80 C 46 48 86 34 124 46 C 148 54 156 80 136 92 C 104 108 56 104 32 90 C 24 86 24 82 28 80 Z',
  oracle: 'M32 86 C 40 44 82 20 126 28 C 154 34 168 70 150 90 C 126 112 74 114 42 100 C 30 94 28 90 32 86 Z',
  port: 'M16 80 C 36 48 88 30 136 40 C 160 46 170 76 148 90 C 116 108 60 108 28 94 C 18 90 12 84 16 80 Z',
  ithaca: 'M24 98 C 30 52 74 18 122 20 C 158 22 178 62 168 90 C 158 112 118 122 76 120 C 42 118 22 108 24 98 Z',
  forbidden: 'M30 88 C 36 50 74 26 116 32 C 146 36 162 70 148 90 C 128 110 78 114 42 102 C 30 96 28 92 30 88 Z',
}

export function MapIsland({
  dest,
  status,
  image,
  highlighted,
  lockedText,
  showLabel,
  anomaly,
  onSelect,
}: {
  dest: Destination
  status: DestStatusId
  image?: string
  highlighted: boolean
  lockedText?: string
  showLabel: boolean
  anomaly?: boolean
  onSelect: (id: string) => void
}) {
  const meta = ISLAND_META[dest.id]
  if (!meta) return null
  const shape = SHAPES[dest.visualType] ?? SHAPES.harbor

  return (
    <button
      type="button"
      className={`map-island is-${status} ${highlighted ? 'is-highlight' : ''} ${image ? 'has-art' : 'is-placeholder'} ${showLabel ? 'is-labeled' : ''} ${dest.id === 'readiness' ? 'is-readiness' : ''} ${dest.id === 'culture' ? 'is-culture' : ''} ${dest.id === 'harbor-1' ? 'is-harbor-1' : ''} ${dest.id === 'strengths' ? 'is-strengths' : ''} ${dest.id === 'quartermaster' ? 'is-quartermaster' : ''} ${dest.id === 'feast' ? 'is-feast' : ''} ${dest.id === 'trials' ? 'is-trials' : ''} ${dest.id === 'harbor-2' ? 'is-harbor-2' : ''} ${dest.id === 'oracle' ? 'is-oracle' : ''} ${dest.id === 'opportunity' ? 'is-opportunity' : ''} ${dest.id === 'ithaca' ? 'is-ithaca' : ''} ${anomaly ? 'is-anomaly' : ''}`}
      style={{
        left: meta.x,
        top: meta.y,
        width: meta.width,
        height: meta.height,
      }}
      aria-label={`${dest.mythicTitle}. ${status}. ${dest.actualTitle}. ${dest.timeRange}`}
      onClick={() => onSelect(dest.id)}
    >
      <IslandWaterBase />
      {image ? (
        <img className="map-island-art" src={image} alt="" draggable={false} />
      ) : (
        <svg className="map-island-placeholder" viewBox="0 0 180 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d={shape} className="island-placeholder-fill" />
          <path d={shape} className="island-placeholder-coast" />
        </svg>
      )}
      {dest.id === 'readiness' ? <span className="map-island-beacon" aria-hidden="true" /> : null}
      {dest.id === 'culture' ? (
        <>
          <span className="culture-fall" aria-hidden="true" />
          <span className="culture-window win-a" aria-hidden="true" />
          <span className="culture-window win-b" aria-hidden="true" />
          <span className="culture-window win-c" aria-hidden="true" />
          <span className="culture-harbor" aria-hidden="true" />
        </>
      ) : null}
      {dest.id === 'harbor-1' ? (
        <>
          <span className="harbor1-fall" aria-hidden="true" />
          <span className="harbor1-lantern lamp-a" aria-hidden="true" />
          <span className="harbor1-lantern lamp-b" aria-hidden="true" />
          <span className="harbor1-lantern lamp-c" aria-hidden="true" />
          <span className="harbor1-dock" aria-hidden="true" />
        </>
      ) : null}
      {dest.id === 'strengths' ? (
        <>
          <span className="temple-fall" aria-hidden="true" />
          <span className="temple-mist" aria-hidden="true" />
          <span className="temple-entrance" aria-hidden="true" />
          <span className="temple-torch torch-a" aria-hidden="true" />
          <span className="temple-torch torch-b" aria-hidden="true" />
          <span className="temple-dock" aria-hidden="true" />
          {status === 'completed' ? <span className="temple-compass" aria-hidden="true" /> : null}
        </>
      ) : null}
      {dest.id === 'quartermaster' ? (
        <>
          <span className="deck-fall" aria-hidden="true" />
          <span className="deck-glow" aria-hidden="true" />
          <span className="deck-lantern lamp-a" aria-hidden="true" />
          <span className="deck-lantern lamp-b" aria-hidden="true" />
          <span className="deck-lantern lamp-c" aria-hidden="true" />
          <span className="deck-crane" aria-hidden="true" />
          <span className="deck-ripple" aria-hidden="true" />
          {status === 'completed' ? <span className="deck-crate" aria-hidden="true" /> : null}
        </>
      ) : null}
      {dest.id === 'feast' ? (
        <>
          <span className="feast-fall" aria-hidden="true" />
          <span className="feast-fire" aria-hidden="true" />
          <span className="feast-lights" aria-hidden="true" />
          <span className="feast-lantern lamp-a" aria-hidden="true" />
          <span className="feast-lantern lamp-b" aria-hidden="true" />
          <span className="feast-ripple" aria-hidden="true" />
          {status === 'completed' ? <span className="feast-olive" aria-hidden="true" /> : null}
        </>
      ) : null}
      {dest.id === 'trials' ? (
        <>
          <span className="trials-fall" aria-hidden="true" />
          <span className="trials-mist" aria-hidden="true" />
          <span className="trials-peak" aria-hidden="true" />
          <span className="trials-torch torch-a" aria-hidden="true" />
          <span className="trials-torch torch-b" aria-hidden="true" />
          <span className="trials-bridge" aria-hidden="true" />
          <span className="trials-ripple" aria-hidden="true" />
          {status === 'completed' ? <span className="trials-emblem" aria-hidden="true" /> : null}
        </>
      ) : null}
      {dest.id === 'harbor-2' ? (
        <>
          <span className="harbor2-fall" aria-hidden="true" />
          <span className="harbor2-lantern lamp-a" aria-hidden="true" />
          <span className="harbor2-lantern lamp-b" aria-hidden="true" />
          <span className="harbor2-lantern lamp-c" aria-hidden="true" />
          <span className="harbor2-tower" aria-hidden="true" />
          <span className="harbor2-fire" aria-hidden="true" />
          <span className="harbor2-dock" aria-hidden="true" />
          <span className="harbor2-anomaly" aria-hidden="true" />
        </>
      ) : null}
      {dest.id === 'oracle' ? (
        <>
          <span className="oracle-orb" aria-hidden="true" />
          <span className="oracle-beam" aria-hidden="true" />
          <span className="oracle-ring" aria-hidden="true" />
          <span className="oracle-fall" aria-hidden="true" />
          <span className="oracle-rock" aria-hidden="true" />
          <span className="oracle-lantern lamp-a" aria-hidden="true" />
          <span className="oracle-lantern lamp-b" aria-hidden="true" />
          <span className="oracle-lantern lamp-c" aria-hidden="true" />
          <span className="oracle-ripple" aria-hidden="true" />
          {status === 'completed' ? (
            <>
              <span className="oracle-node node-a" aria-hidden="true" />
              <span className="oracle-node node-b" aria-hidden="true" />
              <span className="oracle-node node-c" aria-hidden="true" />
            </>
          ) : null}
        </>
      ) : null}
      {dest.id === 'opportunity' ? (
        <>
          <span className="opp-citadel" aria-hidden="true" />
          <span className="opp-lighthouse" aria-hidden="true" />
          <span className="opp-beam" aria-hidden="true" />
          <span className="opp-scope" aria-hidden="true" />
          <span className="opp-fall" aria-hidden="true" />
          <span className="opp-lantern lamp-a" aria-hidden="true" />
          <span className="opp-lantern lamp-b" aria-hidden="true" />
          <span className="opp-lantern lamp-c" aria-hidden="true" />
          <span className="opp-ripple" aria-hidden="true" />
          {status === 'completed' ? <span className="opp-compass" aria-hidden="true" /> : null}
        </>
      ) : null}
      {dest.id === 'ithaca' ? (
        <>
          <span className="ith-temple" aria-hidden="true" />
          <span className="ith-fall" aria-hidden="true" />
          <span className="ith-lantern lamp-a" aria-hidden="true" />
          <span className="ith-lantern lamp-b" aria-hidden="true" />
          <span className="ith-lantern lamp-c" aria-hidden="true" />
          <span className="ith-ripple" aria-hidden="true" />
          <span className="ith-harbor" aria-hidden="true" />
          {status === 'completed' ? <span className="ith-star" aria-hidden="true" /> : null}
        </>
      ) : null}
      {status === 'completed' && dest.id !== 'strengths' && dest.id !== 'quartermaster' && dest.id !== 'feast' && dest.id !== 'trials' && dest.id !== 'oracle' && dest.id !== 'opportunity' && dest.id !== 'ithaca' ? <span className="map-island-star" aria-hidden="true" /> : null}
      <span className="map-island-light" aria-hidden="true" />
      <span className="map-island-label" style={{ transform: `translate(-50%, ${meta.labelOffset.y}px)` }}>
        {lockedText ? (
          <em>{lockedText}</em>
        ) : (
          <>
            {dest.id === 'harbor-1' || dest.id === 'quartermaster' || dest.id === 'feast' || dest.id === 'harbor-2' ? <small>Waystation</small> : dest.id === 'ithaca' ? <small>Final Destination</small> : dest.chapter ? <small>{dest.chapter === 'Prologue' ? 'Prologue' : `Chapter ${dest.chapter}`}</small> : null}
            <strong>{dest.mythicTitle}</strong>
          </>
        )}
      </span>
    </button>
  )
}
