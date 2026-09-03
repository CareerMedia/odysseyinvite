import type { ReactNode } from 'react'
import type { VisualType } from '../types'

export function DestinationArt({ type, x, y }: { type: VisualType; x: number; y: number }) {
  const art = ART[type]
  return (
    <g transform={`translate(${x}, ${y}) scale(1.65)`} className="island-art">
      {art}
    </g>
  )
}

const ART: Record<VisualType, ReactNode> = {
  harbor: (
    <>
      <ellipse cx="0" cy="18" rx="46" ry="12" fill="#7a9a6a" />
      <path d="M-36 10 C -20 -8 8 -14 28 6 L 20 16 L -28 16 Z" fill="#5d7a52" />
      <rect x="-18" y="-6" width="10" height="16" fill="#8b5a32" />
      <rect x="-6" y="-14" width="12" height="24" fill="#a56b3c" />
      <rect x="10" y="-4" width="9" height="14" fill="#7a4a28" />
      <path d="M-20 -6 L -13 -16 L -6 -6" fill="#d22030" />
      <circle cx="-22" cy="-2" r="2" fill="#e8a54b" />
      <circle cx="4" cy="-8" r="2" fill="#e8a54b" />
      <path d="M-44 14 C -30 6 -10 8 0 14" stroke="#5a3820" strokeWidth="2" fill="none" />
    </>
  ),
  fortress: (
    <>
      <ellipse cx="0" cy="16" rx="40" ry="11" fill="#6d7468" />
      <path d="M-28 12 L -18 -10 L 8 -18 L 30 12 Z" fill="#7d8378" />
      <rect x="-6" y="-28" width="8" height="26" fill="#8b8f84" />
      <rect x="10" y="-16" width="7" height="16" fill="#6f746c" />
      <circle cx="-2" cy="-32" r="4" fill="#e8a54b" />
      <circle cx="-2" cy="-32" r="8" fill="#e8a54b" opacity="0.25" />
    </>
  ),
  city: (
    <>
      <ellipse cx="0" cy="16" rx="48" ry="12" fill="#6f8a5c" />
      <rect x="-24" y="-4" width="10" height="16" fill="#d8c4a0" />
      <rect x="-10" y="-12" width="12" height="24" fill="#c4b08c" />
      <rect x="6" y="-2" width="14" height="14" fill="#bca47c" />
      <path d="M-8 -12 L -4 -22 L 0 -12" fill="#e8d5b0" />
      <rect x="-4" y="-2" width="3" height="8" fill="#e8d48b" />
      <rect x="4" y="0" width="3" height="8" fill="#e8d48b" />
      <circle cx="-16" cy="-2" r="1.6" fill="#e8a54b" />
    </>
  ),
  temple: (
    <>
      <ellipse cx="0" cy="20" rx="50" ry="12" fill="#5f7a52" />
      <path d="M-34 16 L -8 -22 L 16 -30 L 40 16 Z" fill="#6d8070" />
      <path d="M-10 16 L 2 -8 L 16 16 Z" fill="#d8c4a0" />
      <rect x="-2" y="-2" width="4" height="12" fill="#c9a84c" />
      <path d="M-14 8 C -4 0 8 0 18 10" stroke="#7ec8b8" strokeWidth="2" fill="none" opacity="0.7" />
      <circle cx="2" cy="-14" r="3" fill="#e8d48b" />
    </>
  ),
  trials: (
    <>
      <ellipse cx="0" cy="18" rx="44" ry="11" fill="#4f6a48" />
      <path d="M-30 12 L -16 -20 L 0 8 L 14 -26 L 32 12 Z" fill="#5c6e58" />
      <path d="M-8 2 C 0 -8 10 -6 16 2" stroke="#8b5a32" strokeWidth="1.6" fill="none" />
      <path d="M-12 16 C -8 8 0 6 8 16" stroke="#7ec8b8" strokeWidth="2" fill="none" opacity="0.65" />
    </>
  ),
  oracle: (
    <>
      <ellipse cx="0" cy="16" rx="42" ry="11" fill="#3d4a58" />
      <path d="M-22 12 L -12 -8 L 4 -16 L 22 12 Z" fill="#6b7380" />
      <rect x="-8" y="-6" width="16" height="10" fill="#2a8a8a" opacity="0.55" />
      <circle cx="0" cy="-10" r="6" fill="#7ec8b8" opacity="0.7" />
      <circle cx="0" cy="-10" r="11" fill="#7ec8b8" opacity="0.18" />
      <path d="M-16 -2 L -8 -14 M 16 0 L 10 -16" stroke="#7ec8b8" strokeWidth="1" />
    </>
  ),
  port: (
    <>
      <ellipse cx="0" cy="16" rx="52" ry="12" fill="#5f7e68" />
      <path d="M-36 8 C -10 -6 16 -8 38 10 L 24 16 L -24 16 Z" fill="#6f8a70" />
      <path d="M-28 10 L -22 -6 L -16 10" fill="#efe4c8" />
      <path d="M-4 8 L 2 -10 L 8 8" fill="#efe4c8" />
      <path d="M16 10 L 22 -4 L 28 10" fill="#efe4c8" />
      <path d="M-22 -6 L -22 -14 L -14 -10" fill="#d22030" />
    </>
  ),
  ithaca: (
    <>
      <ellipse cx="0" cy="16" rx="48" ry="12" fill="#8aa05a" />
      <path d="M-32 12 C -16 -16 8 -28 34 10 L 20 16 L -22 16 Z" fill="#c9a84c" opacity="0.85" />
      <path d="M-6 10 L 4 -12 L 14 10 Z" fill="#f0e0b4" />
      <circle cx="4" cy="-6" r="10" fill="#e8a54b" opacity="0.28" />
      <circle cx="4" cy="-16" r="5" fill="#e8d48b" opacity="0.7" />
    </>
  ),
  cove: (
    <>
      <ellipse cx="0" cy="10" rx="22" ry="8" fill="#6d8a64" />
      <path d="M-14 6 C -4 -6 10 -4 14 8" fill="#7a9870" />
    </>
  ),
  deck: (
    <>
      <ellipse cx="0" cy="10" rx="20" ry="7" fill="#6a7e58" />
      <rect x="-10" y="-2" width="20" height="8" rx="2" fill="#8b5a32" />
      <rect x="-3" y="-8" width="2" height="8" fill="#5a3820" />
    </>
  ),
  feast: (
    <>
      <ellipse cx="0" cy="10" rx="22" ry="7" fill="#7a8d5c" />
      <path d="M-12 6 L 0 -8 L 12 6 Z" fill="#e8d5b0" />
      <circle cx="0" cy="0" r="2" fill="#d22030" />
    </>
  ),
  cove2: (
    <>
      <ellipse cx="0" cy="10" rx="20" ry="7" fill="#65866c" />
      <path d="M-12 6 C 0 -8 12 0 14 8" fill="#739478" />
    </>
  ),
  forbidden: (
    <>
      <ellipse cx="0" cy="16" rx="40" ry="11" fill="#3d2a3a" />
      <path d="M-22 12 L -4 -18 L 18 -8 L 26 14 Z" fill="#5a3048" />
      <circle cx="2" cy="-6" r="5" fill="#d22030" opacity="0.55" />
    </>
  ),
}
