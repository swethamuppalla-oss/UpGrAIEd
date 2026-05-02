/**
 * Central default values for all config-driven features.
 * Each key matches the MongoDB SiteConfig key used in the CMS.
 * Components should prefer these over inline literals so there
 * is a single place to update fallback content.
 */

export const DEFAULT_MASCOT = {
  bloom: {
    main_image: null,
    avatar: null,
  },
}

export const DEFAULT_UI = {
  hero: {
    title: null,
    subtitle: null,
    cta_primary: 'Book Free Demo',
  },
}

export const DEFAULT_BLOOM_PERSONALITY = {
  xp_thresholds: {
    fire: 200,
    celebrating: 100,
    excited: 50,
  },
  accuracy_thresholds: {
    struggling: 40,
    warming: 60,
  },
  streak_thresholds: {
    legendary: 14,
    unstoppable: 7,
    proud: 3,
  },
}

export const DEFAULT_PRICING = {
  plans: [],
}

export const DEFAULT_THEME = {
  primaryColor:   '#6EDC5F',  // Bloom green
  accentColor:    '#63C7FF',  // sky blue
  highlightColor: '#FFD95A',  // yellow
}

export const DEFAULT_FEATURES = {
  bookDemo:        true,
  pricing:         true,
  aiLearningTool:  true,
  studyExplainer:  false,
}

export const DEFAULT_CURRICULUM = {
  modules: [
    { module: '01', title: 'What is AI?',      desc: 'Understanding AI in everyday life. How it works, where it lives.', icon: '🧠', emotion: 'curious' },
    { module: '02', title: 'Talking to AI',    desc: 'Prompting as a skill. Getting AI to do exactly what you want.',     icon: '💬', emotion: 'happy' },
    { module: '03', title: 'AI Tools Lab',     desc: 'Hands-on practice with real AI tools in a safe sandbox.',           icon: '🔬', emotion: 'excited' },
    { module: '04', title: 'Creative AI',      desc: 'Use AI for art, stories, and invention. Creativity amplified.',     icon: '🎨', emotion: 'celebrating' },
    { module: '05', title: 'AI & Thinking',    desc: 'Critical thinking with AI — when to trust it and when not to.',    icon: '⚡', emotion: 'thinking' },
    { module: '06', title: 'Building with AI', desc: 'Mini-projects: build something real using AI tools.',               icon: '🔨', emotion: 'encouraging' },
  ],
}

/** Deep-merge a config section with its defaults. */
export function withDefaults(configSection, defaults) {
  if (!configSection) return defaults
  return deepMerge(defaults, configSection)
}

function deepMerge(target, source) {
  const out = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key])
    } else {
      out[key] = source[key]
    }
  }
  return out
}
