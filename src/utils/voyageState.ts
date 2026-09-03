import { destinations, JOURNEY_ORDER, STORY_IDS } from '../data/destinations'
import { DestStatus, type DestStatusId, type ProgressState } from '../types'

export function journeyIndex(id: string) {
  return JOURNEY_ORDER.indexOf(id)
}

export function nextAvailableId(progress: ProgressState) {
  return JOURNEY_ORDER.find((id) => !progress.visitedIds.includes(id)) ?? null
}

export function nextMajorId(progress: ProgressState) {
  return (
    destinations.find(
      (item) =>
        (item.kind === 'major' || item.kind === 'finale') && !progress.visitedIds.includes(item.id),
    )?.id ?? null
  )
}

/** Map statuses: locked / available / visited / completed (interaction complete). */
export function getDestinationStatus(id: string, progress: ProgressState): DestStatusId {
  if (id === 'forbidden') {
    if (progress.completedIds.includes('forbidden')) return DestStatus.Completed
    if (progress.visitedIds.includes('forbidden')) return DestStatus.Visited
    if (progress.revealedIds.includes('forbidden')) {
      return progress.currentDestinationId === 'forbidden' ? DestStatus.Current : DestStatus.Available
    }
    return DestStatus.Locked
  }

  if (progress.currentDestinationId === id && !progress.visitedIds.includes(id)) return DestStatus.Current
  if (progress.completedIds.includes(id)) return DestStatus.Completed
  if (progress.visitedIds.includes(id)) {
    return progress.currentDestinationId === id ? DestStatus.Current : DestStatus.Visited
  }

  const next = nextAvailableId(progress)
  if (next === id) return DestStatus.Available
  if (progress.revealedIds.includes(id) || JOURNEY_ORDER.includes(id)) return DestStatus.Discovered
  return DestStatus.Locked
}

export function canEnterDestination(id: string, progress: ProgressState) {
  if (id === 'forbidden') {
    return (
      progress.revealedIds.includes('forbidden') ||
      progress.visitedIds.includes('forbidden') ||
      progress.completedIds.includes('forbidden')
    )
  }
  return JOURNEY_ORDER.includes(id)
}

export function chartedDestinationIds(progress: ProgressState) {
  const ids = new Set(JOURNEY_ORDER)
  if (progress.revealedIds.includes('forbidden') || progress.visitedIds.includes('forbidden')) {
    ids.add('forbidden')
  }
  return Array.from(ids)
}

export function storyCompletion(progress: ProgressState) {
  const done = STORY_IDS.filter((id) => progress.visitedIds.includes(id)).length
  return { done, total: STORY_IDS.length, ratio: done / Math.max(1, STORY_IDS.length) }
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

export function unlockOnVisit(progress: ProgressState, id: string): ProgressState {
  const visitedIds = progress.visitedIds.includes(id) ? progress.visitedIds : [...progress.visitedIds, id]
  const next = JOURNEY_ORDER.find((item) => !visitedIds.includes(item)) ?? null
  return {
    ...progress,
    currentDestinationId: id,
    visitedIds,
    revealedIds: Array.from(new Set([...progress.revealedIds, ...JOURNEY_ORDER, id, ...(next ? [next] : [])])),
    voyageComplete: visitedIds.includes('ithaca') ? true : progress.voyageComplete,
  }
}
