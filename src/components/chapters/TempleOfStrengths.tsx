import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/strengths/temple-of-strengths.jpg'
import type { QualityLevel, StrengthsPath } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function TempleOfStrengths({
  reduced,
  hidden,
  quality,
  leaving,
  path,
  complete,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  path: StrengthsPath
  complete: boolean
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 3}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'flare' | 'mist' | 'banner' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'flare', 'mist', 'banner'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), next === 'flare' ? 900 : 2400)
        schedule()
      }, 15000 + Math.random() * 20000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  return (
    <div
      className={`temple ${leaving ? 'is-leaving' : ''} ${complete ? 'is-lit' : ''} ${path ? `is-${path}` : ''} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}
      aria-hidden="true"
    >
      <div className="temple-camera">
        <img className="temple-plate" src={plate} alt="" draggable={false} />
        <div className="temple-sun" style={overlayShift} />
        <div className="temple-ray ray-a" />
        <div className="temple-ray ray-b" />
        <div className="temple-cloud" style={overlayShift} />
        <div className="temple-shimmer" />
        <div className="temple-fall" />
        <div className="temple-mist" />
        <span className="temple-banner banner-a" />
        <span className="temple-banner banner-b" />
        {!mobileLite ? <span className="temple-banner banner-c" /> : null}
        <span className="temple-frond" />
        <div className="temple-columns" />
        {lively ? (
          <>
            <span className="temple-npc npc-stair" />
            {!mobileLite ? <span className="temple-npc npc-terrace" /> : null}
            <span className="temple-bird" />
          </>
        ) : null}
        <div className="temple-compass">
          <span className="compass-ring" />
          <span className="compass-core" />
          <span className="compass-spark" />
          <span className="compass-left" />
          <span className="compass-right" />
        </div>
        <div className="temple-route route-discovery" />
        <div className="temple-route route-mastery" />
        <div className="temple-vignette" style={overlayShift} />
        <div className="temple-dim" />
        <div className="temple-exit-mist" />
      </div>
    </div>
  )
}
