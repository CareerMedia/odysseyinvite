import type { CSSProperties } from 'react'
import type { VisualType } from '../types'

import texRockWall from './textures/rock/rock_wall_10.jpg'
import texRockFace from './textures/rock/rock_face_03.jpg'
import texCliff from './textures/rock/cliff_side.jpg'
import texWoodPlanks from './textures/wood/wood_planks.jpg'
import texWoodTable from './textures/wood/wood_table_001.jpg'
import texStoneBlocks from './textures/stone/medieval_blocks_05.jpg'
import texMarble from './textures/stone/marble_01.jpg'
import texMarbleCliff from './textures/stone/marble_cliff_01.jpg'
import texSand from './textures/environments/coast_sand_01.jpg'
import texTerrain from './textures/environments/aerial_rocks_02.jpg'
import texLeather from './textures/parchment/brown_leather.jpg'
import texPaper from './textures/parchment/paper_001.jpg'

export {
  texRockWall,
  texRockFace,
  texCliff,
  texWoodPlanks,
  texWoodTable,
  texStoneBlocks,
  texMarble,
  texMarbleCliff,
  texSand,
  texTerrain,
  texLeather,
  texPaper,
}

export const textures = {
  rock: texRockWall,
  face: texRockFace,
  cliff: texCliff,
  wood: texWoodPlanks,
  table: texWoodTable,
  stone: texStoneBlocks,
  marble: texMarble,
  mcliff: texMarbleCliff,
  sand: texSand,
  terrain: texTerrain,
  leather: texLeather,
  paper: texPaper,
} as const

export type TextureId = keyof typeof textures

type ScenePack = {
  ground: TextureId
  arch: TextureId
  grain: TextureId
}

const SCENE_PACK: Record<VisualType, ScenePack> = {
  harbor: { ground: 'sand', arch: 'wood', grain: 'paper' },
  fortress: { ground: 'cliff', arch: 'stone', grain: 'rock' },
  city: { ground: 'sand', arch: 'stone', grain: 'paper' },
  cove: { ground: 'wood', arch: 'table', grain: 'leather' },
  temple: { ground: 'mcliff', arch: 'marble', grain: 'paper' },
  deck: { ground: 'table', arch: 'wood', grain: 'leather' },
  feast: { ground: 'wood', arch: 'table', grain: 'paper' },
  trials: { ground: 'rock', arch: 'cliff', grain: 'terrain' },
  cove2: { ground: 'leather', arch: 'paper', grain: 'paper' },
  oracle: { ground: 'marble', arch: 'mcliff', grain: 'paper' },
  port: { ground: 'sand', arch: 'stone', grain: 'paper' },
  ithaca: { ground: 'sand', arch: 'stone', grain: 'leather' },
  forbidden: { ground: 'rock', arch: 'cliff', grain: 'leather' },
}

type TextureStyle = CSSProperties & {
  '--tex-ground': string
  '--tex-arch': string
  '--tex-grain': string
  '--tex-rock': string
  '--tex-wood': string
  '--tex-paper': string
  '--tex-leather': string
  '--tex-terrain': string
}

function cssUrl(id: TextureId) {
  return `url(${textures[id]})`
}

export function textureVarsFor(type: VisualType): TextureStyle {
  const pack = SCENE_PACK[type]
  return {
    '--tex-ground': cssUrl(pack.ground),
    '--tex-arch': cssUrl(pack.arch),
    '--tex-grain': cssUrl(pack.grain),
    '--tex-rock': cssUrl('rock'),
    '--tex-wood': cssUrl('wood'),
    '--tex-paper': cssUrl('paper'),
    '--tex-leather': cssUrl('leather'),
    '--tex-terrain': cssUrl('terrain'),
  }
}

export function mapTextureVars(): TextureStyle {
  return {
    '--tex-ground': cssUrl('terrain'),
    '--tex-arch': cssUrl('stone'),
    '--tex-grain': cssUrl('paper'),
    '--tex-rock': cssUrl('rock'),
    '--tex-wood': cssUrl('wood'),
    '--tex-paper': cssUrl('paper'),
    '--tex-leather': cssUrl('leather'),
    '--tex-terrain': cssUrl('terrain'),
  }
}
