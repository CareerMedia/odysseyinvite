import type { Achievement } from '../types'

export const achievements: Achievement[] = [
  { id: 'kraken-encounter', title: 'Kraken Encounter', subtitle: 'A tentacle rose from the painted sea.', xp: 100, hidden: true },
  { id: 'wish-star', title: 'Wish Upon a Star', subtitle: 'A rare light answered your notice.', xp: 50, hidden: true },
  { id: 'ancient-artifact', title: 'Ancient Artifact', subtitle: 'An amphora waited beneath the painted waves.', xp: 50, hidden: true },
  { id: 'poseidon-trident', title: "Poseidon's Trident", subtitle: 'The sea-god left a mark on the chart.', xp: 100, hidden: true },
  { id: 'lost-treasure', title: 'Lost Treasure', subtitle: 'A chest that should not have been on the map.', xp: 100, hidden: true },
  { id: 'forbidden-island', title: 'You Have Way Too Much Time On Your Hands.', subtitle: 'Uncharted land, discovered anyway.', xp: 1000, hidden: true },
]

export const EASTER_EGG_IDS = ['kraken-encounter', 'wish-star', 'ancient-artifact', 'poseidon-trident', 'lost-treasure'] as const

export const getAchievement = (id: string) => achievements.find((item) => item.id === id)

export const allEggsFound = (unlocked: string[]) => EASTER_EGG_IDS.every((id) => unlocked.includes(id))
