export const Scene = {
  Cinematic: 'cinematic',
  Departing: 'departing',
  Map: 'map',
  Chapter: 'chapter',
  Complete: 'complete',
} as const

export type SceneId = (typeof Scene)[keyof typeof Scene]

export const DestinationKind = {
  Major: 'major',
  Minor: 'minor',
  Finale: 'finale',
  Hidden: 'hidden',
} as const

export type DestinationKindId = (typeof DestinationKind)[keyof typeof DestinationKind]

export const DestStatus = {
  Locked: 'locked',
  Available: 'available',
  Current: 'current',
  Visited: 'visited',
  Completed: 'completed',
  Discovered: 'discovered',
} as const

export type DestStatusId = (typeof DestStatus)[keyof typeof DestStatus]

export type VisualType =
  | 'harbor'
  | 'fortress'
  | 'city'
  | 'temple'
  | 'trials'
  | 'oracle'
  | 'port'
  | 'ithaca'
  | 'cove'
  | 'deck'
  | 'feast'
  | 'cove2'
  | 'forbidden'

export type TransitionType = 'fog' | 'water' | 'light' | 'glitch' | 'sun' | 'cloud'

export type TimeOfDay =
  | 'predawn'
  | 'earlyMorning'
  | 'morning'
  | 'midMorning'
  | 'lateMorning'
  | 'midday'
  | 'earlyAfternoon'
  | 'afternoon'
  | 'lateAfternoon'
  | 'goldenHour'
  | 'twilight'

export type WeatherId =
  | 'clear'
  | 'mist'
  | 'windy'
  | 'stormDistant'
  | 'storm'
  | 'sunBreak'
  | 'oracleAnomaly'
  | 'goldenCalm'
  | 'clearMountainMist'

export type OceanIntensity = 'calm' | 'normal' | 'active' | 'stormy' | 'magical'

export type LightingMood =
  | 'moonlit'
  | 'sunriseHarbor'
  | 'coolSun'
  | 'warmCity'
  | 'mysticalGold'
  | 'lanternInterior'
  | 'goldenBright'
  | 'adventureSun'
  | 'uneasy'
  | 'oracleCyan'
  | 'epicHorizon'
  | 'sunsetGold'
  | 'twilightMap'
  | 'forbiddenRed'

export type AudioMood =
  | 'introNight'
  | 'oceanVoyage'
  | 'harborMorning'
  | 'readinessIsland'
  | 'cultureCity'
  | 'strengthsTemple'
  | 'belowDeck'
  | 'feast'
  | 'adventureIsland'
  | 'harborBreak'
  | 'harborSignal'
  | 'oracleAnomaly'
  | 'opportunitySea'
  | 'ithacaSunset'
  | 'completedTwilight'
  | 'mapDay'
  | 'mapTwilight'

export type TransitionKind =
  | 'fogWipe'
  | 'cloudPass'
  | 'oceanDive'
  | 'lightFlash'
  | 'sunFlare'
  | 'mapZoom'
  | 'parchmentReveal'
  | 'darkFade'
  | 'oracleGlitch'
  | 'waterSplash'

export type QualityLevel = 'high' | 'medium' | 'low'

export type ParticleMode = 'dust' | 'mist' | 'spray' | 'gold' | 'embers' | 'pollen' | 'magic' | 'oracle' | 'stars'

export type WorldState = {
  timeOfDay: TimeOfDay
  weather: WeatherId
  windIntensity: number
  fogIntensity: number
  oceanIntensity: OceanIntensity
  lightingMood: LightingMood
  particleDensity: number
  cameraMood: 'still' | 'drift' | 'push' | 'storm'
  audioMood: AudioMood
  particleMode: ParticleMode
}

export type DestinationEnvironment = {
  timeOfDay: TimeOfDay
  weather: WeatherId
  lightingMood: LightingMood
  fogIntensity: number
  windIntensity: number
  oceanIntensity: OceanIntensity
  audioMood: AudioMood
  particleMode: ParticleMode
  cameraMood: WorldState['cameraMood']
  transitionIn: TransitionKind
  transitionOut: TransitionKind
}

export type InteractionType =
  | 'crew'
  | 'beacon'
  | 'voices'
  | 'rest'
  | 'strengths'
  | 'crates'
  | 'feast'
  | 'trials'
  | 'signal'
  | 'oracle'
  | 'briefing'
  | 'reflection'
  | 'forbidden'

export type AgendaMoment = {
  time: string
  title: string
  detail: string
  presenters?: string
}

export type InteractionItem = {
  id: string
  label: string
}

export type DestinationAudio = {
  ambience: string
  enter: string
  complete: string
}

export type Destination = {
  id: string
  chapter: string
  chapterIndex: number
  mythicTitle: string
  actualTitle: string
  time: string
  timeRange: string
  presenter: string
  description: string
  subheading?: string
  headline: string
  narrative: string
  moments?: AgendaMoment[]
  position: { x: number; y: number }
  routePosition: number
  kind: DestinationKindId
  visualType: VisualType
  transition: TransitionType
  interaction: InteractionType
  items: InteractionItem[]
  completeTitle: string
  completeLine: string
  xp: number
  audio: DestinationAudio
}

export type Achievement = {
  id: string
  title: string
  subtitle: string
  xp: number
  hidden?: boolean
}

export type Toast = {
  id: string
  title: string
  subtitle: string
  xp: number
  kicker?: string
}

export type StrengthsPath = 'discovery' | 'mastery' | null

export type ProgressState = {
  introCompleted: boolean
  voyageStarted: boolean
  voyageComplete: boolean
  currentDestinationId: string
  visitedIds: string[]
  revealedIds: string[]
  completedIds: string[]
  earnedChapterXp: string[]
  xp: number
  unlockedAchievementIds: string[]
  strengthsPath: StrengthsPath
  soundEnabled: boolean
  soundMutedExplicitly: boolean
  soundChoiceMade: boolean
  mapGuidanceSeen: boolean
}
