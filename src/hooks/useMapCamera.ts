import { useCallback, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { islandRoutePoint, MAP_SAFE, MAP_WORLD, MAP_ZOOM } from '../data/mapWorld'

type CameraState = {
  x: number
  y: number
  zoom: number
  vx: number
  vy: number
}

export function useMapCamera({ reduced }: { reduced: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const state = useRef<CameraState>({ x: 0, y: 0, zoom: MAP_ZOOM.default, vx: 0, vy: 0 })
  const drag = useRef<{ id: number; lastX: number; lastY: number; moved: boolean; pinching: boolean } | null>(null)
  const pinch = useRef<{ distance: number; zoom: number } | null>(null)
  const inertia = useRef(0)
  const tween = useRef<gsap.core.Tween | null>(null)
  const panned = useRef(false)

  const apply = useCallback(() => {
    const world = worldRef.current
    if (!world) return
    const { x, y, zoom } = state.current
    world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`
  }, [])

  const clamp = useCallback(() => {
    const view = viewportRef.current
    if (!view) return
    const { width: vw, height: vh } = view.getBoundingClientRect()
    const { zoom } = state.current
    const worldW = MAP_WORLD.width * zoom
    const worldH = MAP_WORLD.height * zoom
    const pad = 48
    if (worldW <= vw) state.current.x = (vw - worldW) / 2
    else {
      const minX = vw - worldW + pad
      const maxX = -pad
      const overX = state.current.x > maxX ? state.current.x - maxX : state.current.x < minX ? state.current.x - minX : 0
      state.current.x -= overX * 0.35
      state.current.x = Math.min(maxX + 28, Math.max(minX - 28, state.current.x))
    }
    if (worldH <= vh) state.current.y = (vh - worldH) / 2
    else {
      const minY = vh - worldH + pad
      const maxY = -pad
      const overY = state.current.y > maxY ? state.current.y - maxY : state.current.y < minY ? state.current.y - minY : 0
      state.current.y -= overY * 0.35
      state.current.y = Math.min(maxY + 28, Math.max(minY - 28, state.current.y))
    }
  }, [])

  const setCamera = useCallback(
    (next: Partial<CameraState>, animate = false, duration = 1.05) => {
      tween.current?.kill()
      const target = { ...state.current, ...next }
      if (!animate || reduced) {
        state.current = { ...target, vx: 0, vy: 0 }
        clamp()
        apply()
        return
      }
      const from = { ...state.current }
      tween.current = gsap.to(from, {
        x: target.x,
        y: target.y,
        zoom: target.zoom,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          state.current.x = from.x
          state.current.y = from.y
          state.current.zoom = from.zoom
          clamp()
          apply()
        },
      })
    },
    [apply, clamp, reduced],
  )

  const worldToPan = useCallback((wx: number, wy: number, zoom: number, sx: number, sy: number) => {
    return { x: sx - wx * zoom, y: sy - wy * zoom, zoom }
  }, [])

  const focusPoint = useCallback(
    (wx: number, wy: number, zoom = 1.1, animate = true) => {
      const view = viewportRef.current
      if (!view) return
      const { width: vw, height: vh } = view.getBoundingClientRect()
      const safeW = Math.max(200, vw - MAP_SAFE.left - MAP_SAFE.right)
      const safeH = Math.max(160, vh - MAP_SAFE.top - MAP_SAFE.bottom)
      const sx = MAP_SAFE.left + safeW / 2
      const sy = MAP_SAFE.top + safeH / 2
      setCamera(worldToPan(wx, wy, zoom, sx, sy), animate)
    },
    [setCamera, worldToPan],
  )

  const showOverview = useCallback(
    (points: { x: number; y: number }[], animate = true) => {
      const view = viewportRef.current
      if (!view || !points.length) return
      const xs = points.map((p) => p.x)
      const ys = points.map((p) => p.y)
      const minX = Math.min(...xs) - 180
      const maxX = Math.max(...xs) + 180
      const minY = Math.min(...ys) - 160
      const maxY = Math.max(...ys) + 160
      const { width: vw, height: vh } = view.getBoundingClientRect()
      const safeW = Math.max(240, vw - MAP_SAFE.left - MAP_SAFE.right)
      const safeH = Math.max(200, vh - MAP_SAFE.top - MAP_SAFE.bottom)
      const zoom = Math.min(MAP_ZOOM.max, Math.max(MAP_ZOOM.min, Math.min(safeW / (maxX - minX), safeH / (maxY - minY))))
      focusPoint((minX + maxX) / 2, (minY + maxY) / 2, zoom, animate)
    },
    [focusPoint],
  )

  const zoomTo = useCallback(
    (zoom: number, around?: { x: number; y: number }) => {
      const view = viewportRef.current
      if (!view) return
      const next = Math.min(MAP_ZOOM.max, Math.max(MAP_ZOOM.min, zoom))
      const rect = view.getBoundingClientRect()
      const cx = around?.x ?? rect.width / 2
      const cy = around?.y ?? rect.height / 2
      const wx = (cx - state.current.x) / state.current.zoom
      const wy = (cy - state.current.y) / state.current.zoom
      setCamera({ x: cx - wx * next, y: cy - wy * next, zoom: next }, !reduced, 0.35)
    },
    [reduced, setCamera],
  )

  const resetView = useCallback(() => {
    setCamera({ x: 0, y: 0, zoom: MAP_ZOOM.default }, true)
  }, [setCamera])

  const panTo = useCallback(
    (wx: number, wy: number, animate = true) => {
      focusPoint(wx, wy, state.current.zoom, animate)
    },
    [focusPoint],
  )

  const focusDestination = useCallback(
    (id: string, zoom = 1.08, animate = true) => {
      const point = islandRoutePoint(id)
      focusPoint(point.x, point.y, zoom, animate)
    },
    [focusPoint],
  )

  const focusShip = useCallback(
    (id: string, animate = true) => {
      focusDestination(id, 1.08, animate)
    },
    [focusDestination],
  )

  const centerCurrentDestination = useCallback(
    (id: string, animate = true) => {
      focusDestination(id, 1.1, animate)
    },
    [focusDestination],
  )

  useEffect(() => {
    const view = viewportRef.current
    const world = worldRef.current
    if (!view || !world) return

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = event.target as HTMLElement
      if (target.closest('.map-island, .map-egg, .kraken, .map-zoom, button, a')) return
      tween.current?.kill()
      drag.current = { id: event.pointerId, lastX: event.clientX, lastY: event.clientY, moved: false, pinching: false }
      state.current.vx = 0
      state.current.vy = 0
      view.setPointerCapture(event.pointerId)
      view.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current || drag.current.id !== event.pointerId || pinch.current) return
      const dx = event.clientX - drag.current.lastX
      const dy = event.clientY - drag.current.lastY
      if (Math.hypot(dx, dy) > 3) drag.current.moved = true
      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      state.current.x += dx
      state.current.y += dy
      state.current.vx = dx
      state.current.vy = dy
      clamp()
      apply()
    }

    const release = (event: PointerEvent) => {
      if (!drag.current || drag.current.id !== event.pointerId) return
      const moved = drag.current.moved
      panned.current = moved
      drag.current = null
      view.classList.remove('is-dragging')
      if (reduced || !moved) return
      cancelAnimationFrame(inertia.current)
      const step = () => {
        state.current.vx *= 0.86
        state.current.vy *= 0.86
        if (Math.hypot(state.current.vx, state.current.vy) < 0.35) return
        state.current.x += state.current.vx
        state.current.y += state.current.vy
        clamp()
        apply()
        inertia.current = requestAnimationFrame(step)
      }
      inertia.current = requestAnimationFrame(step)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = view.getBoundingClientRect()
      const factor = event.deltaY > 0 ? 0.96 : 1.04
      zoomTo(state.current.zoom * factor, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      pinch.current = { distance: Math.hypot(dx, dy), zoom: state.current.zoom }
      drag.current = null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!pinch.current || event.touches.length !== 2) return
      event.preventDefault()
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      const distance = Math.hypot(dx, dy)
      const rect = view.getBoundingClientRect()
      const mid = {
        x: (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top,
      }
      zoomTo(pinch.current.zoom * (distance / pinch.current.distance), mid)
    }

    const onTouchEnd = () => {
      if (!pinch.current) return
      pinch.current = null
    }

    view.addEventListener('pointerdown', onPointerDown)
    view.addEventListener('pointermove', onPointerMove)
    view.addEventListener('pointerup', release)
    view.addEventListener('pointercancel', release)
    view.addEventListener('wheel', onWheel, { passive: false })
    view.addEventListener('touchstart', onTouchStart, { passive: true })
    view.addEventListener('touchmove', onTouchMove, { passive: false })
    view.addEventListener('touchend', onTouchEnd)
    return () => {
      view.removeEventListener('pointerdown', onPointerDown)
      view.removeEventListener('pointermove', onPointerMove)
      view.removeEventListener('pointerup', release)
      view.removeEventListener('pointercancel', release)
      view.removeEventListener('wheel', onWheel)
      view.removeEventListener('touchstart', onTouchStart)
      view.removeEventListener('touchmove', onTouchMove)
      view.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(inertia.current)
    }
  }, [apply, clamp, reduced, zoomTo])

  return useMemo(
    () => ({
      viewportRef,
      worldRef,
      apply,
      clamp,
      setCamera,
      focusPoint,
      panTo,
      focusDestination,
      focusShip,
      centerCurrentDestination,
      showOverview,
      zoomTo,
      resetView,
      getCamera: () => state.current,
      didDrag: () => panned.current,
    }),
    [apply, centerCurrentDestination, clamp, focusDestination, focusPoint, focusShip, panTo, resetView, setCamera, showOverview, zoomTo],
  )
}
