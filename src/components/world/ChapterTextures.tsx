import type { VisualType } from '../../types'

export function ChapterTextures({ type }: { type: VisualType }) {
  return (
    <div className={`chapter-tex-stack type-${type}`} aria-hidden="true">
      <div className="chapter-tex chapter-tex-land" />
      <div className="chapter-tex chapter-tex-arch" />
      <div className="chapter-tex chapter-tex-grain" />
    </div>
  )
}
