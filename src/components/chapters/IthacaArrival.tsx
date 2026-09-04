import { useEffect, useState, type CSSProperties } from 'react'
import plate from '../../assets/environments/ithaca/ithaca-final.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

const PROMPTS = ['discover', 'carry', 'next'] as const

export function IthacaArrival({
  reduced,
  hidden,
  quality,
  leaving,
  finale,
  reflections,
  complete,
  rich,
  onExplore,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  finale: boolean
  reflections: string[]
  complete: boolean
  rich: boolean
  onExplore?: (id: string) => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 1.5}px`,
  } as CSSProperties
  const [event, setEvent] = useState<'bird' | 'glint' | 'bell' | 'leaf' | null>(null)
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'

  useEffect(() => {
    if (!lively || hidden || finale) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        const next = (['bird', 'glint', 'bell', 'leaf'] as const)[Math.floor(Math.random() * 4)]
        setEvent(next)
        window.setTimeout(() => setEvent(null), 2400)
        schedule()
      }, 15000 + Math.random() * 20000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [finale, hidden, lively])

  const promptClass = PROMPTS.filter((id) => reflections.includes(id))
    .map((id) => `is-${id}`)
    .join(' ')

  return (
    <div className={`ithaca ${leaving ? 'is-leaving' : ''} ${finale ? 'is-finale' : ''} ${complete ? 'is-home' : ''} ${rich ? 'is-rich' : ''} ${promptClass} ${event ? `is-${event}` : ''} ${mobileLite ? 'is-lite' : ''}`}>
      <div className="ithaca-camera" aria-hidden="true">
        <img className="ithaca-plate" src={plate} alt="" draggable={false} />
        <div className="ithaca-sun" style={overlayShift} />
        <div className="ithaca-cloud cloud-a" />
        {!mobileLite ? <div className="ithaca-cloud cloud-b" /> : null}
        <div className="ithaca-reflect" />
        <div className="ithaca-waves" />
        <div className="ithaca-wake" />
        <div className="ithaca-hull" />
        <span className="ithaca-lantern" />
        <span className="ithaca-leaf" />
        <span className="ithaca-citadel" />
        <span className="ithaca-window win-a" />
        <span className="ithaca-window win-b" />
        <span className="ithaca-window win-c" />
        <span className="ithaca-window win-d" />
        {!mobileLite ? <span className="ithaca-window win-e" /> : null}
        {!mobileLite ? <span className="ithaca-window win-f" /> : null}
        {rich ? <span className="ithaca-window win-g" /> : null}
        {!mobileLite ? <span className="ithaca-far-sail" /> : null}
        {lively && !mobileLite ? <span className="ithaca-birds" /> : null}
        <div className="ithaca-ripple" />
        <div className="ithaca-path" />
        <div className="ithaca-horizon" />
        <div className="ithaca-vignette" style={overlayShift} />
        <div className="ithaca-dim" />
        <div className="ithaca-exit-mist" />
      </div>
      {finale ? <p className="ithaca-farewell">The journey continues.</p> : null}
      {onExplore && !complete && !finale ? (
        <>
          <button className="ithaca-hot hot-discover" type="button" data-label="Discover" aria-label="What did you discover?" onClick={() => onExplore('discover')} />
          <button className="ithaca-hot hot-carry" type="button" data-label="Carry Forward" aria-label="What will you carry forward?" onClick={() => onExplore('carry')} />
          <button className="ithaca-hot hot-next" type="button" data-label="Next" aria-label="Where will your Odyssey take you next?" onClick={() => onExplore('next')} />
        </>
      ) : null}
    </div>
  )
}
