import { useEffect, useState } from 'react'

const EVENTS = ['star', 'bird', 'lightning', 'fish', 'mooncloud', 'sparkle'] as const

type LifeEvent = (typeof EVENTS)[number] | null

export function OceanLife({ reduced, active }: { reduced: boolean; active: boolean }) {
  const [event, setEvent] = useState<LifeEvent>(null)

  useEffect(() => {
    if (!active || reduced) return
    let timeout = 0
    const cycle = () => {
      const next = EVENTS[Math.floor(Math.random() * EVENTS.length)]
      setEvent(next)
      timeout = window.setTimeout(() => {
        setEvent(null)
        timeout = window.setTimeout(cycle, 10000 + Math.random() * 20000)
      }, 2400)
    }
    timeout = window.setTimeout(cycle, 8000 + Math.random() * 6000)
    return () => window.clearTimeout(timeout)
  }, [active, reduced])

  if (reduced) return null

  return (
    <div className="ocean-life" aria-hidden="true">
      <div className={`life-star ${event === 'star' ? 'is-on' : ''}`} />
      <div className={`life-bird ${event === 'bird' ? 'is-on' : ''}`} />
      <div className={`life-flash ${event === 'lightning' ? 'is-on' : ''}`} />
      <div className={`life-fish ${event === 'fish' ? 'is-on' : ''}`} />
      <div className={`life-mooncloud ${event === 'mooncloud' ? 'is-on' : ''}`} />
      <div className={`life-sparkle ${event === 'sparkle' ? 'is-on' : ''}`} />
    </div>
  )
}
