export function LighthouseBeam({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <div className={`lighthouse ${active ? 'is-lit' : ''} ${reduced ? 'is-still' : ''}`} aria-hidden="true">
      <div className="lighthouse-tower" />
      <div className="lighthouse-glow" />
      {active ? <div className="lighthouse-beam" /> : null}
    </div>
  )
}
