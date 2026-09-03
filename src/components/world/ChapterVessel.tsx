import type { OceanIntensity, VisualType } from '../../types'

export function ChapterVessel({
  type,
  ocean,
  reduced,
}: {
  type: VisualType
  ocean: OceanIntensity
  reduced: boolean
}) {
  if (type === 'deck') return null
  const docked = type === 'harbor' || type === 'cove' || type === 'ithaca'
  return (
    <div
      className={`chapter-vessel is-${ocean} ${docked ? 'is-docked' : 'is-offshore'} ${reduced ? 'is-still' : ''}`}
      aria-hidden="true"
    >
      <span className="vessel-hull" />
      <span className="vessel-sail" />
    </div>
  )
}
