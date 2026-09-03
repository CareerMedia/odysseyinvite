import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useExperience } from '../hooks/ExperienceContext'
import { Scene } from '../types'

export function SoundController() {
  const { progress, setSoundEnabled, scene, sound } = useExperience()
  const enabled = progress.soundEnabled
  const [open, setOpen] = useState(false)

  if (!progress.soundChoiceMade && scene === Scene.Cinematic) return null

  return (
    <div className={`sound-dock ${scene !== Scene.Map ? 'is-cinematic' : ''}`}>
      <button
        className={`icon-btn sound-btn ${scene !== Scene.Map ? 'is-cinematic' : ''}`}
        type="button"
        aria-pressed={enabled}
        aria-label={enabled ? 'Sound on. Click to mute.' : 'Sound off. Click to enable.'}
        onClick={() => setSoundEnabled(!enabled)}
        onPointerEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
      >
        {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="sound-label">{enabled ? 'Sound on' : 'Sound off'}</span>
      </button>
      {open ? (
        <div className="sound-popover" onPointerLeave={() => setOpen(false)}>
          <label>
            Music
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue="0.7"
              onChange={(event) => sound.setMusicVolume(Number(event.target.value))}
            />
          </label>
          <label>
            Atmosphere
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue="1"
              onChange={(event) => sound.setAmbientVolume(Number(event.target.value))}
            />
          </label>
          <label>
            Effects
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              defaultValue="0.85"
              onChange={(event) => sound.setEffectsVolume(Number(event.target.value))}
            />
          </label>
        </div>
      ) : null}
    </div>
  )
}
