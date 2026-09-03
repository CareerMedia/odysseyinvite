import type { VisualType } from '../../types'

export function LocalLights({ type }: { type: VisualType }) {
  if (type === 'deck' || type === 'harbor' || type === 'cove' || type === 'feast') {
    return (
      <div className="local-lights" aria-hidden="true">
        <span className="lamp lamp-a" />
        <span className="lamp lamp-b" />
        <span className="lamp lamp-c" />
      </div>
    )
  }
  if (type === 'temple') {
    return (
      <div className="local-lights" aria-hidden="true">
        <span className="torch torch-a" />
        <span className="torch torch-b" />
      </div>
    )
  }
  if (type === 'ithaca') {
    return (
      <div className="local-lights city-lights" aria-hidden="true">
        <span className="lamp lamp-a" />
        <span className="lamp lamp-b" />
        <span className="lamp lamp-c" />
        <span className="lamp lamp-d" />
      </div>
    )
  }
  if (type === 'oracle') {
    return (
      <div className="local-lights oracle-holo" aria-hidden="true">
        <span className="holo holo-a" />
        <span className="holo holo-b" />
      </div>
    )
  }
  return null
}
