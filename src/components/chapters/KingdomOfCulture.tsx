import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/culture/kingdom-of-culture.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const VOICES = ['belonging', 'communication', 'connection', 'collaboration'] as const

export function KingdomOfCulture({
  reduced,
  hidden,
  quality,
  leaving,
  voices,
  complete,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  voices: string[]
  complete: boolean
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 3}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'flare' | 'walk' | 'banner' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'flare', 'walk', 'banner'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), next === 'flare' ? 900 : 2400)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  const voiceClass = VOICES.filter((id) => voices.includes(id))
    .map((id) => `is-${id}`)
    .join(' ')

  return (
    <div
      className={`culture ${leaving ? 'is-leaving' : ''} ${complete ? 'is-lit' : ''} ${voiceClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}
      aria-hidden="true"
    >
      <div className="culture-camera">
        <img className="culture-plate" src={plate} alt="" draggable={false} />
        <div className="culture-sun" style={overlayShift} />
        <div className="culture-ray ray-a" />
        <div className="culture-ray ray-b" />
        <div className="culture-cloud culture-cloud-a" style={overlayShift} />
        {!mobileLite ? <div className="culture-cloud culture-cloud-b" /> : null}
        <div className="culture-shimmer" />
        <div className="culture-reflect reflect-a" />
        <div className="culture-reflect reflect-b" />
        <span className="culture-banner banner-civic" />
        <span className="culture-banner banner-market" />
        {!mobileLite ? <span className="culture-banner banner-far" /> : null}
        <span className="culture-frond frond-a" />
        {!mobileLite ? <span className="culture-frond frond-b" /> : null}
        <span className="culture-lamp lamp-a" />
        <span className="culture-lamp lamp-b" />
        <span className="culture-lamp lamp-c" />
        <span className="culture-lamp lamp-d" />
        <span className="culture-lamp lamp-e" />
        <span className="culture-lamp lamp-f" />
        <span className="culture-lamp lamp-g" />
        {!mobileLite ? <span className="culture-lamp lamp-h" /> : null}
        {lively ? (
          <>
            <span className="culture-npc npc-quay" />
            <span className="culture-npc npc-plaza" />
            {!mobileLite ? <span className="culture-npc npc-stairs" /> : null}
            {!mobileLite ? <span className="culture-npc npc-pair" /> : null}
            <span className="culture-mote mote-a" />
            <span className="culture-mote mote-b" />
            {!mobileLite ? <span className="culture-mote mote-c" /> : null}
            <span className="culture-bird" />
          </>
        ) : null}
        <div className="culture-belong" />
        <div className="culture-speak" />
        <div className="culture-link" />
        <div className="culture-join join-a" />
        <div className="culture-join join-b" />
        <div className="culture-join join-c" />
        <div className="culture-wash" />
        <div className="culture-vignette" style={overlayShift} />
        <div className="culture-dim" />
        <div className="culture-exit-mist" />
      </div>
    </div>
  )
}
