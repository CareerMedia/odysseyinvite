import type { QualityLevel } from '../types'

export function detectQuality(isMobile: boolean, reducedMotion: boolean): QualityLevel {
  if (reducedMotion) return 'low'
  if (typeof navigator === 'undefined') return isMobile ? 'medium' : 'high'
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency ?? 8
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (saveData) return 'low'
  if (isMobile && (memory ?? 8) <= 4) return 'low'
  if (isMobile || (memory ?? 8) <= 4 || cores <= 4) return 'medium'
  return 'high'
}

export function qualityScale(level: QualityLevel) {
  if (level === 'low') {
    return { particles: 0.25, fogLayers: 1, clouds: 1, parallax: 0, events: false }
  }
  if (level === 'medium') {
    return { particles: 0.55, fogLayers: 2, clouds: 2, parallax: 0.45, events: true }
  }
  return { particles: 1, fogLayers: 3, clouds: 3, parallax: 1, events: true }
}
