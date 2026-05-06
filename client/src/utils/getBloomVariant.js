/**
 * Returns a Bloom UI/UX variant based on the student's grade.
 *
 * Variants control tone, visual density, XP scaling, and Bloom's
 * default emotional register — so the dashboard feels age-appropriate
 * without any per-screen logic.
 *
 *   Grade  1–3  → sprout    (playful, large, simple)
 *   Grade  4–6  → explorer  (colorful, curious)
 *   Grade  7–9  → achiever  (focused, motivating)
 *   Grade 10–12 → master    (crisp, academic)
 */

const VARIANTS = {
  sprout: {
    id: 'sprout',
    label: 'Elementary',
    gradeRange: '1–3',
    tone: 'playful',
    accentColor: '#6EDC5F',
    bloomEmotion: 'excited',
    xpMultiplier: 1.0,
    statsCount: 3,
    quizDifficulty: 'easy',
    bloomMessages: {
      new:     "Let's learn something fun today! 🌱",
      good:    (n) => `You finished ${n} lesson${n > 1 ? 's' : ''}! That's amazing! ⭐`,
      streak2: (n) => `${n} days of learning! You're doing great! 🎉`,
      streak5: (n) => `${n} days in a row — you're a superstar! 🌟`,
    },
  },

  explorer: {
    id: 'explorer',
    label: 'Upper Elementary',
    gradeRange: '4–6',
    tone: 'encouraging',
    accentColor: '#63C7FF',
    bloomEmotion: 'happy',
    xpMultiplier: 1.1,
    statsCount: 3,
    quizDifficulty: 'medium',
    bloomMessages: {
      new:     'Your first lesson is waiting — let\'s go! 🚀',
      good:    (n) => `${n} concept${n > 1 ? 's' : ''} mastered! Keep exploring.`,
      streak2: (n) => `${n} day streak! Consistency is your superpower.`,
      streak5: (n) => `${n} days strong — you're an explorer! 🗺️`,
    },
  },

  achiever: {
    id: 'achiever',
    label: 'Middle School',
    gradeRange: '7–9',
    tone: 'motivating',
    accentColor: '#6EDC5F',
    bloomEmotion: 'encouraging',
    xpMultiplier: 1.2,
    statsCount: 4,
    quizDifficulty: 'medium',
    bloomMessages: {
      new:     'Ready to level up? Your first lesson is here.',
      good:    (n) => `${n} concept${n > 1 ? 's' : ''} down. Keep the momentum.`,
      streak2: (n) => `${n} day streak — that's real discipline.`,
      streak5: (n) => `${n} days in a row — you're unstoppable.`,
    },
  },

  master: {
    id: 'master',
    label: 'High School',
    gradeRange: '10–12',
    tone: 'academic',
    accentColor: '#7B3FE4',
    bloomEmotion: 'thinking',
    xpMultiplier: 1.5,
    statsCount: 4,
    quizDifficulty: 'hard',
    bloomMessages: {
      new:     'Your learning path starts now. Let\'s get to work.',
      good:    (n) => `${n} concept${n > 1 ? 's' : ''} completed. Progress compounds.`,
      streak2: (n) => `${n}-day streak. Consistency beats intensity.`,
      streak5: (n) => `${n} days in a row — mastery is built like this.`,
    },
  },
}

/**
 * @param {number|null|undefined} grade — student's grade (1–12)
 * @returns {typeof VARIANTS[keyof typeof VARIANTS]}
 */
export function getBloomVariant(grade) {
  const g = Number(grade)
  if (!g || g < 1)  return VARIANTS.sprout
  if (g <= 3)       return VARIANTS.sprout
  if (g <= 6)       return VARIANTS.explorer
  if (g <= 9)       return VARIANTS.achiever
  return VARIANTS.master
}

export function getBloomMessage({ accuracy, weakAreas = [] } = {}) {
  const areas = Array.isArray(weakAreas) ? weakAreas : []

  if (accuracy < 50) {
    return "Let's slow down and build this step by step 🌱"
  }

  if (areas.length > 0) {
    return `Let's improve ${areas[0]} together 🌿`
  }

  if (accuracy > 85) {
    return "You're doing amazing — keep going! 🌸"
  }

  return "You're growing stronger every day 🌾"
}

export { VARIANTS }
