import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/opportunity/sea-of-opportunity.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const BRIEFING = ['terrain', 'role', 'mission'] as const

export function SeaOfOpportunity({
  reduced,
  hidden,
  quality,
  leaving,
  briefing,
  complete,
  onExplore,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  briefing: string[]
  complete: boolean
  onExplore?: (id: string) => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'glint' | 'wake' | 'flare' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'glint', 'wake', 'flare'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), 2200)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  const briefClass = BRIEFING.filter((id) => briefing.includes(id))
    .map((id) => `is-${id}`)
    .join(' ')

  return (
    <div className={`opportunity ${leaving ? 'is-leaving' : ''} ${complete ? 'is-charted' : ''} ${briefClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="opportunity-camera" aria-hidden="true">
        <img className="opportunity-plate" src={plate} alt="" draggable={false} />
        <div className="opportunity-sun" style={overlayShift} />
        <div className="opportunity-warm" />
        <div className="opportunity-cloud cloud-a" />
        {!mobileLite ? <div className="opportunity-cloud cloud-b" /> : null}
        <div className="opportunity-waves" />
        <div className="opportunity-reflect" />
        <div className="opportunity-foam" />
        <div className="opportunity-wake" />
        <div className="opportunity-hull" />
        <span className="opportunity-sail" />
        {!mobileLite ? <span className="opportunity-far-sail" /> : null}
        {lively && !mobileLite ? <span className="opportunity-bird" /> : null}
        <svg className="opportunity-route" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M46 68 C 58 64 70 58 82 48" />
        </svg>
        <div className="opportunity-coast" />
        <div className="opportunity-city" />
        <div className="opportunity-ship" />
        <div className="opportunity-vignette" style={overlayShift} />
        <div className="opportunity-dim" />
        <div className="opportunity-exit-mist" />
      </div>
      {onExplore && !complete ? (
        <>
          <button className="opportunity-hot hot-terrain" type="button" data-label="The Terrain" aria-label="The Terrain. Distant coastline." onClick={() => onExplore('terrain')} />
          <button className="opportunity-hot hot-role" type="button" data-label="Your Role" aria-label="Your Role. The Odyssey sailboat." onClick={() => onExplore('role')} />
          <button className="opportunity-hot hot-mission" type="button" data-label="The Mission" aria-label="The Mission. Distant destination." onClick={() => onExplore('mission')} />
        </>
      ) : null}
    </div>
  )
}
