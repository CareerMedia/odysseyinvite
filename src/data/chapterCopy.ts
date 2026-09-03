import type { Destination } from '../types'

export function chapterGuidance(dest: Destination, firstInteractive: boolean) {
  if (dest.interaction === 'rest' || dest.interaction === 'feast' || dest.interaction === 'signal' || dest.interaction === 'forbidden') {
    return {
      lead: dest.interaction === 'signal' ? 'Watch the instruments.' : 'Take in the harbor.',
      detail: 'Optional exploration. Your Odyssey continues whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'strengths') {
    return {
      lead: 'Choose a path — or continue when ready',
      detail: 'Optional. You may continue without selecting a path.',
    }
  }
  if (dest.interaction === 'crew') {
    return {
      lead: firstInteractive ? 'Assemble the crew' : 'Select the highlighted crew symbols',
      detail: 'Optional exploration. Your Odyssey continues whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'beacon') {
    return {
      lead: 'Activate the three signals',
      detail: firstInteractive
        ? 'Select each glowing symbol to discover more and earn Odyssey XP. Optional — your journey continues either way.'
        : 'Optional exploration. Your Odyssey continues whenever you\'re ready.',
    }
  }
  if (dest.interaction === 'voices') {
    return { lead: 'Listen to the voices of the city', detail: 'Explore the glowing symbols. Optional exploration.' }
  }
  if (dest.interaction === 'crates') {
    return { lead: 'Open the supply crates', detail: 'Select Spaces, Equipment, and Payroll. Optional exploration.' }
  }
  if (dest.interaction === 'trials') {
    return { lead: 'Rebuild the path together', detail: 'Activate each crew principle. Optional exploration.' }
  }
  if (dest.interaction === 'oracle') {
    return { lead: 'Consult the Oracle', detail: 'Activate each principle. Optional exploration.' }
  }
  if (dest.interaction === 'briefing') {
    return { lead: 'Review the mission briefing', detail: 'Explore each marker. Optional.' }
  }
  if (dest.interaction === 'reflection') {
    return { lead: 'Every Odyssey changes the traveler.', detail: 'Select a prompt if you wish. No typed response is required.' }
  }
  return {
    lead: 'Explore the highlighted objects',
    detail: 'Optional exploration. Your Odyssey continues whenever you\'re ready.',
  }
}
