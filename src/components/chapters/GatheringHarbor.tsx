import type { CSSProperties } from 'react'
import harborPlate from '../../assets/environments/gathering/gathering-harbor.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function GatheringHarbor({
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
  const shiftX = pointer.x * 4
  const shiftY = pointer.y * 3
  const overlayShift = {
    '--gx': `${shiftX}px`,
    '--gy': `${shiftY}px`,
  } as CSSProperties

  return (
    <div className={`gathering ${leaving ? 'is-leaving' : ''} ${reduced ? 'is-still' : ''} ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <div className="gathering-camera">
        <img
          className="gathering-plate"
          src={harborPlate}
          alt=""
          draggable={false}
        />
        <div className="gathering-sun" style={overlayShift} />
        <div className="gathering-path" style={overlayShift} />
        <div className="gathering-shimmer" />
        <div className="gathering-mist" style={overlayShift} />
        <span className="gathering-lantern lantern-a" />
        <span className="gathering-lantern lantern-b" />
        <span className="gathering-lantern lantern-c" />
        <span className="gathering-lantern lantern-d" />
        <span className="gathering-lantern lantern-e" />
        {quality !== 'low' && !reduced ? (
          <>
            <span className="gathering-bird bird-a" />
            <span className="gathering-bird bird-b" />
            <span className="gathering-mote mote-a" />
            <span className="gathering-mote mote-b" />
            <span className="gathering-mote mote-c" />
          </>
        ) : null}
        <div className="gathering-vignette" style={overlayShift} />
        <div className="gathering-dim" />
        <div className="gathering-exit-mist" />
      </div>
    </div>
  )
}
