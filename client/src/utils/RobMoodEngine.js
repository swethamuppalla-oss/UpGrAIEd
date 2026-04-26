export const ROB_COLORS = {
  cyan: { primary: '#00D4FF', secondary: '#0099BB', glow: 'rgba(0,212,255,0.45)' },
  purple: { primary: '#A855F7', secondary: '#7E22CE', glow: 'rgba(168,85,247,0.45)' },
  orange: { primary: '#FF7A2F', secondary: '#C2410C', glow: 'rgba(255,122,47,0.45)' },
  green: { primary: '#22C55E', secondary: '#15803D', glow: 'rgba(34,197,94,0.45)' },
  pink: { primary: '#EC4899', secondary: '#BE185D', glow: 'rgba(236,73,153,0.45)' },
}

export function getRobMood(companionData, xpToday, accuracy = 100) {
  if (!companionData) {
    return { emotion: 'happy', message: "Ready to learn something new about AI today?" }
  }

  const { timeOfDay, daysSinceLogin, streak } = companionData

  // Inactive comeback
  if (daysSinceLogin >= 3) {
    return { emotion: 'encouraging', message: `I missed you SO much! ${daysSinceLogin} days is way too long. Let's fix that right now!` }
  }
  if (daysSinceLogin >= 2) {
    return { emotion: 'encouraging', message: `Hey! It's been ${daysSinceLogin} days. Your streak is waiting... shall we restart?` }
  }

  // Winning / fire
  if (xpToday > 200) {
    return { emotion: 'celebrating', message: "ABSOLUTE LEGEND! You're dominating today's learning session! 🏆" }
  }
  if (xpToday > 100) {
    return { emotion: 'celebrating', message: "You're on fire today! Keep stacking that XP! 🔥" }
  }
  if (xpToday > 50) {
    return { emotion: 'excited', message: "Great start! A little more and you'll unlock a new badge!" }
  }

  // Struggling (low accuracy)
  if (accuracy < 40) {
    return { emotion: 'encouraging', message: "Mistakes are just data! Each wrong answer makes both of us smarter. Keep going!" }
  }
  if (accuracy < 60) {
    return { emotion: 'thinking', message: "Getting warmer! Every attempt strengthens your AI brain circuits." }
  }

  // Streak celebration
  if (streak >= 14) {
    return { emotion: 'celebrating', message: `${streak}-day streak! You're in the TOP 1% of learners! Insane dedication! 🚀` }
  }
  if (streak >= 7) {
    return { emotion: 'excited', message: `${streak} days in a row! The AI world better watch out! You're unstoppable! ⚡` }
  }
  if (streak >= 3) {
    return { emotion: 'happy', message: `${streak} days straight! I'm so proud of you. Let's make it ${streak + 1}!` }
  }

  // Time-based
  if (timeOfDay === 'morning') {
    return {
      emotion: 'happy',
      message: streak > 0
        ? `Rise and grind! Day ${streak + 1} of our streak starts NOW.`
        : "Fresh morning, fresh mind. Let's build something amazing today!",
    }
  }
  if (timeOfDay === 'afternoon') {
    return { emotion: 'curious', message: "Mid-day learning hits different. What AI concept are we cracking today?" }
  }
  if (timeOfDay === 'evening') {
    return { emotion: 'thinking', message: "Evening is my favorite time to learn. Brains consolidate knowledge while you sleep!" }
  }

  return { emotion: 'sleepy', message: "Night owl energy detected... I run 24/7, so let's go! 🦉" }
}
