import { useEffect, useState } from 'react'

export function usePointer(active: boolean) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!active) return

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      setPointer({ x, y })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [active])

  return pointer
}
