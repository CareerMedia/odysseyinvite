import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  r: number
  s: number
  a: number
  vx: number
  vy: number
}

type AmbientParticlesProps = {
  mode: 'ocean' | 'map'
  reduced: boolean
  isMobile: boolean
}

export function AmbientParticles({ mode, reduced, isMobile }: AmbientParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    const count = isMobile ? 18 : mode === 'ocean' ? 42 : 28
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
          r: Math.random() * 1.6 + 0.3,
          s: Math.random() * 0.4 + 0.1,
          a: Math.random() * 0.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.25,
          vy: mode === 'ocean' ? -0.12 - Math.random() * 0.18 : 0.08 + Math.random() * 0.12,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.y < -8) particle.y = height + 6
        if (particle.y > height + 8) particle.y = -6
        if (particle.x < -8) particle.x = width + 6
        if (particle.x > width + 8) particle.x = -6
        ctx.beginPath()
        ctx.fillStyle =
          mode === 'ocean'
            ? `rgba(210, 230, 240, ${particle.a})`
            : `rgba(201, 168, 76, ${particle.a * 0.7})`
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
  }, [isMobile, mode, reduced])

  return <canvas ref={ref} className="ocean-layer" aria-hidden="true" />
}

type Star = { x: number; y: number; r: number; p: number; s: number }

export function StarField({ reduced, isMobile, pointer }: { reduced: boolean; isMobile: boolean; pointer: { x: number; y: number } }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef(pointer)

  useEffect(() => {
    pointerRef.current = pointer
  }, [pointer])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    const stars: Star[] = []
    const count = isMobile ? 50 : 110

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const seed = () => {
      stars.length = 0
      for (let i = 0; i < count; i += 1) {
        stars.push({
          x: Math.random(),
          y: Math.random() * 0.62,
          r: Math.random() * 1.3 + 0.2,
          p: Math.random() * Math.PI * 2,
          s: 0.4 + Math.random() * 1.4,
        })
      }
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const parallax = isMobile || reduced ? 0 : 8
      const px = pointerRef.current.x * parallax
      const py = pointerRef.current.y * parallax * 0.5
      stars.forEach((star) => {
        const twinkle = reduced ? 0.7 : 0.35 + Math.abs(Math.sin(time * 0.001 * star.s + star.p)) * 0.65
        ctx.beginPath()
        ctx.fillStyle = `rgba(232, 238, 248, ${twinkle})`
        ctx.arc(star.x * width + px, star.y * height + py, star.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    resize()
    seed()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [isMobile, reduced])

  return (
    <div className="ocean-layer stars">
      <canvas ref={ref} />
    </div>
  )
}
