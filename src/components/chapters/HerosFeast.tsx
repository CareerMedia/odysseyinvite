import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/feast/heros-feast.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function HerosFeast({
  reduced,
  hidden,
  quality,
  leaving,
  foundOlive,
  onOlive,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  foundOlive: boolean
  onOlive?: () => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'glint' | 'flare' | 'breeze' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'glint', 'flare', 'breeze'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), 2200)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  return (
    <div className={`feast ${leaving ? 'is-leaving' : ''} ${foundOlive ? 'is-olive' : ''} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="feast-camera" aria-hidden="true">
        <img className="feast-plate" src={plate} alt="" draggable={false} />
        <div className="feast-sun" style={overlayShift} />
        <div className="feast-shimmer" />
        <span className="feast-bulb bulb-a" />
        <span className="feast-bulb bulb-b" />
        <span className="feast-bulb bulb-c" />
        <span className="feast-bulb bulb-d" />
        <span className="feast-bulb bulb-e" />
        {!mobileLite ? <span className="feast-bulb bulb-f" /> : null}
        <span className="feast-lamp lamp-a" />
        <span className="feast-lamp lamp-b" />
        <span className="feast-lamp lamp-c" />
        <span className="feast-lamp lamp-d" />
        {!mobileLite ? <span className="feast-cloth" /> : null}
        {!mobileLite ? <span className="feast-bloom" /> : null}
        <span className="feast-steam steam-a" />
        {!mobileLite ? <span className="feast-steam steam-b" /> : null}
        <span className="feast-glint glint-a" />
        <span className="feast-glint glint-b" />
        {lively ? <span className="feast-bird" /> : null}
        <div className="feast-vignette" style={overlayShift} />
        <div className="feast-dim" />
        <div className="feast-exit-mist" />
      </div>
      {onOlive ? (
        <button
          className={`feast-olive ${foundOlive ? 'is-found' : ''}`}
          type="button"
          aria-label="A curious olive. Optional easter egg."
          onClick={onOlive}
        />
      ) : null}
    </div>
  )
}
