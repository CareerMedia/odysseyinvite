import { Maximize2, Minimize2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EVENT } from '../data/destinations'
import { useExperience } from '../hooks/ExperienceContext'

export function ExpeditionChrome() {
  const { replayOpening, toggleDetails } = useExperience()
  const [full, setFull] = useState(false)

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      /* blocked */
    }
  }

  return (
    <>
      <div className="chrome chrome-brand">
        <p className="brand-lockup">{EVENT.title}</p>
        <p className="brand-sub">Expedition Chart</p>
      </div>
      <div className="chrome chrome-rail">
        <button className="rail-btn" type="button" onClick={() => toggleDetails(true)}>
          Full voyage
        </button>
        <button className="rail-btn" type="button" onClick={replayOpening}>
          Replay opening
        </button>
        <button
          className="icon-btn"
          type="button"
          aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'}
          onClick={() => void toggleFull()}
        >
          {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </>
  )
}
