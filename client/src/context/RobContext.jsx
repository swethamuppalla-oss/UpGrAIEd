import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getROBProgress, saveROBXP, getRobCompanion, saveRobCompanionState } from '../services'
import { ROB_LEVEL_TITLES } from '../data/robLessons'

const RobContext = createContext(null)

const XP_LEVELS = [0, 200, 500, 1000, 2000, 5000, 8000, 12000, 17000, 23000, 30000, 38000]

function readSavedState() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('rob_state') || '{}')
  } catch {
    return {}
  }
}

function getLevelFromXp(xp) {
  let level = 1
  for (let index = 0; index < XP_LEVELS.length; index += 1) {
    const current = XP_LEVELS[index]
    const next = XP_LEVELS[index + 1]
    if (xp >= current && (next === undefined || xp < next)) {
      level = index + 1
      break
    }
  }
  return level
}

export function RobProvider({ children }) {
  const saved = readSavedState()
  const syncTimerRef = useRef(null)

  const [robXP, setRobXP] = useState(saved.xp || 0)
  const [robLevel, setRobLevel] = useState(saved.level || 1)
  const [badges, setBadges] = useState(saved.badges || [])
  const [lessonsCompleted, setLessonsCompleted] = useState(saved.lessonsCompleted || [])
  const [questionsAnswered, setQuestionsAnswered] = useState(saved.questionsAnswered || 0)
  const [correctAnswers, setCorrectAnswers] = useState(saved.correctAnswers || 0)
  const [xpToday, setXpToday] = useState(saved.xpToday || 0)

  // Companion / naming state
  const [robName, setRobNameState] = useState(saved.robName || 'Bloom')
  const [robColor, setRobColorState] = useState(saved.robColor || 'purple')
  const [companionData, setCompanionData] = useState(null)

  const persistState = (nextState) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('rob_state', JSON.stringify(nextState))
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return undefined

    let cancelled = false

    getROBProgress()
      .then((remote) => {
        if (cancelled || !remote) return
        setRobXP(remote.xp || 0)
        setRobLevel(remote.level || getLevelFromXp(remote.xp || 0))
        setBadges(remote.badges || [])
        setLessonsCompleted(remote.lessonsCompleted || [])
        setQuestionsAnswered(remote.questionsAnswered || 0)
        setCorrectAnswers(remote.correctAnswers || 0)
        setXpToday(remote.xpToday || 0)
        if (remote.robName) setRobNameState(remote.robName)
        if (remote.robColor) setRobColorState(remote.robColor)
        persistState({
          xp: remote.xp || 0,
          level: remote.level || getLevelFromXp(remote.xp || 0),
          badges: remote.badges || [],
          lessonsCompleted: remote.lessonsCompleted || [],
          questionsAnswered: remote.questionsAnswered || 0,
          correctAnswers: remote.correctAnswers || 0,
          xpToday: remote.xpToday || 0,
          robName: remote.robName || 'Bloom',
          robColor: remote.robColor || 'purple',
        })
      })
      .catch(() => {})

    // Fetch companion context
    getRobCompanion()
      .then((data) => { if (!cancelled) setCompanionData(data) })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const nextState = {
      xp: robXP,
      level: robLevel,
      badges,
      lessonsCompleted,
      questionsAnswered,
      correctAnswers,
      xpToday,
      robName,
      robColor,
    }

    persistState(nextState)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return undefined

    window.clearTimeout(syncTimerRef.current)
    syncTimerRef.current = window.setTimeout(() => {
      saveROBXP(robXP, robLevel, badges, {
        lessonsCompleted,
        questionsAnswered,
        correctAnswers,
        xpToday,
      }).catch(() => {})
    }, 500)

    return () => window.clearTimeout(syncTimerRef.current)
  }, [badges, correctAnswers, lessonsCompleted, questionsAnswered, robColor, robLevel, robName, robXP, xpToday])

  const addXP = (amount) => {
    setRobXP(prev => {
      const nextXp = prev + amount
      setRobLevel(getLevelFromXp(nextXp))
      return nextXp
    })
    setXpToday(prev => prev + amount)
  }

  const addBadge = (badgeId) => {
    if (!badgeId) return
    setBadges(prev => (prev.includes(badgeId) ? prev : [...prev, badgeId]))
  }

  const completeLesson = (lessonId, xpEarned) => {
    setLessonsCompleted(prev => (
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    ))
    addXP(xpEarned)
  }

  const recordAnswer = (correct) => {
    setQuestionsAnswered(prev => prev + 1)
    if (correct) {
      setCorrectAnswers(prev => prev + 1)
      addXP(15)
    }
  }

  const setRobName = useCallback((name, color) => {
    const trimmed = String(name).trim().slice(0, 20)
    setRobNameState(trimmed)
    if (color) setRobColorState(color)
    saveRobCompanionState({ robName: trimmed, robColor: color || 'cyan' }).catch(() => {})
  }, [])

  const currentLevelXP = XP_LEVELS[robLevel - 1] || 0
  const nextLevelXP = XP_LEVELS[robLevel] || XP_LEVELS[XP_LEVELS.length - 1]
  const levelProgress = nextLevelXP === currentLevelXP
    ? 100
    : Math.max(0, Math.min(100, ((robXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100))
  const levelTitle = ROB_LEVEL_TITLES[robLevel] || 'Bloom Master'
  const accuracy = questionsAnswered > 0
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0

  const value = useMemo(() => ({
    robXP,
    robLevel,
    robName,
    robColor,
    companionData,
    badges,
    lessonsCompleted,
    questionsAnswered,
    correctAnswers,
    xpToday,
    levelProgress,
    levelTitle,
    nextLevelXP,
    accuracy,
    addXP,
    addBadge,
    completeLesson,
    recordAnswer,
    setRobName,
  }), [
    accuracy,
    badges,
    companionData,
    correctAnswers,
    lessonsCompleted,
    levelProgress,
    levelTitle,
    nextLevelXP,
    questionsAnswered,
    robColor,
    robLevel,
    robName,
    robXP,
    setRobName,
    xpToday,
  ])

  return (
    <RobContext.Provider value={value}>
      {children}
    </RobContext.Provider>
  )
}

export const useROB = () => useContext(RobContext)
