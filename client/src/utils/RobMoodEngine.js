export const ROB_COLORS = {
  cyan: { primary: '#00D4FF', secondary: '#0099BB', glow: 'rgba(0,212,255,0.45)' },
  purple: { primary: '#A855F7', secondary: '#7E22CE', glow: 'rgba(168,85,247,0.45)' },
  orange: { primary: '#FF7A2F', secondary: '#C2410C', glow: 'rgba(255,122,47,0.45)' },
  green: { primary: '#22C55E', secondary: '#15803D', glow: 'rgba(34,197,94,0.45)' },
  pink: { primary: '#EC4899', secondary: '#BE185D', glow: 'rgba(236,73,153,0.45)' },
}

export function getRobMood(companionData, xpToday, isReturningParent = false) {
  if (!companionData) {
    return {
      emotion: 'happy',
      message: "Ready to learn something new about AI today?",
    }
  }

  const { timeOfDay, daysSinceLogin, streak } = companionData

  // 1. Inactive comeback
  if (daysSinceLogin >= 2) {
    return {
      emotion: 'encouraging',
      message: `I missed you! It's been ${daysSinceLogin} days. Let's restart our streak!`,
    }
  }

  // 2. High engagement today
  if (xpToday > 100) {
    return {
      emotion: 'celebrating',
      message: "Whoa, you're on fire today! Keep it up!",
    }
  }

  // 3. Time-based greetings
  if (timeOfDay === 'morning') {
    return {
      emotion: 'happy',
      message: streak > 0 
        ? `Good morning! Ready to extend your ${streak}-day streak?` 
        : "Good morning! Let's build something cool today.",
    }
  }

  if (timeOfDay === 'afternoon') {
    return {
      emotion: 'curious',
      message: "Good afternoon! Ready to continue our mission?",
    }
  }

  if (timeOfDay === 'evening') {
    return {
      emotion: 'thinking',
      message: "How was school? Let's do a quick AI run before bed.",
    }
  }

  // fallback night
  return {
    emotion: 'sleepy',
    message: "It's getting late... but I'm always awake for AI!",
  }
}
