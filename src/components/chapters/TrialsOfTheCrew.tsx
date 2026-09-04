import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/trials/trials-of-the-crew.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const PRINCIPLES = ['trust', 'communicate', 'collaborate'] as const

export function TrialsOfTheCrew({
  reduced,
  hidden,
  quality,
  leaving,
  principles,
  complete,
  onExplore,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  principles: string[]
  complete: boolean
  onExplore?: (id: string) => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 3}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'gust' | 'spray' | 'bird' | 'flare' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['gust', 'spray', 'bird', 'flare'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), 2200)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  const principleClass = PRINCIPLES.filter((id) => principles.includes(id))
    .map((id) => `is-${id}`)
    .join(' ')

  return (
    <div className={`trials ${leaving ? 'is-leaving' : ''} ${complete ? 'is-united' : ''} ${principleClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="trials-camera" aria-hidden="true">
        <img className="trials-plate" src={plate} alt="" draggable={false} />
        <div className="trials-cloud cloud-a" style={overlayShift} />
        {!mobileLite ? <div className="trials-cloud cloud-b" /> : null}
        <div className="trials-sun" />
        <div className="trials-waves" />
        <div className="trials-wake" />
        <span className="trials-spray spray-a" />
        <span className="trials-spray spray-b" />
        {!mobileLite ? <span className="trials-spray spray-c" /> : null}
        <span className="trials-flag flag-a" />
        <span className="trials-flag flag-b" />
        {!mobileLite ? <span className="trials-flag flag-c" /> : null}
        <span className="trials-rope rope-bridge" />
        {!mobileLite ? <span className="trials-rope rope-wire" /> : null}
        {!mobileLite ? <span className="trials-rope rope-net" /> : null}
        <span className="trials-tent" />
        <span className="trials-lantern" />
        {lively && !mobileLite ? <span className="trials-bird" /> : null}
        <div className="trials-trust" />
        <div className="trials-talk" />
        <div className="trials-join" />
        <div className="trials-camp" />
        <div className="trials-wash" />
        <div className="trials-vignette" style={overlayShift} />
        <div className="trials-dim" />
        <div className="trials-exit-mist" />
      </div>
      {onExplore && !complete ? (
        <>
          <button className="trials-hot hot-trust" type="button" data-label="Trust" aria-label="Trust. Rope bridge." onClick={() => onExplore('trust')} />
          <button className="trials-hot hot-communicate" type="button" data-label="Communicate" aria-label="Communicate. Rafts." onClick={() => onExplore('communicate')} />
          <button className="trials-hot hot-collaborate" type="button" data-label="Collaborate" aria-label="Collaborate. Climbing net." onClick={() => onExplore('collaborate')} />
        </>
      ) : null}
    </div>
  )
}
