import { EVENT } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'
import { storyCompletion } from '../utils/voyageState'

export function OdysseyComplete() {
  const { viewCompletedVoyage, progress, toggleDetails } = useExperience()
  const { done, total } = storyCompletion(progress)

  return (
    <div className="finale" role="dialog" aria-labelledby="finale-title">
      <p className="chapter-kicker">Friday · September 11, 2026</p>
      <h2 id="finale-title">Odyssey Complete</h2>
      <p className="finale-time">8:30 AM – 4:00 PM</p>
      <p className="finale-name">{EVENT.title}</p>
      <p className="chapter-story">Seven destinations. One crew. Countless discoveries.</p>
      <p className="chapter-sub">But this isn’t where the journey ends. It’s where the next one begins.</p>
      <p className="finale-stats">
        {done} / {total} destinations · {progress.xp} Odyssey XP · {progress.unlockedAchievementIds.length} achievements
      </p>
      <div className="chapter-actions">
        <button className="cta-secondary" type="button" onClick={() => toggleDetails(true)}>
          View expedition details
        </button>
        <button className="cta-primary" type="button" onClick={viewCompletedVoyage}>
          View my voyage
        </button>
      </div>
    </div>
  )
}
