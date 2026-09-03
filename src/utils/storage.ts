import type { ProgressState } from '../types'

export const STORAGE_KEYS = {
  state: 'careerCenterOdyssey.state',
  progress: 'careerCenterOdyssey.progress',
  achievements: 'careerCenterOdyssey.achievements',
  soundEnabled: 'careerCenterOdyssey.soundEnabled',
} as const

export const defaultProgress = (): ProgressState => ({
  introCompleted: false,
  voyageStarted: false,
  voyageComplete: false,
  currentDestinationId: 'prologue',
  visitedIds: [],
  revealedIds: ['prologue'],
  completedIds: [],
  earnedChapterXp: [],
  xp: 0,
  unlockedAchievementIds: [],
  strengthsPath: null,
  soundEnabled: false,
  soundMutedExplicitly: false,
  soundChoiceMade: false,
  mapGuidanceSeen: false,
})

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.state) ?? localStorage.getItem(STORAGE_KEYS.progress)
    if (!raw) return defaultProgress()
    const saved = JSON.parse(raw) as Partial<ProgressState>
    const merged = { ...defaultProgress(), ...saved }
    if (saved.soundChoiceMade === undefined) {
      merged.soundChoiceMade = Boolean(saved.soundEnabled || saved.soundMutedExplicitly)
    }
    if (!merged.completedIds) merged.completedIds = []
    if (!merged.earnedChapterXp) merged.earnedChapterXp = []
    if (!merged.visitedIds) merged.visitedIds = []
    merged.visitedIds = Array.from(new Set([...merged.visitedIds, ...merged.completedIds]))
    if (merged.mapGuidanceSeen === undefined) merged.mapGuidanceSeen = Boolean(merged.voyageStarted)
    if (!merged.revealedIds.includes('prologue')) merged.revealedIds = ['prologue', ...merged.revealedIds]
    return merged
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress: ProgressState) {
  try {
    const payload = JSON.stringify(progress)
    localStorage.setItem(STORAGE_KEYS.state, payload)
    localStorage.setItem(STORAGE_KEYS.progress, payload)
    localStorage.setItem(STORAGE_KEYS.soundEnabled, String(progress.soundEnabled))
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(progress.unlockedAchievementIds))
  } catch {
    // Private mode should never break the voyage.
  }
}

export function resetProgress() {
  const next = defaultProgress()
  try {
    localStorage.removeItem(STORAGE_KEYS.state)
    localStorage.removeItem(STORAGE_KEYS.progress)
    localStorage.removeItem(STORAGE_KEYS.achievements)
    localStorage.removeItem(STORAGE_KEYS.soundEnabled)
  } catch {
    /* ignore */
  }
  return next
}
