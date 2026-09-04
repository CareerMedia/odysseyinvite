import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import gatheringIsland from '../assets/map/islands/gathering-of-the-crew.webp'
import readinessIsland from '../assets/map/islands/isle-of-readiness.webp'
import cultureIsland from '../assets/map/islands/kingdom-of-culture.webp'
import harbor1Island from '../assets/map/islands/safe-harbor-1.webp'
import strengthsIsland from '../assets/map/islands/temple-of-strengths.webp'
import quartermasterIsland from '../assets/map/islands/quartermasters-deck.webp'
import feastIsland from '../assets/map/islands/heros-feast.webp'
import trialsIsland from '../assets/map/islands/trials-of-the-crew.webp'
import harbor2Island from '../assets/map/islands/safe-harbor-2.webp'
import oracleIsland from '../assets/map/islands/oracle-of-ai.webp'
import opportunityIsland from '../assets/map/islands/sea-of-opportunity.webp'
import ithacaIsland from '../assets/map/islands/ithaca.webp'
import gatheringPlate from '../assets/environments/gathering/gathering-harbor.jpg'
import readinessPlate from '../assets/environments/readiness/isle-of-readiness.jpg'
import culturePlate from '../assets/environments/culture/kingdom-of-culture.jpg'
import { textures } from '../assets/textures'
import { destinations } from '../data/destinations'
import { MAP_WORLD, MAP_ZOOM, ROUTE_T, voyageOverviewPoints } from '../data/mapWorld'
import { useExperience } from '../hooks/ExperienceContext'
import { useMapCamera } from '../hooks/useMapCamera'
import { DestinationKind, DestStatus, Scene } from '../types'
import { nextAvailableId, nextMajorId, storyCompletion } from '../utils/voyageState'
import { AmbientParticles } from './AmbientParticles'
import { ForbiddenReveal, KrakenTentacle, MapDecor, MapEasterEggs } from './map/MapDecor'
import { MapClouds } from './map/MapClouds'
import { MapIsland } from './map/MapIsland'
import { MapOcean } from './map/MapOcean'
import { MapRoute } from './map/MapRoute'
import { MapShip } from './map/MapShip'

gsap.registerPlugin(MotionPathPlugin)

const ISLAND_ART: Record<string, string> = {
  prologue: gatheringIsland,
  readiness: readinessIsland,
  culture: cultureIsland,
  'harbor-1': harbor1Island,
  strengths: strengthsIsland,
  quartermaster: quartermasterIsland,
  feast: feastIsland,
  trials: trialsIsland,
  'harbor-2': harbor2Island,
  oracle: oracleIsland,
  opportunity: opportunityIsland,
  ithaca: ithacaIsland,
}

export function VoyageMap() {
  const {
    progress,
    arriveAt,
    revealAround,
    reducedMotion,
    isMobile,
    sound,
    requestDestination,
    enterChapter,
    statusOf,
    mapFocus,
    world,
    forbiddenReveal,
    endForbiddenReveal,
    lockedHint,
    setScene,
  } = useExperience()
  const mapShip = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const sailing = useRef(false)
  const [mapReady, setMapReady] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const [pulseId, setPulseId] = useState<string | null>(null)
  const camera = useMapCamera({ reduced: reducedMotion })

  const current = useMemo(
    () => destinations.find((item) => item.id === progress.currentDestinationId) ?? destinations[0],
    [progress.currentDestinationId],
  )
  const nextOpenId = nextMajorId(progress) ?? nextAvailableId(progress)
  const completion = storyCompletion(progress)
  const harborAlert = progress.visitedIds.includes('harbor-2') && !progress.visitedIds.includes('oracle')
  const reveal = progress.voyageComplete
    ? 1
    : Math.max(
        ROUTE_T[current.id] ?? 0,
        ...progress.visitedIds.map((id) => ROUTE_T[id] ?? 0),
        nextOpenId === 'ithaca' ? (ROUTE_T.ithaca ?? 0) : 0,
      )

  useEffect(() => {
    return () => {
      sailing.current = false
    }
  }, [])

  useLayoutEffect(() => {
    let cancelled = false
    const place = () => {
      const path = pathRef.current
      const ship = mapShip.current
      const view = camera.viewportRef.current
      if (cancelled || !path || !ship || !view) return
      if (path.getBBox().width < 1 || view.clientWidth < 8) {
        requestAnimationFrame(place)
        return
      }
      gsap.set(ship, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: current.routePosition,
          end: current.routePosition,
        },
      })
      if (!mapReady) {
        if (progress.voyageComplete) camera.focusDestination('ithaca', 1.1, false)
        else camera.showOverview(voyageOverviewPoints(current.id, nextOpenId), false)
        camera.apply()
      }
      setMapReady(true)
    }
    place()
    return () => {
      cancelled = true
    }
  }, [camera, current.id, current.routePosition, mapReady, nextOpenId, progress.voyageComplete])

  useEffect(() => {
    if (!mapReady || progress.visitedIds.length > 0) return
    window.setTimeout(() => sound.play('paper'), reducedMotion ? 80 : 400)
  }, [mapReady, progress.visitedIds.length, reducedMotion, sound])

  useEffect(() => {
    ;[gatheringPlate, readinessPlate, culturePlate].forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (!mapReady || !mapFocus) return
    if (mapFocus.mode === 'full') {
      camera.showOverview(voyageOverviewPoints(current.id, nextOpenId))
      return
    }
    if (mapFocus.mode === 'ship') {
      camera.focusShip(current.id)
      return
    }
    const id = mapFocus.id ?? current.id
    camera.focusDestination(
      id,
      id === 'ithaca'
        ? 1.12
        : id === 'prologue' || id === 'readiness' || id === 'culture' || id === 'strengths' || id === 'trials' || id === 'oracle' || id === 'opportunity'
          ? 1.1
          : 1.08,
    )
    setPulseId(id)
    const timer = window.setTimeout(() => setPulseId(null), 2200)
    return () => window.clearTimeout(timer)
  }, [camera, current.id, mapFocus, mapFocus?.nonce, mapReady, nextOpenId])

  const sailTo = (id: string) => {
    if (!requestDestination(id)) return
    const target = destinations.find((item) => item.id === id)
    const path = pathRef.current
    const ship = mapShip.current
    if (!target || !path || !ship || sailing.current) {
      enterChapter(id)
      return
    }

    revealAround(id)
    camera.focusDestination(id, id === 'ithaca' ? 1.12 : 1.08)
    if (reducedMotion || target.id === current.id) {
      arriveAt(id)
      enterChapter(id)
      return
    }

    sailing.current = true
    sound.play('paper')
    const start = current.routePosition
    const end = target.routePosition
    const duration = Math.max(1.4, Math.abs(end - start) * 8)

    gsap.to(ship, {
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start,
        end,
      },
      duration,
      ease: 'power1.inOut',
      onComplete: () => {
        sailing.current = false
        arriveAt(id)
        enterChapter(id)
        sound.play('chime')
      },
    })
  }

  const onOceanClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (camera.didDrag() || target.closest('.map-island, .map-egg, .kraken, .map-zoom')) return
    const world = camera.worldRef.current
    if (!world) return
    const rect = world.getBoundingClientRect()
    const zoom = camera.getCamera().zoom
    setRipples((currentRipples) => [
      ...currentRipples.slice(-4),
      {
        id: Date.now(),
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom,
      },
    ])
  }

  return (
    <div
      className={`map-world ${mapReady ? 'is-ready' : ''} time-${world.timeOfDay} ${progress.voyageComplete ? 'is-complete' : ''} ${world.timeOfDay === 'twilight' ? 'is-twilight' : ''} ${progress.revealedIds.includes('forbidden') && !progress.completedIds.includes('forbidden') ? 'is-rising' : ''} ${forbiddenReveal ? 'is-revealing' : ''}`}
      ref={camera.viewportRef}
      onClick={onOceanClick}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="map-camera" ref={camera.worldRef} style={{ width: MAP_WORLD.width, height: MAP_WORLD.height }}>
        <MapOcean complete={progress.voyageComplete} />
        <svg className="map-art" viewBox={`0 0 ${MAP_WORLD.width} ${MAP_WORLD.height}`} width={MAP_WORLD.width} height={MAP_WORLD.height} role="img" aria-label="Illustrated voyage map of the Career Center Odyssey">
          <MapDecor
            unstable={world.weather === 'oracleAnomaly' || forbiddenReveal || world.weather === 'storm' || harborAlert}
            settled={progress.voyageComplete || progress.currentDestinationId === 'ithaca'}
          />
          <MapRoute pathRef={pathRef} complete={progress.voyageComplete} reveal={reveal} finalLeg={nextOpenId === 'ithaca' || progress.voyageComplete} />
          <MapEasterEggs />
          <KrakenTentacle unlocked={progress.unlockedAchievementIds.includes('kraken-encounter')} />
        </svg>
        <div className="map-island-layer">
          {destinations.map((dest) => {
            const status = statusOf(dest.id)
            if (dest.kind === DestinationKind.Hidden && status === DestStatus.Locked) return null
            const isNext = dest.id === nextOpenId
            return (
              <MapIsland
                key={dest.id}
                dest={dest}
                status={status}
                image={ISLAND_ART[dest.id]}
                highlighted={isNext || dest.id === pulseId || dest.id === current.id}
                lockedText={lockedHint === dest.id ? (dest.id === 'forbidden' ? 'Uncharted' : 'Route not yet revealed') : undefined}
                showLabel
                anomaly={dest.id === 'harbor-2' && harborAlert}
                onSelect={sailTo}
              />
            )
          })}
        </div>
        <MapClouds clearedIds={[...progress.visitedIds, ...progress.completedIds, ...(nextOpenId ? [nextOpenId] : [])]} />
        <svg className="map-ship-layer" viewBox={`0 0 ${MAP_WORLD.width} ${MAP_WORLD.height}`} width={MAP_WORLD.width} height={MAP_WORLD.height} aria-hidden="true">
          <defs>
            <pattern id="mapWood" patternUnits="userSpaceOnUse" width="180" height="180">
              <image href={textures.wood} width="180" height="180" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>
          <MapShip shipRef={mapShip} />
        </svg>
        {ripples.map((ripple) => (
          <span key={ripple.id} className="map-ripple" style={{ left: ripple.x, top: ripple.y }} />
        ))}
      </div>
      <div className="map-zoom" aria-label="Chart zoom">
        <button type="button" onClick={() => camera.zoomTo(camera.getCamera().zoom + 0.08)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => camera.zoomTo(camera.getCamera().zoom - 0.08)} aria-label="Zoom out">
          −
        </button>
        <button
          type="button"
          onClick={() => camera.showOverview(voyageOverviewPoints(current.id, nextOpenId))}
          aria-label="Reset chart view"
        >
          {Math.round(MAP_ZOOM.default * 100)}
        </button>
      </div>
      <AmbientParticles mode="map" reduced={reducedMotion} isMobile={isMobile} />
      {forbiddenReveal ? <ForbiddenReveal onDone={endForbiddenReveal} /> : null}
      {progress.voyageComplete ? (
        <div className="voyage-complete-banner">
          <p>Voyage complete</p>
          <span>
            {completion.done} / {completion.total} destinations · {progress.xp} Odyssey XP · {progress.unlockedAchievementIds.length} achievements
          </span>
          <button className="cta-primary" type="button" onClick={() => setScene(Scene.Complete)}>
            Odyssey Complete
          </button>
        </div>
      ) : null}
    </div>
  )
}
