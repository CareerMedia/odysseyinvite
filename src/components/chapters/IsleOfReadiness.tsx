import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/readiness/isle-of-readiness.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function IsleOfReadiness({
  reduced,
  hidden,
  quality,
  leaving,
  signals,
  complete,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  signals: string[]
  complete: boolean
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 4}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'spray' | 'flash' | 'rain' | null>(null)

  useEffect(() => {
    if (reduced || hidden || quality === 'low') return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'spray', 'flash', 'rain'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), next === 'flash' ? 420 : 2200)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, quality, reduced])

  return (
    <div
      className={`readiness ${leaving ? 'is-leaving' : ''} ${complete ? 'is-lit' : ''} ${signals.includes('watch') ? 'is-watch' : ''} ${signals.includes('respond') ? 'is-respond' : ''} ${signals.includes('protect') ? 'is-protect' : ''} ${event ? `is-${event}` : ''}`}
      aria-hidden="true"
    >
      <div className="ready-camera">
        <img className="ready-plate" src={plate} alt="" draggable={false} />
        <div className="ready-cloud ready-cloud-a" style={overlayShift} />
        <div className="ready-cloud ready-cloud-b" />
        <div className="ready-rain" />
        <div className="ready-flash" />
        <div className="ready-lamp" />
        <div className="ready-beam" />
        <div className="ready-mist" style={overlayShift} />
        <div className="ready-waves" />
        <span className="ready-spray spray-a" />
        <span className="ready-spray spray-b" />
        <span className="ready-spray spray-c" />
        <span className="ready-light light-a" />
        <span className="ready-light light-b" />
        <span className="ready-light light-c" />
        <span className="ready-light light-d" />
        <div className="ready-watch" />
        <div className="ready-pulse" />
        <div className="ready-shield" />
        {quality !== 'low' && !reduced ? <span className="ready-bird" /> : null}
        <div className="ready-vignette" style={overlayShift} />
        <div className="ready-dim" />
        <div className="ready-exit-mist" />
      </div>
    </div>
  )
}
