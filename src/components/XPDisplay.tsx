import { useExperience } from '../hooks/ExperienceContext'

export function XPDisplay() {
  const { progress } = useExperience()
  if (progress.xp <= 0) return null
  return (
    <div className="xp-display" aria-live="polite">
      ✦ {progress.xp} ODYSSEY XP
    </div>
  )
}
