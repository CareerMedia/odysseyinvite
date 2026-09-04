import type { CSSProperties } from 'react'
import plate from '../../assets/environments/safe-harbor-1/safe-harbor-1.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function SafeHarborI({
  reduced,
  hidden,
  quality,
  leaving,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const lively = quality !== 'low' && !reduced

  return (
    <div className={`harbor1-scene ${leaving ? 'is-leaving' : ''} ${reduced ? 'is-still' : ''} ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <div className="harbor1-camera">
        <img className="harbor1-plate" src={plate} alt="" draggable={false} />
        <div className="harbor1-sun" style={overlayShift} />
        <div className="harbor1-waves" />
        <span className="harbor1-lamp is-a" />
        <span className="harbor1-lamp is-b" />
        <span className="harbor1-lamp is-c" />
        <span className="harbor1-lamp is-d" />
        <span className="harbor1-fire" />
        {lively ? <span className="harbor1-bird" /> : null}
        <div className="harbor1-vignette" style={overlayShift} />
        <div className="harbor1-dim" />
        <div className="harbor1-exit-mist" />
      </div>
    </div>
  )
}
