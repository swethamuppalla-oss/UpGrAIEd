import { getGreeting, getInactivityMessage } from './RobBrain'
import { DEFAULT_BLOOM_PERSONALITY } from '../config/defaults'

export const ROB_COLORS = {
  cyan:   { primary: '#00D4FF', secondary: '#0099BB', glow: 'rgba(0,212,255,0.45)' },
  purple: { primary: '#A855F7', secondary: '#7E22CE', glow: 'rgba(168,85,247,0.45)' },
  orange: { primary: '#FF7A2F', secondary: '#C2410C', glow: 'rgba(255,122,47,0.45)' },
  green:  { primary: '#22C55E', secondary: '#15803D', glow: 'rgba(34,197,94,0.45)' },
  pink:   { primary: '#EC4899', secondary: '#BE185D', glow: 'rgba(236,73,153,0.45)' },
}

/**
 * getRobMood(companionData, xpToday, accuracy, personality?)
 *
 * personality — optional object from config.bloom.personality (see defaults.js).
 * When omitted, DEFAULT_BLOOM_PERSONALITY is used so existing callers are unaffected.
 */
export function getRobMood(companionData, xpToday, accuracy = 100, personality = null) {
  if (!companionData) {
    return { emotion: 'happy', message: 'Ready to learn something new about AI today?' }
  }

  const p = personality
    ? { ...DEFAULT_BLOOM_PERSONALITY, ...personality }
    : DEFAULT_BLOOM_PERSONALITY

  const xpT  = p.xp_thresholds
  const strT = p.streak_thresholds
  const accT = p.accuracy_thresholds

  const { timeOfDay, daysSinceLogin, streak, robName } = companionData
  const firstName = robName ? robName.split(' ')[0] : ''

  // Inactive comeback
  if (daysSinceLogin >= 2) {
    return { emotion: 'encouraging', message: getInactivityMessage(daysSinceLogin, firstName) }
  }

  // XP wins (thresholds from config)
  if (xpToday > xpT.fire) {
    return { emotion: 'celebrating', message: "ABSOLUTE LEGEND! You're dominating today's learning session! 🏆" }
  }
  if (xpToday > xpT.celebrating) {
    return { emotion: 'celebrating', message: "You're on fire today! Keep stacking that XP! 🔥" }
  }
  if (xpToday > xpT.excited) {
    return { emotion: 'excited', message: "Great start! A little more and you'll unlock a new badge!" }
  }

  // Accuracy struggles
  if (accuracy < accT.struggling) {
    return { emotion: 'encouraging', message: "Mistakes are just data! Each wrong answer makes both of us smarter. Keep going!" }
  }
  if (accuracy < accT.warming) {
    return { emotion: 'thinking', message: "Getting warmer! Every attempt strengthens your AI brain circuits." }
  }

  // Streaks
  if (streak >= strT.legendary) {
    return { emotion: 'celebrating', message: `${streak}-day streak! You're in the TOP 1% of learners! Insane dedication! 🚀` }
  }
  if (streak >= strT.unstoppable) {
    return { emotion: 'excited', message: `${streak} days in a row! The AI world better watch out! You're unstoppable! ⚡` }
  }
  if (streak >= strT.proud) {
    return { emotion: 'happy', message: `${streak} days straight! I'm so proud of you. Let's make it ${streak + 1}!` }
  }

  // Time-based greeting
  const greetingMsg = streak > 0 && timeOfDay === 'morning'
    ? `Rise and grind! Day ${streak + 1} of our streak starts NOW.`
    : getGreeting(timeOfDay || 'afternoon', firstName)

  const emotionMap = { morning: 'happy', afternoon: 'curious', evening: 'thinking', night: 'sleepy' }
  return { emotion: emotionMap[timeOfDay] || 'happy', message: greetingMsg }
}
