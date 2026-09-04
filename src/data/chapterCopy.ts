import type { Destination } from '../types'

export function chapterGuidance(dest: Destination, firstInteractive: boolean) {
  if (dest.interaction === 'feast') {
    return {
      lead: 'Take in the harbor',
      detail: 'Optional. Return to the map whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'signal') {
    return {
      lead: 'Watch the instruments',
      detail: 'Optional. Return to the map whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'rest' || dest.interaction === 'forbidden') {
    return {
      lead: 'Take in the harbor',
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
      lead: "Explore the Quartermaster's Deck",
      detail: 'Select Spaces, Equipment, and Payroll to discover what keeps the voyage running. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'trials') {
    return {
      lead: 'Build the path together',
      detail: 'Activate each crew principle to strengthen the expedition. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'oracle') {
    return {
      lead: 'Consult the Oracle',
      detail: 'Activate each principle to explore the chapter. Optional exploration — continue your Odyssey whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'briefing') {
    return {
      lead: 'Prepare for the journey ahead',
      detail: 'Explore each briefing point to chart the final approach. Optional exploration — continue your Odyssey whenever you\'re ready.',
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
