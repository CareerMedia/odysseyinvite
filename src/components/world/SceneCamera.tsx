import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type { WorldState } from '../../types'

export function SceneCamera({
  world,
  reduced,
  children,
}: {
  world: WorldState
  reduced: boolean
  children: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || reduced) return
    const ctx = gsap.context(() => {
      if (world.cameraMood === 'still') return
      if (world.cameraMood === 'push') {
        gsap.to(root.current, { scale: 1.04, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        return
      }
      if (world.cameraMood === 'storm') {
        gsap.to(root.current, {
          x: 3,
          rotation: 0.25,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
        return
      }
      gsap.to(root.current, { y: 5, duration: 11, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, root)
    return () => ctx.revert()
  }, [reduced, world.cameraMood])

  return (
    <div className="scene-camera" ref={root}>
      {children}
    </div>
  )
}
