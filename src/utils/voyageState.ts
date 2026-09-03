import { destinations, JOURNEY_ORDER, STORY_IDS } from '../data/destinations'
import { DestStatus, type DestStatusId, type ProgressState } from '../types'

export function journeyIndex(id: string) {
  return JOURNEY_ORDER.indexOf(id)
}

export function nextAvailableId(progress: ProgressState) {
  return JOURNEY_ORDER.find((id) => !progress.completedIds.includes(id)) ?? null
}

export function getDestinationStatus(id: string, progress: ProgressState): DestStatusId {
  if (id === 'forbidden') {
    if (progress.completedIds.includes('forbidden')) return DestStatus.Completed
    if (progress.revealedIds.includes('forbidden')) {
      return progress.currentDestinationId === 'forbidden' ? DestStatus.Current : DestStatus.Available
    }
    return DestStatus.Locked
  }

  if (progress.completedIds.includes(id)) return DestStatus.Completed
  if (progress.currentDestinationId === id) return DestStatus.Current

  const next = nextAvailableId(progress)
  if (next === id) return DestStatus.Available
  if (progress.revealedIds.includes(id) || progress.visitedIds.includes(id)) return DestStatus.Discovered
  return DestStatus.Locked
}

export function canEnterDestination(id: string, progress: ProgressState) {
  const status = getDestinationStatus(id, progress)
  return (
    status === DestStatus.Available ||
    status === DestStatus.Current ||
    status === DestStatus.Completed
  )
}

export function storyCompletion(progress: ProgressState) {
  const done = STORY_IDS.filter((id) => progress.completedIds.includes(id)).length
  return { done, total: STORY_IDS.length, ratio: done / STORY_IDS.length }
}

export function currentStoryChapter(progress: ProgressState) {
  const dest = destinations.find((item) => item.id === progress.currentDestinationId)
  if (!dest || dest.kind === 'minor' || dest.kind === 'hidden') {
    const next = nextAvailableId(progress)
    const fallback = destinations.find((item) => item.id === next)
    return fallback ?? dest ?? destinations[0]
  }
  return dest
}
