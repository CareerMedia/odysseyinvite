import type { Destination } from '../types'

export function chapterGuidance(dest: Destination, firstInteractive: boolean) {
  if (dest.interaction === 'rest' || dest.interaction === 'feast' || dest.interaction === 'signal' || dest.interaction === 'forbidden') {
    return {
      lead: dest.interaction === 'signal' ? 'Watch the instruments' : 'Take in the harbor',
      detail: firstInteractive
        ? 'Optional exploration — continue your Odyssey whenever you\'re ready.'
        : 'Optional. Return to the map whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'strengths') {
    return {
      lead: 'Choose your path',
      detail: 'Select the path that best represents your experience. Optional — you may continue without making a selection.',
    }
  }
  if (dest.interaction === 'crew') {
    return {
      lead: 'Assemble the crew',
      detail: 'Select the crew medallions to explore the chapter. Optional exploration — your Odyssey continues whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'beacon') {
    return {
      lead: 'Activate the three signals',
      detail: 'Select each glowing symbol to discover more and earn Odyssey XP. Optional exploration — your journey continues either way.',
    }
  }
  if (dest.interaction === 'voices') {
    return {
      lead: 'Listen to the voices of the city',
      detail: 'Explore the glowing symbols to discover the values that shape a strong crew. Optional exploration — your Odyssey continues whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'crates') {
    return {
      lead: 'Explore the highlighted objects',
      detail: 'Select Spaces, Equipment, and Payroll. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'trials') {
    return {
      lead: 'Explore the highlighted objects',
      detail: 'Activate each crew principle in order. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'oracle') {
    return {
      lead: 'Explore the highlighted objects',
      detail: 'Select each glowing symbol to consult the Oracle. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'briefing') {
    return {
      lead: 'Explore the highlighted objects',
      detail: 'Select The Terrain, Your Role, and The Mission. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'reflection') {
    return {
      lead: 'Every Odyssey changes the traveler',
      detail: 'Select a prompt if you wish. Optional — no typed response is required.',
    }
  }
  return {
    lead: 'Explore the highlighted objects',
    detail: 'Select each glowing symbol to discover more. Optional exploration — continue your Odyssey whenever you\'re ready.',
  }
}
