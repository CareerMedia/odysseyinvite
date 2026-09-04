import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/quartermaster/quartermasters-deck.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const ITEMS = ['spaces', 'equipment', 'payroll'] as const

export function QuartermastersDeck({
  reduced,
  hidden,
  quality,
  leaving,
  finds,
  complete,
  onExplore,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  finds: string[]
  complete: boolean
  onExplore?: (id: string) => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 3}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'flare' | 'paper' | 'gull' | 'rope' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['flare', 'paper', 'gull', 'rope'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), 2200)
        schedule()
      }, 12000 + Math.random() * 18000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [hidden, lively])

  const findClass = ITEMS.filter((id) => finds.includes(id))
    .map((id) => `is-${id}`)
    .join(' ')

  return (
    <div className={`deck ${leaving ? 'is-leaving' : ''} ${complete ? 'is-ready' : ''} ${findClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="deck-camera" aria-hidden="true">
        <img className="deck-plate" src={plate} alt="" draggable={false} />
        <div className="deck-sun" style={overlayShift} />
        <div className="deck-shimmer" />
        <div className="deck-port" />
        <span className="deck-lamp lamp-a" />
        <span className="deck-lamp lamp-b" />
        <span className="deck-lamp lamp-c" />
        <span className="deck-lamp lamp-d" />
        <span className="deck-lamp lamp-e" />
        <span className="deck-paper paper-a" />
        {!mobileLite ? <span className="deck-paper paper-b" /> : null}
        <span className="deck-rope" />
        {lively ? (
          <>
            <span className="deck-mote mote-a" />
            <span className="deck-mote mote-b" />
            {!mobileLite ? <span className="deck-mote mote-c" /> : null}
            <span className="deck-gull" />
          </>
        ) : null}
        <div className="deck-compass">
          <span className="deck-ring" />
          <span className="deck-spark" />
        </div>
        <div className="deck-spaces" />
        <div className="deck-equipment" />
        <div className="deck-payroll" />
        <div className="deck-wash" />
        <div className="deck-vignette" style={overlayShift} />
        <div className="deck-dim" />
        <div className="deck-exit-mist" />
      </div>
      {onExplore && !complete ? (
        <>
          <button className="deck-hot hot-spaces" type="button" aria-label="Spaces. Chart board." onClick={() => onExplore('spaces')} />
          <button className="deck-hot hot-equipment" type="button" aria-label="Equipment. Supply crate." onClick={() => onExplore('equipment')} />
          <button className="deck-hot hot-payroll" type="button" aria-label="Payroll. Ledger and papers." onClick={() => onExplore('payroll')} />
        </>
      ) : null}
    </div>
  )
}
