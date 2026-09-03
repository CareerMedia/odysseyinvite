import { useEffect, useState } from 'react'
import type { WorldState } from '../../types'

const EVENTS = ['bird', 'star', 'splash', 'leaf', 'lantern', 'lightning', 'pulse'] as const
type EventId = (typeof EVENTS)[number]

export function AmbientEvents({
  world,
  active,
  reduced,
  hidden,
}: {
  world: WorldState
  active: boolean
  reduced: boolean
  hidden: boolean
}) {
  const [event, setEvent] = useState<EventId | null>(null)

  useEffect(() => {
    if (!active || reduced || hidden) return
    let timeout = 0
    const cycle = () => {
      const pool = EVENTS.filter((item) => {
        if (item === 'lightning') return world.weather === 'stormDistant' || world.weather === 'storm'
        if (item === 'pulse') return world.weather === 'oracleAnomaly'
        if (item === 'star') return world.timeOfDay === 'predawn' || world.timeOfDay === 'twilight'
        return true
      })
      setEvent(pool[Math.floor(Math.random() * pool.length)] ?? null)
      timeout = window.setTimeout(() => {
        setEvent(null)
        timeout = window.setTimeout(cycle, 12000 + Math.random() * 18000)
      }, 2200)
    }
    timeout = window.setTimeout(cycle, 8000 + Math.random() * 8000)
    return () => window.clearTimeout(timeout)
  }, [active, hidden, reduced, world.timeOfDay, world.weather])

  if (reduced) return null

  return (
    <div className="ambient-events" aria-hidden="true">
      <div className={`amb-bird ${event === 'bird' ? 'is-on' : ''}`} />
      <div className={`amb-star ${event === 'star' ? 'is-on' : ''}`} />
      <div className={`amb-splash ${event === 'splash' ? 'is-on' : ''}`} />
      <div className={`amb-leaf ${event === 'leaf' ? 'is-on' : ''}`} />
      <div className={`amb-lantern ${event === 'lantern' ? 'is-on' : ''}`} />
      <div className={`amb-flash ${event === 'lightning' ? 'is-on' : ''}`} />
      <div className={`amb-pulse ${event === 'pulse' ? 'is-on' : ''}`} />
    </div>
  )
}
