import { useEffect, useRef, type CSSProperties } from 'react'
import plate from '../../assets/environments/safe-harbor-2/safe-harbor-2.jpg'
import type { QualityLevel } from '../../types'
import { usePointer } from '../../hooks/usePointer'

export function SafeHarborII({
  reduced,
  hidden,
  quality,
  leaving,
  phase,
  alerted,
  onPhase,
  onInspect,
}: {
  reduced: boolean
  hidden: boolean
  quality: QualityLevel
  leaving: boolean
  phase: number
  alerted: boolean
  onPhase?: (phase: number) => void
  onInspect?: () => void
}) {
  const pointer = usePointer(!reduced && !hidden && quality !== 'low')
  const overlayShift = {
    '--gx': `${pointer.x * 2}px`,
    '--gy': `${pointer.y * 2}px`,
  } as CSSProperties
  const lively = quality !== 'low' && !reduced
  const mobileLite = quality !== 'high'
  const stage = alerted ? Math.max(phase, 2) : phase
  const phaseRef = useRef(stage)
  const onPhaseRef = useRef(onPhase)
  phaseRef.current = stage
  onPhaseRef.current = onPhase

  useEffect(() => {
    if (hidden || alerted) return
    const timers: number[] = []
    const report = (next: number) => {
      if (next > phaseRef.current) onPhaseRef.current?.(next)
    }
    if (reduced) {
      timers.push(window.setTimeout(() => report(2), 1400))
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    const jitter = () => Math.random() * 900
    timers.push(window.setTimeout(() => report(1), 3400 + jitter()))
    timers.push(window.setTimeout(() => report(2), 9400 + jitter()))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [alerted, hidden, reduced])

  return (
    <div
      className={`harbor2 ${leaving ? 'is-leaving' : ''} ${stage >= 1 ? 'is-drift' : ''} ${stage >= 2 ? 'is-signal' : ''} ${mobileLite ? 'is-lite' : ''}`}
    >
      <div className="harbor2-camera" aria-hidden="true">
        <img className="harbor2-plate" src={plate} alt="" draggable={false} />
        <div className="harbor2-cloud cloud-a" style={overlayShift} />
        {!mobileLite ? <div className="harbor2-cloud cloud-b" /> : null}
        <div className="harbor2-sun" />
        <div className="harbor2-waves" />
        <div className="harbor2-foam" />
        <div className="harbor2-wake" />
        <span className="harbor2-lamp lamp-a" />
        <span className="harbor2-lamp lamp-b" />
        <span className="harbor2-lamp lamp-c" />
        <span className="harbor2-lamp lamp-d" />
        {!mobileLite ? <span className="harbor2-lamp lamp-e" /> : null}
        <span className="harbor2-window" />
        <span className="harbor2-beacon" />
        <div className="harbor2-cyan" />
        <span className="harbor2-speck speck-a" />
        {!mobileLite ? <span className="harbor2-speck speck-b" /> : null}
        {lively && !mobileLite ? <span className="harbor2-bird" /> : null}
        <div className="harbor2-glitch" />
        <div className="harbor2-vignette" style={overlayShift} />
        <div className="harbor2-dim" />
        <div className="harbor2-exit-mist" />
      </div>
      <button
        className="harbor2-gauge"
        type="button"
        aria-label="Inspect unstable navigation instrument"
        onClick={() => onInspect?.()}
      >
        <span className="gauge-ring" />
        <span className="gauge-mark" />
        <span className="gauge-needle" />
        <span className="gauge-hub" />
      </button>
    </div>
  )
}
