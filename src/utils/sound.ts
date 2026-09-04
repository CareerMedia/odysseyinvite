import {
  cueToSound,
  soundCatalog,
  soundFileUrl,
  SoundCategory,
  type SoundCategoryId,
  type SoundId,
} from '../data/audio'
import { AUDIO_MOODS } from '../data/world'
import type { AudioMood } from '../types'
import { publicAsset } from './assets'

type CueName = 'hover' | 'click' | 'chime' | 'discover' | 'paper' | 'depart' | 'kraken'
type AmbienceMode = 'ocean' | 'map' | 'oracle'

type CategoryGains = Record<SoundCategoryId, GainNode>

function createNoiseBuffer(ctx: AudioContext, seconds = 8) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1
    last = last * 0.97 + white * 0.03
    data[i] = last * 2.4
  }
  return buffer
}

function fadeGain(gain: GainNode, value: number, duration: number, ctx: AudioContext) {
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, value), now + Math.max(0.04, duration))
}

export class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private categories: CategoryGains | null = null
  private enabled = false
  private unlocked = false
  private mode: AmbienceMode | 'silent' = 'silent'
  private proximity = 0.35
  private ambience: AudioNode[] = []
  private fileNodes = new Map<SoundId, { el: HTMLAudioElement; gain: GainNode; source: MediaElementAudioSourceNode }>()
  private available = new Set<SoundId>()
  private manifestLoaded = false
  private eventTimer: number | null = null
  private currentMood: AudioMood | null = null
  private cultureAttached = false
  private templeAttached = false
  private deckAttached = false
  private feastAttached = false
  private trialsAttached = false
  private harborAttached = false
  private harborAnomalyAttached = false
  private oracleAttached = false
  private opportunityAttached = false
  private ithacaAttached = false
  private volumes = {
    master: 0.62,
    music: 0.7,
    ambience: 1,
    effects: 0.85,
  }

  get isEnabled() {
    return this.enabled
  }

  async unlock() {
    if (this.unlocked && this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume()
      return
    }
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.volumes.master
    this.master.connect(this.ctx.destination)
    this.categories = {
      music: this.ctx.createGain(),
      ambience: this.ctx.createGain(),
      effects: this.ctx.createGain(),
      environment: this.ctx.createGain(),
      ui: this.ctx.createGain(),
    }
    this.categories.music.gain.value = this.volumes.music
    this.categories.ambience.gain.value = this.volumes.ambience
    this.categories.effects.gain.value = this.volumes.effects
    this.categories.environment.gain.value = 0.8
    this.categories.ui.gain.value = 0.7
    Object.values(this.categories).forEach((node) => node.connect(this.master!))
    this.unlocked = true
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    await this.loadManifest()
  }

  async setEnabled(next: boolean) {
    this.enabled = next
    if (next) {
      await this.unlock()
      if (this.mode !== 'silent') await this.startAmbience(this.mode)
    } else {
      this.stopAmbience()
      this.fileNodes.forEach((node) => {
        node.el.pause()
      })
    }
  }

  setMuted(muted: boolean) {
    void this.setEnabled(!muted)
  }

  setMasterVolume(value: number) {
    this.volumes.master = value
    if (this.master && this.ctx) fadeGain(this.master, value, 0.25, this.ctx)
  }

  setMusicVolume(value: number) {
    this.volumes.music = value
    if (this.categories && this.ctx) fadeGain(this.categories.music, value, 0.25, this.ctx)
  }

  setAmbientVolume(value: number) {
    this.volumes.ambience = value
    if (this.categories && this.ctx) fadeGain(this.categories.ambience, value, 0.25, this.ctx)
  }

  setEffectsVolume(value: number) {
    this.volumes.effects = value
    if (this.categories && this.ctx) fadeGain(this.categories.effects, value, 0.25, this.ctx)
  }

  async setMood(mood: AudioMood) {
    const spec = AUDIO_MOODS[mood]
    if (!spec) return
    const same = this.currentMood === mood
    this.currentMood = mood
    if (!this.enabled) return
    if (!same && this.mode !== spec.bed) {
      if (this.categories && this.ctx) fadeGain(this.categories.ambience, 0.0001, spec.duration * 0.4, this.ctx)
      await new Promise((resolve) => window.setTimeout(resolve, spec.duration * 400))
      await this.startAmbience(spec.bed)
    } else if (this.mode === 'silent') {
      await this.startAmbience(spec.bed)
    }
    if (this.categories && this.ctx) {
      fadeGain(this.categories.music, this.volumes.music * spec.music, spec.duration, this.ctx)
      fadeGain(this.categories.ambience, this.volumes.ambience * spec.ambience, spec.duration, this.ctx)
    }
    if (mood === 'cultureCity') this.attachCultureColor()
    if (mood === 'strengthsTemple') this.attachTempleColor()
    if (mood === 'belowDeck') this.attachDeckColor()
    if (mood === 'feast') this.attachFeastColor()
    if (mood === 'adventureIsland') this.attachTrialsColor()
    if (mood === 'harborSignal') this.attachHarborColor()
    if (mood === 'oracleAnomaly') this.attachOracleColor()
    if (mood === 'opportunitySea') this.attachOpportunityColor()
    if (mood === 'ithacaSunset') this.attachIthacaColor()
  }

  playPanned(cue: CueName, pan: number) {
    this.play(cue)
    if (!this.ctx || !this.categories) return
    try {
      const panner = this.ctx.createStereoPanner()
      panner.pan.value = Math.max(-1, Math.min(1, pan))
      // Procedural tones already routed; a short extra tick carries the motion.
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.frequency.value = 520
      gain.gain.value = 0.012
      osc.connect(gain)
      gain.connect(panner)
      panner.connect(this.categories.environment)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.18)
    } catch {
      /* mono fallback */
    }
  }

  async startAmbience(mode: AmbienceMode, options?: { distant?: boolean }) {
    this.mode = mode
    this.proximity = options?.distant ? 0.28 : mode === 'ocean' ? 0.72 : 0.55
    if (!this.enabled) return
    await this.unlock()
    if (!this.ctx || !this.master || !this.categories) return
    this.stopAmbience(false)
    this.startProceduralBed(mode)
    await this.startFileLoops(mode === 'oracle' ? 'map' : mode)
    this.scheduleEnvironment()
  }

  stopAmbience(resetMode = true) {
    this.ambience.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') node.stop()
        node.disconnect()
      } catch {
        /* already stopped */
      }
    })
    this.ambience = []
    ;(['ocean-night', 'wind-soft', 'ship-creaks', 'cinematic-bed'] as SoundId[]).forEach((id) => {
      this.stopSound(id)
    })
    if (this.eventTimer) {
      window.clearTimeout(this.eventTimer)
      this.eventTimer = null
    }
    this.cultureAttached = false
    this.templeAttached = false
    this.deckAttached = false
    this.feastAttached = false
    this.trialsAttached = false
    this.harborAttached = false
    this.harborAnomalyAttached = false
    this.oracleAttached = false
    this.opportunityAttached = false
    this.ithacaAttached = false
    if (resetMode) this.mode = 'silent'
  }

  setAmbienceProximity(value: number, duration = 2.4) {
    this.proximity = value
    if (!this.ctx) return
    this.ambience.forEach((node) => {
      if (node instanceof GainNode && node.gain) {
        fadeGain(node, node.gain.value * (0.6 + value * 0.7), duration, this.ctx!)
      }
    })
    const bed = this.fileNodes.get('ocean-night')
    const wind = this.fileNodes.get('wind-soft')
    const music = this.fileNodes.get('cinematic-bed')
    if (bed && this.ctx) fadeGain(bed.gain, 0.16 + value * 0.28, duration, this.ctx)
    if (wind && this.ctx) fadeGain(wind.gain, 0.08 + value * 0.18, duration, this.ctx)
    if (music && this.ctx) fadeGain(music.gain, 0.04 + value * 0.14, duration, this.ctx)
  }

  intensify(kind: 'wind' | 'music', amount = 1.25, duration = 1.2) {
    if (!this.ctx || !this.categories) return
    if (kind === 'wind') {
      const wind = this.fileNodes.get('wind-soft')
      if (wind) fadeGain(wind.gain, wind.gain.gain.value * amount, duration, this.ctx)
    }
    if (kind === 'music') {
      fadeGain(this.categories.music, this.volumes.music * amount, duration, this.ctx)
    }
  }

  playSound(id: SoundId) {
    if (!this.enabled || !this.ctx || !this.categories) return
    const def = soundCatalog.find((item) => item.id === id)
    if (def && this.available.has(id)) {
      void this.playFile(id, def.category, def.volume, def.loop)
      return
    }
    this.playProcedural(id)
  }

  stopSound(id: SoundId) {
    const node = this.fileNodes.get(id)
    if (!node || !this.ctx) return
    fadeGain(node.gain, 0.0001, 0.4, this.ctx)
    window.setTimeout(() => {
      node.el.pause()
    }, 420)
  }

  fadeIn(id: SoundId, duration: number) {
    const node = this.fileNodes.get(id)
    if (node && this.ctx) fadeGain(node.gain, 0.3, duration, this.ctx)
    else this.playSound(id)
  }

  fadeOut(id: SoundId, duration: number) {
    const node = this.fileNodes.get(id)
    if (node && this.ctx) fadeGain(node.gain, 0.0001, duration, this.ctx)
  }

  play(cue: CueName) {
    const id = cueToSound[cue]
    if (id) this.playSound(id)
    else this.playProcedural(cue as SoundId)
  }

  playTrial(kind: 'trust' | 'communicate' | 'collaborate') {
    if (!this.enabled) return
    this.playProcedural(kind)
  }

  playOracle(kind: 'ask' | 'evaluate' | 'create') {
    if (!this.enabled) return
    this.playProcedural(kind)
  }

  playBriefing(kind: 'terrain' | 'role' | 'mission') {
    if (!this.enabled) return
    this.playProcedural(kind)
  }

  playReflection(kind: 'discover' | 'carry' | 'next') {
    if (!this.enabled) return
    this.playProcedural(`reflect-${kind}`)
  }

  playIthacaArrive() {
    if (!this.enabled) return
    this.playProcedural('ithaca-arrive')
  }

  playHarborInspect() {
    if (!this.enabled) return
    this.playProcedural('harbor-inspect')
  }

  cueHarborSignal() {
    if (!this.enabled || !this.ctx || !this.categories) return
    const now = this.ctx.currentTime
    const amb = this.categories.ambience
    const current = amb.gain.value
    amb.gain.cancelScheduledValues(now)
    amb.gain.setValueAtTime(current, now)
    amb.gain.linearRampToValueAtTime(Math.max(0.0001, current * 0.22), now + 0.18)
    amb.gain.linearRampToValueAtTime(Math.max(0.0001, current * 0.68), now + 0.95)
    this.tone(58, now + 0.35, 2.4, 0.02, 'sine', SoundCategory.Music)
    this.tone(87, now + 0.5, 2.1, 0.012, 'triangle', SoundCategory.Effects)
    this.tone(174, now + 0.72, 1.6, 0.01, 'sine', SoundCategory.Effects)
    this.attachHarborAnomaly()
  }

  dispose() {
    this.stopAmbience()
    this.fileNodes.forEach((node) => {
      node.el.pause()
      node.el.src = ''
    })
    this.fileNodes.clear()
    void this.ctx?.close()
    this.ctx = null
    this.master = null
    this.categories = null
    this.unlocked = false
  }

  private async loadManifest() {
    if (this.manifestLoaded) return
    this.manifestLoaded = true
    try {
      const response = await fetch(publicAsset('audio/manifest.json'))
      const type = response.headers.get('content-type') ?? ''
      if (!response.ok || !type.includes('json')) return
      const data = (await response.json()) as { available?: string[] }
      ;(data.available ?? []).forEach((id) => this.available.add(id as SoundId))
    } catch {
      /* procedural only */
    }
  }

  private async startFileLoops(mode: 'ocean' | 'map') {
    const loops: SoundId[] =
      mode === 'ocean'
        ? ['ocean-night', 'wind-soft', 'ship-creaks', 'cinematic-bed']
        : ['wind-soft', 'cinematic-bed']
    for (const id of loops) {
      if (!this.available.has(id)) continue
      const def = soundCatalog.find((item) => item.id === id)
      if (!def) continue
      await this.playFile(id, def.category, def.volume * (0.45 + this.proximity * 0.4), true)
    }
  }

  private async playFile(id: SoundId, category: SoundCategoryId, volume: number, loop: boolean) {
    if (!this.ctx || !this.categories) return
    const existing = this.fileNodes.get(id)
    if (existing) {
      existing.el.currentTime = existing.el.currentTime > 0 && !loop ? 0 : existing.el.currentTime
      void existing.el.play().catch(() => undefined)
      fadeGain(existing.gain, volume, 0.35, this.ctx)
      return
    }
    const def = soundCatalog.find((item) => item.id === id)
    if (!def) return
    const el = new Audio(soundFileUrl(def.file))
    el.loop = loop
    el.preload = 'auto'
    el.crossOrigin = 'anonymous'
    try {
      await el.play()
    } catch {
      return
    }
    const source = this.ctx.createMediaElementSource(el)
    const gain = this.ctx.createGain()
    gain.gain.value = 0.0001
    source.connect(gain)
    gain.connect(this.categories[category])
    fadeGain(gain, volume, 1.1, this.ctx)
    this.fileNodes.set(id, { el, gain, source })
  }

  private startProceduralBed(mode: AmbienceMode) {
    if (!this.ctx || !this.categories) return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const ocean = mode === 'ocean'

    const makeLoop = (rate: number, type: BiquadFilterType, freq: number, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
      return gain
    }

    makeLoop(0.72, 'bandpass', ocean ? 360 : 260, 0.65, ocean ? 0.2 : 0.1)
    makeLoop(1.08, 'bandpass', ocean ? 620 : 400, 0.5, ocean ? 0.12 : 0.07)
    makeLoop(0.9, 'highpass', ocean ? 1200 : 880, 0.4, 0.05)
    if (this.currentMood === 'cultureCity') {
      makeLoop(0.52, 'bandpass', 1380, 0.85, 0.032)
      makeLoop(0.78, 'bandpass', 880, 0.6, 0.024)
      this.cultureAttached = true
    }
    if (this.currentMood === 'strengthsTemple') {
      makeLoop(0.64, 'bandpass', 2400, 0.7, 0.028)
      makeLoop(0.48, 'highpass', 1600, 0.45, 0.02)
      this.templeAttached = true
    }
    if (this.currentMood === 'belowDeck') {
      makeLoop(0.38, 'bandpass', 220, 0.8, 0.03)
      makeLoop(0.7, 'highpass', 1800, 0.4, 0.016)
      this.deckAttached = true
    }
    if (this.currentMood === 'feast') {
      makeLoop(0.56, 'bandpass', 1280, 0.8, 0.03)
      makeLoop(0.82, 'bandpass', 2100, 0.55, 0.016)
      this.feastAttached = true
    }
    if (this.currentMood === 'adventureIsland') {
      makeLoop(0.86, 'highpass', 1900, 0.35, 0.034)
      makeLoop(0.42, 'bandpass', 180, 0.9, 0.03)
      makeLoop(0.6, 'bandpass', 980, 0.55, 0.016)
      this.trialsAttached = true
    }
    if (this.currentMood === 'harborSignal') {
      makeLoop(0.7, 'highpass', 1400, 0.35, 0.022)
      makeLoop(0.48, 'bandpass', 320, 0.7, 0.02)
      this.harborAttached = true
    }
    if (this.currentMood === 'oracleAnomaly') {
      makeLoop(0.46, 'bandpass', 210, 0.85, 0.026)
      makeLoop(0.74, 'bandpass', 1680, 0.6, 0.018)
      this.oracleAttached = true
    }
    if (this.currentMood === 'opportunitySea') {
      makeLoop(0.8, 'highpass', 1500, 0.35, 0.026)
      makeLoop(0.52, 'bandpass', 360, 0.65, 0.02)
      this.opportunityAttached = true
    }
    if (this.currentMood === 'ithacaSunset') {
      makeLoop(0.58, 'bandpass', 280, 0.7, 0.018)
      makeLoop(0.7, 'bandpass', 980, 0.5, 0.014)
      this.ithacaAttached = true
    }

    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = ocean ? 54 : 62
    const drone2 = ctx.createOscillator()
    drone2.type = 'triangle'
    drone2.frequency.value = ocean ? 81 : 93
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.0001
    drone.connect(droneGain)
    drone2.connect(droneGain)
    droneGain.connect(this.categories.music)
    drone.start()
    drone2.start()
    fadeGain(droneGain, ocean ? 0.03 : 0.024, 3.2, ctx)
    this.ambience.push(drone, drone2, droneGain)

    if (mode === 'oracle') {
      const pulse = ctx.createOscillator()
      pulse.type = 'sine'
      pulse.frequency.value = 196
      const pulseGain = ctx.createGain()
      pulseGain.gain.value = 0.0001
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.32
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.01
      pulse.connect(pulseGain)
      pulseGain.connect(this.categories.effects)
      lfo.connect(lfoGain)
      lfoGain.connect(pulseGain.gain)
      pulse.start()
      lfo.start()
      fadeGain(pulseGain, 0.014, 2.4, ctx)
      this.ambience.push(pulse, pulseGain, lfo, lfoGain)
    }
  }

  private playProcedural(id: SoundId | string) {
    if (!this.ctx || !this.categories) return
    const now = this.ctx.currentTime
    if (id === 'ui-hover' || id === 'hover') {
      this.tone(760, now, 0.08, 0.018, 'sine', SoundCategory.Ui)
      return
    }
    if (id === 'ui-select' || id === 'click') {
      this.tone(390, now, 0.12, 0.03, 'triangle', SoundCategory.Ui)
      this.tone(620, now + 0.04, 0.1, 0.02, 'sine', SoundCategory.Ui)
      return
    }
    if (id === 'discovery' || id === 'chime' || id === 'discover') {
      ;[392, 523, 659, 784].forEach((freq, index) => {
        this.tone(freq, now + index * 0.08, 0.7, 0.045, 'triangle', SoundCategory.Effects)
      })
      return
    }
    if (id === 'trust') {
      this.noiseBurst(0.22, 280, 0.02)
      this.tone(196, now, 0.55, 0.022, 'sine', SoundCategory.Effects)
      this.tone(247, now + 0.14, 0.48, 0.016, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'communicate') {
      this.tone(784, now, 0.16, 0.02, 'sine', SoundCategory.Effects)
      this.tone(988, now + 0.09, 0.2, 0.014, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'collaborate') {
      ;[329, 392, 494].forEach((freq, index) => {
        this.tone(freq, now + index * 0.09, 0.55, 0.028, 'triangle', SoundCategory.Effects)
      })
      return
    }
    if (id === 'ask') {
      this.tone(392, now, 0.28, 0.02, 'sine', SoundCategory.Effects)
      this.tone(523, now + 0.12, 0.36, 0.016, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'evaluate') {
      this.tone(494, now, 0.16, 0.018, 'sine', SoundCategory.Effects)
      this.tone(659, now + 0.08, 0.22, 0.016, 'triangle', SoundCategory.Effects)
      this.tone(784, now + 0.16, 0.28, 0.012, 'sine', SoundCategory.Effects)
      return
    }
    if (id === 'terrain') {
      this.tone(349, now, 0.22, 0.016, 'sine', SoundCategory.Effects)
      this.tone(440, now + 0.1, 0.28, 0.014, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'role') {
      this.tone(196, now, 0.24, 0.018, 'sine', SoundCategory.Effects)
      this.tone(294, now + 0.12, 0.3, 0.014, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'mission') {
      ;[330, 392, 523].forEach((freq, index) => {
        this.tone(freq, now + index * 0.09, 0.48, 0.02, 'triangle', SoundCategory.Effects)
      })
      return
    }
    if (id === 'reflect-discover') {
      this.tone(392, now, 0.4, 0.016, 'sine', SoundCategory.Effects)
      this.tone(523, now + 0.14, 0.5, 0.012, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'reflect-carry') {
      this.tone(220, now, 0.45, 0.016, 'sine', SoundCategory.Effects)
      this.tone(330, now + 0.16, 0.5, 0.012, 'triangle', SoundCategory.Effects)
      return
    }
    if (id === 'reflect-next') {
      this.tone(349, now, 0.4, 0.016, 'sine', SoundCategory.Effects)
      this.tone(440, now + 0.12, 0.55, 0.014, 'triangle', SoundCategory.Effects)
      this.tone(523, now + 0.26, 0.7, 0.012, 'sine', SoundCategory.Effects)
      return
    }
    if (id === 'ithaca-arrive') {
      ;[196, 247, 330, 392].forEach((freq, index) => {
        this.tone(freq, now + index * 0.16, 1.1, 0.018, 'sine', SoundCategory.Music)
      })
      return
    }
    if (id === 'create') {
      ;[329, 415, 523, 659].forEach((freq, index) => {
        this.tone(freq, now + index * 0.08, 0.5, 0.02, 'triangle', SoundCategory.Effects)
      })
      return
    }
    if (id === 'harbor-inspect') {
      this.tone(494, now, 0.16, 0.016, 'sine', SoundCategory.Ui)
      this.tone(370, now + 0.08, 0.2, 0.012, 'triangle', SoundCategory.Effects)
      this.noiseBurst(0.12, 420, 0.01)
      return
    }
    if (id === 'map-unfurl' || id === 'paper') {
      this.noiseBurst(0.22, 1200, 0.045)
      return
    }
    if (id === 'voyage-start' || id === 'depart') {
      this.tone(174, now, 1.8, 0.045, 'sine', SoundCategory.Music)
      this.tone(220, now + 0.55, 2, 0.035, 'triangle', SoundCategory.Music)
      this.tone(329, now + 1.3, 2.2, 0.03, 'sine', SoundCategory.Music)
      return
    }
    if (id === 'kraken') {
      this.tone(98, now, 1.2, 0.05, 'sawtooth', SoundCategory.Effects)
      this.tone(146, now + 0.2, 0.9, 0.03, 'triangle', SoundCategory.Effects)
    }
  }

  private tone(
    frequency: number,
    when: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    category: SoundCategoryId,
  ) {
    if (!this.ctx || !this.categories) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(volume, when + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration)
    osc.connect(gain)
    gain.connect(this.categories[category])
    osc.start(when)
    osc.stop(when + duration + 0.05)
  }

  private noiseBurst(duration: number, frequency: number, volume: number) {
    if (!this.ctx || !this.categories) return
    const source = this.ctx.createBufferSource()
    source.buffer = createNoiseBuffer(this.ctx, duration)
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = frequency
    const gain = this.ctx.createGain()
    const now = this.ctx.currentTime
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.categories.environment)
    source.start()
  }

  private scheduleEnvironment() {
    const loop = () => {
      if (!this.enabled || this.mode === 'silent') return
      if (this.currentMood === 'cultureCity') this.playCultureAmbience()
      else if (this.currentMood === 'strengthsTemple') this.playTempleAmbience()
      else if (this.currentMood === 'belowDeck') this.playDeckAmbience()
      else if (this.currentMood === 'feast') this.playFeastAmbience()
      else if (this.currentMood === 'adventureIsland') this.playTrialsAmbience()
      else if (this.currentMood === 'harborSignal') this.playHarborAmbience()
      else if (this.currentMood === 'oracleAnomaly') this.playOracleAmbience()
      else if (this.currentMood === 'opportunitySea') this.playOpportunityAmbience()
      else if (this.currentMood === 'ithacaSunset') this.playIthacaAmbience()
      else if (Math.random() > 0.45) this.noiseBurst(0.26, 240 + Math.random() * 80, 0.02)
      this.eventTimer = window.setTimeout(loop, 8000 + Math.random() * 12000)
    }
    this.eventTimer = window.setTimeout(loop, 5000 + Math.random() * 4000)
  }

  private attachCultureColor() {
    if (this.cultureAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.52, 1380, 0.85, 0.032)
    add(0.78, 880, 0.6, 0.024)
    this.cultureAttached = true
  }

  private attachFeastColor() {
    if (this.feastAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.56, 1280, 0.8, 0.03)
    add(0.82, 2100, 0.55, 0.016)
    this.feastAttached = true
  }

  private playFeastAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.3) {
      this.tone(620, now, 0.08, 0.01, 'triangle', SoundCategory.Environment)
      this.tone(780, now + 0.05, 0.07, 0.008, 'sine', SoundCategory.Environment)
    } else if (roll < 0.55) {
      this.tone(1480, now, 0.05, 0.01, 'sine', SoundCategory.Effects)
    } else if (roll < 0.78) {
      this.tone(1180, now, 0.09, 0.009, 'sine', SoundCategory.Environment)
    } else {
      this.noiseBurst(0.16, 420, 0.012)
    }
  }

  private attachDeckColor() {
    if (this.deckAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.38, 220, 'bandpass', 0.8, 0.03)
    add(0.7, 1800, 'highpass', 0.4, 0.016)
    this.deckAttached = true
  }

  private playDeckAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.28) {
      this.noiseBurst(0.18, 1400, 0.012)
    } else if (roll < 0.52) {
      this.noiseBurst(0.22, 280, 0.016)
    } else if (roll < 0.74) {
      this.tone(980, now, 0.08, 0.008, 'sine', SoundCategory.Environment)
    } else {
      this.tone(196, now, 1.2, 0.01, 'sine', SoundCategory.Effects)
    }
  }

  private attachTempleColor() {
    if (this.templeAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.64, 2400, 'bandpass', 0.7, 0.028)
    add(0.48, 1600, 'highpass', 0.45, 0.02)
    this.templeAttached = true
  }

  private playTempleAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.3) {
      this.tone(1240, now, 0.08, 0.01, 'sine', SoundCategory.Environment)
      this.tone(980, now + 0.1, 0.1, 0.008, 'triangle', SoundCategory.Environment)
    } else if (roll < 0.58) {
      this.noiseBurst(0.34, 2200, 0.012)
    } else if (roll < 0.78) {
      this.tone(523, now, 1.8, 0.01, 'sine', SoundCategory.Effects)
    } else {
      this.noiseBurst(0.22, 1400, 0.01)
    }
  }

  private attachIthacaColor() {
    if (this.ithacaAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.4, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.58, 280, 'bandpass', 0.7, 0.018)
    add(0.7, 980, 'bandpass', 0.5, 0.014)
    this.ithacaAttached = true
  }

  private playIthacaAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.28) {
      this.tone(392, now, 1.2, 0.008, 'sine', SoundCategory.Effects)
    } else if (roll < 0.52) {
      this.tone(1480, now, 0.05, 0.006, 'sine', SoundCategory.Environment)
    } else if (roll < 0.74) {
      this.noiseBurst(0.18, 240, 0.01)
    } else {
      this.tone(784, now, 0.2, 0.007, 'sine', SoundCategory.Environment)
    }
  }

  private attachOpportunityColor() {
    if (this.opportunityAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.8, 1500, 'highpass', 0.35, 0.026)
    add(0.52, 360, 'bandpass', 0.65, 0.02)
    this.opportunityAttached = true
  }

  private playOpportunityAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.3) {
      this.tone(1480, now, 0.06, 0.007, 'sine', SoundCategory.Environment)
      this.tone(1180, now + 0.07, 0.07, 0.005, 'triangle', SoundCategory.Environment)
    } else if (roll < 0.55) {
      this.noiseBurst(0.2, 260, 0.012)
    } else if (roll < 0.78) {
      this.tone(174, now, 0.9, 0.01, 'sine', SoundCategory.Effects)
    } else {
      this.tone(392, now, 1.1, 0.009, 'sine', SoundCategory.Effects)
    }
  }

  private attachOracleColor() {
    if (this.oracleAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.46, 210, 'bandpass', 0.85, 0.026)
    add(0.74, 1680, 'bandpass', 0.6, 0.018)
    this.oracleAttached = true
  }

  private playOracleAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.28) {
      this.tone(196, now, 1.6, 0.01, 'sine', SoundCategory.Effects)
    } else if (roll < 0.5) {
      this.tone(1480, now, 0.05, 0.007, 'sine', SoundCategory.Environment)
      this.tone(1760, now + 0.06, 0.05, 0.005, 'triangle', SoundCategory.Environment)
    } else if (roll < 0.74) {
      this.noiseBurst(0.18, 380, 0.01)
    } else {
      this.tone(784, now, 0.22, 0.008, 'sine', SoundCategory.Environment)
    }
  }

  private attachHarborColor() {
    if (this.harborAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.7, 1400, 'highpass', 0.35, 0.022)
    add(0.48, 320, 'bandpass', 0.7, 0.02)
    this.harborAttached = true
  }

  private attachHarborAnomaly() {
    if (this.harborAnomalyAttached || !this.ctx || !this.categories) return
    const ctx = this.ctx
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = 49
    const pulse = ctx.createOscillator()
    pulse.type = 'triangle'
    pulse.frequency.value = 0.42
    const pulseGain = ctx.createGain()
    pulseGain.gain.value = 0.008
    const gain = ctx.createGain()
    gain.gain.value = 0.0001
    drone.connect(gain)
    pulse.connect(pulseGain)
    pulseGain.connect(gain.gain)
    gain.connect(this.categories.music)
    drone.start()
    pulse.start()
    fadeGain(gain, 0.016, 1.6, ctx)
    this.ambience.push(drone, pulse, pulseGain, gain)
    this.harborAnomalyAttached = true
  }

  private playHarborAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (this.harborAnomalyAttached) {
      this.tone(98, now, 1.4, 0.008, 'sine', SoundCategory.Effects)
      return
    }
    if (roll < 0.28) {
      this.tone(1480, now, 0.06, 0.007, 'sine', SoundCategory.Environment)
      this.tone(1180, now + 0.07, 0.07, 0.005, 'triangle', SoundCategory.Environment)
    } else if (roll < 0.52) {
      this.tone(392, now, 1.1, 0.01, 'sine', SoundCategory.Effects)
    } else if (roll < 0.76) {
      this.noiseBurst(0.2, 280, 0.012)
    } else {
      this.tone(784, now, 0.18, 0.008, 'sine', SoundCategory.Environment)
    }
  }

  private attachTrialsColor() {
    if (this.trialsAttached || !this.ctx || !this.categories || this.mode === 'silent') return
    const ctx = this.ctx
    const noise = createNoiseBuffer(ctx, 8)
    const add = (rate: number, freq: number, type: BiquadFilterType, q: number, volume: number) => {
      const source = ctx.createBufferSource()
      source.buffer = noise
      source.loop = true
      source.playbackRate.value = rate
      const filter = ctx.createBiquadFilter()
      filter.type = type
      filter.frequency.value = freq
      filter.Q.value = q
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      source.connect(filter)
      filter.connect(gain)
      gain.connect(this.categories!.ambience)
      source.start()
      fadeGain(gain, volume * this.proximity, 2.2, ctx)
      this.ambience.push(source, filter, gain)
    }
    add(0.86, 1900, 'highpass', 0.35, 0.034)
    add(0.42, 180, 'bandpass', 0.9, 0.03)
    add(0.6, 980, 'bandpass', 0.55, 0.016)
    this.trialsAttached = true
  }

  private playTrialsAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.28) {
      this.noiseBurst(0.28, 220 + Math.random() * 60, 0.018)
    } else if (roll < 0.5) {
      this.noiseBurst(0.2, 360, 0.014)
    } else if (roll < 0.72) {
      this.tone(1480, now, 0.07, 0.008, 'sine', SoundCategory.Environment)
      this.tone(1180, now + 0.08, 0.08, 0.006, 'triangle', SoundCategory.Environment)
    } else {
      this.tone(174, now, 0.9, 0.01, 'sine', SoundCategory.Effects)
    }
  }

  private playCultureAmbience() {
    if (!this.ctx || !this.categories) return
    const roll = Math.random()
    const now = this.ctx.currentTime
    if (roll < 0.32) {
      const pan = -0.55 + Math.random() * 0.35
      this.tone(1180, now, 0.09, 0.012, 'sine', SoundCategory.Environment)
      this.tone(980, now + 0.08, 0.12, 0.01, 'triangle', SoundCategory.Environment)
      this.playPanned('hover', pan)
    } else if (roll < 0.58) {
      this.noiseBurst(0.2, 360 + Math.random() * 80, 0.014)
    } else if (roll < 0.8) {
      this.tone(392, now, 1.5, 0.011, 'sine', SoundCategory.Effects)
    } else {
      this.noiseBurst(0.28, 1500, 0.01)
    }
  }
}

let engine: SoundEngine | null = null

export function getSoundEngine() {
  if (!engine) engine = new SoundEngine()
  return engine
}
