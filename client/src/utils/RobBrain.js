import packs from '../data/robBrainPacks.json'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function interpolateName(template, name) {
  if (name) {
    return template.replace('{name}', `, ${name}`)
  }
  return template.replace('{name}', '')
}

function interpolateDays(template, days, name) {
  return interpolateName(template.replace('{days}', days), name)
}

export function getGreeting(timeOfDay, userName) {
  const pool = packs.greetings[timeOfDay] || packs.greetings.afternoon
  return interpolateName(pick(pool), userName)
}

export function getInactivityMessage(daysSinceLogin, userName) {
  if (daysSinceLogin >= 3) {
    return interpolateDays(pick(packs.inactivity.days_3plus), daysSinceLogin, userName)
  }
  if (daysSinceLogin >= 2) {
    return interpolateName(pick(packs.inactivity.days_2), userName)
  }
  if (daysSinceLogin === 1) {
    return interpolateName(pick(packs.inactivity.days_1), userName)
  }
  return null
}

export function getQuickPrompts(currentModuleId) {
  if (currentModuleId && packs.quickPrompts[currentModuleId]) {
    return packs.quickPrompts[currentModuleId]
  }
  return packs.quickPrompts.default
}

export function getEncouragement() {
  return pick(packs.encouragements)
}

export function getFallback() {
  return { answer: pick(packs.fallbacks), emotion: 'thinking', confidence: 0, source: 'brain' }
}

export function query(userInput) {
  if (!userInput || typeof userInput !== 'string') return null

  const normalized = userInput.toLowerCase().trim()

  let bestModule = null
  let bestScore = 0

  for (const [, moduleData] of Object.entries(packs.modules)) {
    let score = 0
    for (const keyword of moduleData.keywords) {
      if (normalized.includes(keyword)) {
        score += keyword.split(' ').length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestModule = moduleData
    }
  }

  if (bestScore > 0 && bestModule) {
    const confidence = Math.min(88, 45 + bestScore * 8)
    return {
      answer: pick(bestModule.responses),
      emotion: bestModule.emotion || 'teaching',
      confidence,
      source: 'brain',
    }
  }

  return null
}
