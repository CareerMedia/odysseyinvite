import { publicAsset } from '../utils/assets'

export const SoundCategory = {
  Music: 'music',
  Ambience: 'ambience',
  Effects: 'effects',
  Environment: 'environment',
  Ui: 'ui',
} as const

export type SoundCategoryId = (typeof SoundCategory)[keyof typeof SoundCategory]

export type SoundId =
  | 'ocean-night'
  | 'wind-soft'
  | 'ship-creaks'
  | 'cinematic-bed'
  | 'voyage-start'
  | 'map-unfurl'
  | 'discovery'
  | 'kraken'
  | 'ui-hover'
  | 'ui-select'

export type SoundDef = {
  id: SoundId
  category: SoundCategoryId
  file: string
  loop: boolean
  volume: number
}

/**
 * Data-driven catalog. Files are only requested if listed in
 * public/audio/manifest.json → available[]. Missing files fail silently
 * and the procedural engine continues the experience.
 */
export const soundCatalog: SoundDef[] = [
  { id: 'ocean-night', category: SoundCategory.Ambience, file: 'ocean-night.mp3', loop: true, volume: 0.42 },
  { id: 'wind-soft', category: SoundCategory.Ambience, file: 'wind-soft.mp3', loop: true, volume: 0.28 },
  { id: 'ship-creaks', category: SoundCategory.Effects, file: 'ship-creaks.mp3', loop: true, volume: 0.18 },
  { id: 'cinematic-bed', category: SoundCategory.Music, file: 'cinematic-bed.mp3', loop: true, volume: 0.22 },
  { id: 'voyage-start', category: SoundCategory.Effects, file: 'voyage-start.mp3', loop: false, volume: 0.45 },
  { id: 'map-unfurl', category: SoundCategory.Effects, file: 'map-unfurl.mp3', loop: false, volume: 0.4 },
  { id: 'discovery', category: SoundCategory.Effects, file: 'discovery.mp3', loop: false, volume: 0.4 },
  { id: 'kraken', category: SoundCategory.Effects, file: 'kraken.mp3', loop: false, volume: 0.42 },
  { id: 'ui-hover', category: SoundCategory.Ui, file: 'ui-hover.mp3', loop: false, volume: 0.18 },
  { id: 'ui-select', category: SoundCategory.Ui, file: 'ui-select.mp3', loop: false, volume: 0.22 },
]

export const soundFileUrl = (file: string) => publicAsset(`audio/${file}`)

export const cueToSound: Record<string, SoundId> = {
  hover: 'ui-hover',
  click: 'ui-select',
  chime: 'discovery',
  discover: 'discovery',
  paper: 'map-unfurl',
  depart: 'voyage-start',
  kraken: 'kraken',
}
