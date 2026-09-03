import { useExperience } from '../hooks/ExperienceContext'

export function AchievementToast() {
  const { toasts } = useExperience()
  if (!toasts.length) return null

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <article className="toast" key={toast.id}>
          <p className="toast-kicker">{toast.kicker ?? 'Achievement unlocked'}</p>
          <h3>{toast.title}</h3>
          <p>{toast.subtitle}</p>
          <p>+{toast.xp} Odyssey XP</p>
        </article>
      ))}
    </div>
  )
}
