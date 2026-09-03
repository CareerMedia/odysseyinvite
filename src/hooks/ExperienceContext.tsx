import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import { allEggsFound, getAchievement } from '../data/achievements'
import { DESTINATION_ENV } from '../data/world'
import { destinations, getDestination, JOURNEY_ORDER } from '../data/destinations'
import { Scene, type ProgressState, type QualityLevel, type SceneId, type StrengthsPath, type Toast, type TransitionKind, type WorldState } from '../types'
import type { WipeState } from '../components/world/SceneTransition'
import { detectQuality } from '../utils/quality'
import { delay, deriveWorld } from '../utils/worldDerive'
import { preloadNextDestination, preloadStage } from '../utils/preload'
import { getSoundEngine } from '../utils/sound'
import { loadProgress, resetProgress, saveProgress } from '../utils/storage'
import { canEnterDestination, getDestinationStatus, nextAvailableId, nextMajorId, unlockOnVisit } from '../utils/voyageState'
import { useIsMobile } from './useIsMobile'
import { useReducedMotion } from './useReducedMotion'

type MapFocus = { mode: 'destination' | 'ship' | 'full'; id?: string } | null

type ExperienceContextValue = {
  scene: SceneId
  setScene: (scene: SceneId) => void
  progress: ProgressState
  toasts: Toast[]
  activeChapterId: string | null
  detailsOpen: boolean
  skipToTitle: boolean
  reducedMotion: boolean
  isMobile: boolean
  isDev: boolean
  mapFocus: MapFocus
  lockedHint: string | null
  world: WorldState
  quality: QualityLevel
  pageHidden: boolean
  uiHidden: boolean
  wipe: WipeState
  forbiddenReveal: boolean
  sound: ReturnType<typeof getSoundEngine>
  beginVoyage: () => void
  enterWorld: (withSound: boolean) => void
  completeIntro: () => void
  requestDestination: (id: string) => boolean
  advanceVoyage: () => void
  arriveAt: (id: string) => void
  enterChapter: (id: string) => void
  closeChapter: () => void
  completeChapter: (id: string) => void
  revealAround: (id: string) => void
  unlockAchievement: (id: string) => void
  setStrengthsPath: (path: Exclude<StrengthsPath, null>) => void
  setSoundEnabled: (enabled: boolean) => void
  toggleDetails: (open?: boolean) => void
  replayOpening: () => void
  viewCompletedVoyage: () => void
  resetVoyage: () => void
  jumpTo: (target: SceneId | string) => void
  clearLockedHint: () => void
  endForbiddenReveal: () => void
  markMapGuidanceSeen: () => void
  openingKey: number
  statusOf: (id: string) => ReturnType<typeof getDestinationStatus>
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

function neighborsOf(id: string) {
  const index = destinations.findIndex((item) => item.id === id)
  if (index < 0) return [id]
  return Array.from(
    new Set(
      destinations
        .filter((item) => item.kind !== 'hidden')
        .slice(Math.max(0, index - 1), Math.min(destinations.length, index + 2))
        .map((item) => item.id),
    ),
  )
}

function readDevFlag() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('dev') === 'true'
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const isDev = useMemo(() => readDevFlag(), [])
  const sound = useMemo(() => getSoundEngine(), [])
  const initial = useMemo(() => loadProgress(), [])
  const [progress, setProgress] = useState<ProgressState>(initial)
  const [scene, setScene] = useState<SceneId>(() => {
    if (initial.voyageComplete) return Scene.Map
    return initial.voyageStarted ? Scene.Map : Scene.Cinematic
  })
  const [toasts, setToasts] = useState<Toast[]>([])
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mapFocus, setMapFocus] = useState<MapFocus>(null)
  const [lockedHint, setLockedHint] = useState<string | null>(null)
  const [wipe, setWipe] = useState<WipeState>(null)
  const [uiHidden, setUiHidden] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)
  const [forbiddenReveal, setForbiddenReveal] = useState(false)
  const [openingKey, setOpeningKey] = useState(0)
  const quality = useMemo(() => detectQuality(isMobile, reducedMotion), [isMobile, reducedMotion])
  const persistTimer = useRef<number | null>(null)
  const transitionLock = useRef(false)
  const world = useMemo(
    () => deriveWorld(scene, activeChapterId, progress, quality),
    [activeChapterId, progress, quality, scene],
  )

  useEffect(() => {
    preloadStage(1)
    const later = window.setTimeout(() => preloadStage(2), 1200)
    return () => window.clearTimeout(later)
  }, [])

  useEffect(() => {
    const onChange = () => setPageHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  useEffect(() => {
    if (!progress.soundEnabled) return
    void sound.setMood(world.audioMood)
  }, [progress.soundEnabled, sound, world.audioMood])

  const updateProgress = useCallback((recipe: (current: ProgressState) => ProgressState, immediate = false) => {
    setProgress((current) => {
      const next = recipe(current)
      if (persistTimer.current) window.clearTimeout(persistTimer.current)
      if (immediate) saveProgress(next)
      else persistTimer.current = window.setTimeout(() => saveProgress(next), 80)
      return next
    })
  }, [])

  const pushToast = useCallback((title: string, subtitle: string, xp: number, kicker?: string) => {
    const toast: Toast = { id: `${title}-${Date.now()}`, title, subtitle, xp, kicker }
    setToasts((current) => [...current, toast])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, 5200)
  }, [])

  const completeIntro = useCallback(() => {
    updateProgress((current) => ({ ...current, introCompleted: true }))
  }, [updateProgress])

  const enterWorld = useCallback(
    (withSound: boolean) => {
      updateProgress((current) => ({
        ...current,
        soundChoiceMade: true,
        soundEnabled: withSound,
        soundMutedExplicitly: !withSound,
      }))
      if (withSound) {
        void sound.setEnabled(true).then(() => {
          void sound.setMood('introNight')
        })
      }
    },
    [sound, updateProgress],
  )

  const beginVoyage = useCallback(() => {
    setDetailsOpen(false)
    setScene(Scene.Departing)
    updateProgress((current) => {
      const enableSound = current.soundEnabled || !current.soundMutedExplicitly
      if (enableSound) {
        void sound.setEnabled(true).then(() => {
          sound.play('depart')
          void sound.setMood('oceanVoyage')
          sound.setAmbienceProximity(1, 2.2)
          sound.intensify('wind', 1.35, 1.6)
        })
      }
      return {
        ...current,
        introCompleted: true,
        voyageStarted: true,
        soundChoiceMade: true,
        soundEnabled: enableSound ? true : current.soundEnabled,
      }
    })
  }, [sound, updateProgress])

  const revealAround = useCallback(
    (id: string) => {
      updateProgress((current) => ({
        ...current,
        revealedIds: Array.from(new Set([...current.revealedIds, ...JOURNEY_ORDER, ...neighborsOf(id), id])),
      }))
    },
    [updateProgress],
  )

  const arriveAt = useCallback(
    (id: string) => {
      updateProgress((current) => ({
        ...current,
        currentDestinationId: id,
        visitedIds: current.visitedIds.includes(id) ? current.visitedIds : [...current.visitedIds, id],
        revealedIds: Array.from(new Set([...current.revealedIds, ...JOURNEY_ORDER, ...neighborsOf(id), id])),
      }))
    },
    [updateProgress],
  )

  const runTransition = useCallback(
    async (type: TransitionKind, action: () => void) => {
      if (transitionLock.current) {
        action()
        return
      }
      transitionLock.current = true
      setUiHidden(true)
      setWipe({ type, phase: 'cover' })
      await delay(reducedMotion ? 160 : 720)
      action()
      setWipe({ type, phase: 'reveal' })
      await delay(reducedMotion ? 140 : 640)
      setWipe(null)
      setUiHidden(false)
      transitionLock.current = false
    },
    [reducedMotion],
  )

  const enterChapter = useCallback(
    (id: string) => {
      const dest = getDestination(id)
      const type = DESTINATION_ENV[id]?.transitionIn ?? 'fogWipe'
      sound.play('click')
      updateProgress((current) => unlockOnVisit(current, id), true)
      void runTransition(type, () => {
        setActiveChapterId(id)
        setScene(Scene.Chapter)
        setMapFocus({ mode: 'destination', id })
        if (dest) sound.play(dest.audio.enter === 'oracle-enter' ? 'discover' : 'chime')
        preloadNextDestination(id)
      })
    },
    [runTransition, sound, updateProgress],
  )

  const requestDestination = useCallback(
    (id: string) => {
      if (!canEnterDestination(id, progress)) {
        setLockedHint(id)
        window.setTimeout(() => setLockedHint((current) => (current === id ? null : current)), 1800)
        return false
      }
      setLockedHint(null)
      return true
    },
    [progress],
  )

  const advanceVoyage = useCallback(() => {
    const next = nextMajorId(progress) ?? nextAvailableId(progress)
    if (!next) {
      setActiveChapterId(null)
      setScene(Scene.Complete)
      setMapFocus({ mode: 'full' })
      return
    }
    enterChapter(next)
  }, [enterChapter, progress])

  const closeChapter = useCallback(() => {
    const type = activeChapterId ? DESTINATION_ENV[activeChapterId]?.transitionOut ?? 'cloudPass' : 'cloudPass'
    void runTransition(type, () => {
      setActiveChapterId(null)
      setScene(Scene.Map)
      setMapFocus({ mode: 'full' })
    })
  }, [activeChapterId, runTransition])

  const completeChapter = useCallback(
    (id: string) => {
      const dest = getDestination(id)
      let award = 0
      updateProgress((current) => {
        const already = current.completedIds.includes(id)
        award = dest && !already && !current.earnedChapterXp.includes(id) ? dest.xp : 0
        const completedIds = already ? current.completedIds : [...current.completedIds, id]
        const earnedChapterXp = award ? [...current.earnedChapterXp, id] : current.earnedChapterXp
        const visited = unlockOnVisit(current, id)
        return {
          ...visited,
          completedIds,
          earnedChapterXp,
          xp: current.xp + award,
        }
      }, true)
      sound.play('discover')
      if (dest && award > 0) pushToast(dest.completeTitle, dest.completeLine, award, dest.completeTitle)
    },
    [pushToast, sound, updateProgress],
  )

  const unlockAchievement = useCallback(
    (id: string) => {
      const achievement = getAchievement(id)
      if (!achievement) return
      let awarded = false
      let unlockedAll = false
      updateProgress((current) => {
        if (current.unlockedAchievementIds.includes(id)) return current
        awarded = true
        const unlockedAchievementIds = [...current.unlockedAchievementIds, id]
        unlockedAll = allEggsFound(unlockedAchievementIds)
        return {
          ...current,
          xp: current.xp + achievement.xp,
          unlockedAchievementIds,
          revealedIds: unlockedAll
            ? Array.from(new Set([...current.revealedIds, 'forbidden']))
            : current.revealedIds,
        }
      }, true)
      if (!awarded) return
      pushToast(achievement.title, achievement.subtitle, achievement.xp, 'Achievement unlocked')
      sound.play(id === 'kraken-encounter' ? 'kraken' : 'discover')
      if (unlockedAll) {
        setForbiddenReveal(true)
        window.setTimeout(() => {
          pushToast('Uncharted Land Discovered', 'The Forbidden Island rises from the fog.', 0)
        }, 1600)
      }
    },
    [pushToast, sound, updateProgress],
  )

  const setStrengthsPath = useCallback(
    (path: Exclude<StrengthsPath, null>) => {
      updateProgress((current) => ({ ...current, strengthsPath: path }))
    },
    [updateProgress],
  )

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      updateProgress((current) => ({
        ...current,
        soundEnabled: enabled,
        soundMutedExplicitly: !enabled,
        soundChoiceMade: true,
      }))
      void sound.setEnabled(enabled)
      if (enabled) {
        void sound.setMood(
          scene === Scene.Map || scene === Scene.Complete || scene === Scene.Chapter ? 'mapDay' : 'introNight',
        )
      }
    },
    [scene, sound, updateProgress],
  )

  const toggleDetails = useCallback((open?: boolean) => {
    setDetailsOpen((current) => (open === undefined ? !current : open))
  }, [])

  const replayOpening = useCallback(() => {
    setActiveChapterId(null)
    setWipe(null)
    setUiHidden(false)
    setDetailsOpen(false)
    setMapFocus(null)
    gsap.killTweensOf('.opening-stage, .opening-stage *, .intro, .intro *, .ocean, .ocean *, .title-card, .reveal-layer, .intro-veil, .prologue-layer')
    setOpeningKey((value) => value + 1)
    setScene(Scene.Cinematic)
  }, [])

  const viewCompletedVoyage = useCallback(() => {
    setActiveChapterId(null)
    setScene(Scene.Map)
    setMapFocus({ mode: 'destination', id: 'ithaca' })
  }, [])

  const resetVoyage = useCallback(() => {
    const next = resetProgress()
    setProgress(next)
    setActiveChapterId(null)
    setScene(Scene.Cinematic)
    setMapFocus(null)
  }, [])

  useEffect(() => {
    if (!isDev) return
    const host = window as Window & { resetOdyssey?: () => void }
    host.resetOdyssey = resetVoyage
    return () => {
      delete host.resetOdyssey
    }
  }, [isDev, resetVoyage])

  const jumpTo = useCallback((target: SceneId | string) => {
    if (target === Scene.Cinematic || target === Scene.Departing || target === Scene.Map || target === Scene.Complete) {
      setActiveChapterId(null)
      setScene(target)
      return
    }
    if (target === 'intro') {
      setActiveChapterId(null)
      setScene(Scene.Cinematic)
      return
    }
    if (getDestination(target)) {
      const index = JOURNEY_ORDER.indexOf(target)
      const prior = index > 0 ? JOURNEY_ORDER.slice(0, index) : []
      updateProgress((current) => unlockOnVisit({
        ...current,
        voyageStarted: true,
        introCompleted: true,
        visitedIds: Array.from(new Set([...current.visitedIds, ...prior])),
        revealedIds: Array.from(new Set([...current.revealedIds, ...prior, target])),
      }, target), true)
      setActiveChapterId(target)
      setScene(Scene.Chapter)
    }
  }, [updateProgress])

  const statusOf = useCallback(
    (id: string) => getDestinationStatus(id, progress),
    [progress],
  )

  const value = useMemo<ExperienceContextValue>(
    () => ({
      scene,
      setScene,
      progress,
      toasts,
      activeChapterId,
      detailsOpen,
      skipToTitle: progress.introCompleted && !progress.voyageStarted,
      reducedMotion,
      isMobile,
      isDev,
      mapFocus,
      lockedHint,
      world,
      quality,
      pageHidden,
      uiHidden,
      wipe,
      forbiddenReveal,
      sound,
      beginVoyage,
      enterWorld,
      completeIntro,
      requestDestination,
      advanceVoyage,
      arriveAt,
      enterChapter,
      closeChapter,
      completeChapter,
      revealAround,
      unlockAchievement,
      setStrengthsPath,
      setSoundEnabled,
      toggleDetails,
      replayOpening,
      viewCompletedVoyage,
      resetVoyage,
      jumpTo,
      clearLockedHint: () => setLockedHint(null),
      endForbiddenReveal: () => setForbiddenReveal(false),
      markMapGuidanceSeen: () => updateProgress((current) => ({ ...current, mapGuidanceSeen: true }), true),
      openingKey,
      statusOf,
    }),
    [
      activeChapterId,
      advanceVoyage,
      arriveAt,
      beginVoyage,
      closeChapter,
      completeChapter,
      completeIntro,
      detailsOpen,
      enterChapter,
      enterWorld,
      forbiddenReveal,
      isDev,
      isMobile,
      jumpTo,
      lockedHint,
      openingKey,
      mapFocus,
      pageHidden,
      progress,
      quality,
      reducedMotion,
      replayOpening,
      requestDestination,
      resetVoyage,
      revealAround,
      scene,
      setSoundEnabled,
      setStrengthsPath,
      sound,
      statusOf,
      toasts,
      toggleDetails,
      uiHidden,
      unlockAchievement,
      viewCompletedVoyage,
      wipe,
      world,
    ],
  )

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const value = useContext(ExperienceContext)
  if (!value) throw new Error('useExperience must be used within ExperienceProvider')
  return value
}
