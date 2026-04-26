import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'upgraied_student_progress'

const MODULE_MAP = {
  'L1M1': { level: 1, module: 1, title: 'ROB Saves Your Day with AI',     xp: 50,  badge: 'Time Tamer',           badgeEmoji: '⏰', unlocks: 'L1M2' },
  'L1M2': { level: 1, module: 2, title: 'Better Questions, Better Answers', xp: 60,  badge: 'Prompt Wizard',        badgeEmoji: '💬', unlocks: 'L1M3' },
  'L1M3': { level: 1, module: 3, title: 'ROB Becomes Your Tutor',           xp: 75,  badge: 'Learning Champion',    badgeEmoji: '📚', unlocks: 'L1M4' },
  'L1M4': { level: 1, module: 4, title: "Catch ROB's Wrong Facts",           xp: 80,  badge: 'Fact Checker',         badgeEmoji: '🔍', unlocks: null   },
}

const DEFAULT_STATE = {
  completedModules: [],
  totalXP: 0,
  streakDays: 0,
  lastStreakDate: null,
  unlockedModules: ['L1M1'],
  badges: [],
  lastLoginAt: null,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a, b) {
  if (!a || !b) return Infinity
  const msPerDay = 86400000
  return Math.floor((new Date(b) - new Date(a)) / msPerDay)
}

function readState() {
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// ─── Context ──────────────────────────────────────────────────────────────────

const StudentProgressContext = createContext(null)

export function StudentProgressProvider({ children }) {
  const [progress, setProgress] = useState(readState)

  // Sync to localStorage whenever state changes
  useEffect(() => {
    writeState(progress)
  }, [progress])

  // Update streak and lastLoginAt on mount
  useEffect(() => {
    const today = todayISO()
    setProgress(prev => {
      const daysSinceLast = daysBetween(prev.lastStreakDate, today)
      let streakDays = prev.streakDays

      if (prev.lastStreakDate === today) {
        // already logged in today — no change
      } else if (daysSinceLast === 1) {
        // consecutive day — increment
        streakDays = streakDays + 1
      } else if (daysSinceLast > 1) {
        // streak broken — reset
        streakDays = prev.completedModules.length > 0 ? 1 : 0
      } else {
        // first ever login or same day
        streakDays = Math.max(streakDays, prev.completedModules.length > 0 ? 1 : 0)
      }

      return {
        ...prev,
        lastLoginAt: new Date().toISOString(),
        lastStreakDate: today,
        streakDays,
      }
    })
  }, [])

  const completeModule = useCallback((moduleKey) => {
    const meta = MODULE_MAP[moduleKey]
    if (!meta) return

    setProgress(prev => {
      if (prev.completedModules.includes(moduleKey)) return prev

      const today = todayISO()
      const newUnlocked = meta.unlocks && !prev.unlockedModules.includes(meta.unlocks)
        ? [...prev.unlockedModules, meta.unlocks]
        : prev.unlockedModules

      const newBadges = meta.badge && !prev.badges.includes(meta.badge)
        ? [...prev.badges, meta.badge]
        : prev.badges

      // Streak: if they complete a module today and didn't already update streak
      const daysSinceLast = daysBetween(prev.lastStreakDate, today)
      const streakDays = daysSinceLast <= 1 ? Math.max(prev.streakDays, 1) : 1

      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleKey],
        totalXP: prev.totalXP + meta.xp,
        unlockedModules: newUnlocked,
        badges: newBadges,
        streakDays,
        lastStreakDate: today,
        lastLoginAt: new Date().toISOString(),
      }
    })
  }, [])

  const isCompleted = useCallback((moduleKey) => {
    return progress.completedModules.includes(moduleKey)
  }, [progress.completedModules])

  const isUnlocked = useCallback((moduleKey) => {
    return progress.unlockedModules.includes(moduleKey)
  }, [progress.unlockedModules])

  // Inactivity = last login was more than 2 days ago
  const isInactive = useCallback(() => {
    if (!progress.lastLoginAt) return false
    const days = daysBetween(progress.lastLoginAt.slice(0, 10), todayISO())
    return days >= 2
  }, [progress.lastLoginAt])

  const resetProgress = useCallback(() => {
    const fresh = { ...DEFAULT_STATE, lastLoginAt: new Date().toISOString() }
    setProgress(fresh)
    writeState(fresh)
  }, [])

  return (
    <StudentProgressContext.Provider value={{
      progress,
      completeModule,
      isCompleted,
      isUnlocked,
      isInactive,
      resetProgress,
      MODULE_MAP,
    }}>
      {children}
    </StudentProgressContext.Provider>
  )
}

export function useStudentProgress() {
  const ctx = useContext(StudentProgressContext)
  if (!ctx) throw new Error('useStudentProgress must be used inside StudentProgressProvider')
  return ctx
}

export { MODULE_MAP }
