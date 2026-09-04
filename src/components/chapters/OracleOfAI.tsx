import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/oracle/oracle-of-ai.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const PRINCIPLES = ['ask', 'evaluate', 'create'] as const
const NODES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const

export function OracleOfAI({
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
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'page' | 'flash' | 'pulse' | 'star' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['page', 'flash', 'pulse', 'star'] as const)[Math.floor(Math.random() * 4)]
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
    <div className={`oracle ${leaving ? 'is-leaving' : ''} ${complete ? 'is-awakened' : ''} ${principleClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="oracle-camera" aria-hidden="true">
        <img className="oracle-plate" src={plate} alt="" draggable={false} />
        <div className="oracle-sea" />
        <div className="oracle-horizon" />
        {!mobileLite ? <div className="oracle-cloud" style={overlayShift} /> : null}
        {lively && !mobileLite ? <span className="oracle-gull" /> : null}
        <span className="oracle-candle candle-a" />
        <span className="oracle-candle candle-b" />
        <span className="oracle-candle candle-c" />
        {!mobileLite ? <span className="oracle-candle candle-d" /> : null}
        <span className="oracle-page page-a" />
        {!mobileLite ? <span className="oracle-page page-b" /> : null}
        <div className="oracle-wall wall-left" />
        <div className="oracle-wall wall-right" />
        {!mobileLite ? <div className="oracle-ceiling" /> : null}
        <div className="oracle-floor" />
        <div className="oracle-sphere" style={overlayShift}>
          <span className="orb-core" />
          <span className="orb-ring ring-outer" />
          <span className="orb-ring ring-mid" />
          <span className="orb-ring ring-inner" />
          {!mobileLite ? <span className="orb-line line-a" /> : null}
          <span className="orb-line line-b" />
          {NODES.slice(0, mobileLite ? 6 : 10).map((id) => (
            <span key={id} className={`orb-node node-${id}`} />
          ))}
          {lively
            ? ['p', 'q', 'r'].map((id) => <span key={id} className={`orb-mote mote-${id}`} />)
            : null}
        </div>
        <div className="oracle-ask" />
        <div className="oracle-eval" />
        <div className="oracle-make" />
        <div className="oracle-bloom" />
        <div className="oracle-vignette" style={overlayShift} />
        <div className="oracle-dim" />
        <div className="oracle-exit-mist" />
      </div>
      {onExplore && !complete ? (
        <>
          <button className="oracle-hot hot-ask" type="button" data-label="Ask" aria-label="Ask. Left knowledge station." onClick={() => onExplore('ask')} />
          <button className="oracle-hot hot-evaluate" type="button" data-label="Evaluate" aria-label="Evaluate. The Oracle sphere." onClick={() => onExplore('evaluate')} />
          <button className="oracle-hot hot-create" type="button" data-label="Create" aria-label="Create. Right knowledge station." onClick={() => onExplore('create')} />
        </>
      ) : null}
    </div>
  )
}
