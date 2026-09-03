import { useEffect, useRef } from 'react'
import type { ParticleMode, QualityLevel } from '../../types'

type Particle = { x: number; y: number; r: number; a: number; vx: number; vy: number }

const TINT: Record<ParticleMode, string> = {
  dust: '201, 168, 76',
  mist: '220, 230, 236',
  spray: '200, 230, 235',
  gold: '232, 212, 139',
  embers: '232, 165, 75',
  pollen: '232, 213, 176',
  magic: '232, 212, 139',
  oracle: '126, 200, 184',
  stars: '232, 238, 248',
}

export function WorldParticles({
  mode,
  density,
  quality,
  reduced,
  hidden,
}: {
  mode: ParticleMode
  density: number
  quality: QualityLevel
  reduced: boolean
  hidden: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced || hidden || quality === 'low' || density < 0.08) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    const base = quality === 'high' ? 36 : 20
    const count = Math.max(8, Math.round(base * density))
    const particles: Particle[] = []

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const seed = () => {
      particles.length = 0
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.7 + 0.3,
          a: Math.random() * 0.45 + 0.1,
          vx: (Math.random() - 0.5) * (mode === 'oracle' ? 0.55 : 0.22),
          vy:
            mode === 'spray'
              ? -0.28 - Math.random() * 0.2
              : mode === 'stars'
                ? 0
                : 0.06 + Math.random() * 0.16,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const tint = TINT[mode]
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.y < -8) particle.y = height + 6
        if (particle.y > height + 8) particle.y = -6
        if (particle.x < -8) particle.x = width + 6
        if (particle.x > width + 8) particle.x = -6
        ctx.beginPath()
        ctx.fillStyle = `rgba(${tint}, ${particle.a})`
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    resize()
    seed()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density, hidden, mode, quality, reduced])

  if (reduced || hidden || quality === 'low') return null
  return <canvas ref={ref} className="world-particles" aria-hidden="true" />
}
