import type { VisualType } from '../../types'

export function SceneSilhouettes({ type }: { type: VisualType }) {
  if (type === 'harbor') {
    return (
      <div className="silhouettes sil-harbor" aria-hidden="true">
        <span className="sil-figure walk-a" />
        <span className="sil-figure walk-b" />
        <span className="sil-crate" />
      </div>
    )
  }
  if (type === 'city') {
    return (
      <div className="silhouettes sil-city" aria-hidden="true">
        <span className="sil-figure walk-a" />
        <span className="sil-figure walk-c" />
        <span className="sil-figure talk" />
      </div>
    )
  }
  if (type === 'feast') {
    return (
      <div className="silhouettes sil-feast" aria-hidden="true">
        <span className="sil-figure sit-a" />
        <span className="sil-figure sit-b" />
        <span className="sil-figure sit-c" />
      </div>
    )
  }
  if (type === 'port') {
    return (
      <div className="silhouettes sil-port" aria-hidden="true">
        <span className="sil-sail far-a" />
        <span className="sil-sail far-b" />
        <span className="sil-figure walk-a" />
      </div>
    )
  }
  return null
}
