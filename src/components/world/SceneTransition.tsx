import type { TransitionKind } from '../../types'

export type WipeState = { type: TransitionKind; phase: 'cover' | 'reveal' } | null

export function SceneTransition({ wipe }: { wipe: WipeState }) {
  if (!wipe) return null
  return (
    <div className={`scene-wipe is-${wipe.type} is-${wipe.phase}`} aria-hidden="true">
      <div className="wipe-a" />
      <div className="wipe-b" />
    </div>
  )
}
