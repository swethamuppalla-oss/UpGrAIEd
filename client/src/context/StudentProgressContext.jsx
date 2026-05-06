import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getProgressDashboard, apiCompleteModule } from '../services'

const STORAGE_KEY = 'upgraied_student_progress'

const MODULE_MAP = {
  L1M1: { level: 1, module: 1, title: 'ROB Saves Your Day with AI', xp: 50, badge: 'Time Tamer', badgeEmoji: '⏰', unlocks: 'L1M2' },
  L1M2: { level: 1, module: 2, title: 'Better Questions, Better Answers', xp: 60, badge: 'Prompt Wizard', badgeEmoji: '💬', unlocks: 'L1M3' },
  L1M3: { level: 1, module: 3, title: 'ROB Becomes Your Tutor', xp: 75, badge: 'Learning Champion', badgeEmoji: '📚', unlocks: 'L1M4' },
  L1M4: { level: 1, module: 4, title: "Catch ROB's Wrong Facts", xp: 80, badge: 'Fact Checker', badgeEmoji: '🔍', unlocks: 'L2M1' },
  L2M1: { level: 2, module: 5, title: 'Applied Prompting Kickoff', xp: 100, badge: 'Level Two Starter', badgeEmoji: '🚀', unlocks: null },
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

const LEGACY_MODULE_MAP = {
  mod1: 'L1M1',
  mod2: 'L1M2',
  mod3: 'L1M3',
  mod4: 'L1M4',
  mod5: 'L2M1',
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a, b) {
  if (!a || !b) return Infinity
  const msPerDay = 86400000
  return Math.floor((new Date(b) - new Date(a)) / msPerDay)
}

function normalizeModuleKey(key) {
  return LEGACY_MODULE_MAP[key] || key
}

function normalizeModuleList(list, fallback = []) {
  const source = Array.isArray(list) ? list : fallback
  return [...new Set(source.map(normalizeModuleKey))]
}

function readState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      ...DEFAULT_STATE,
      ...parsed,
      completedModules: normalizeModuleList(parsed.completedModules),
      unlockedModules: normalizeModuleList(parsed.unlockedModules, ['L1M1']),
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const StudentProgressContext = createContext(null)

export function StudentProgressProvider({ children }) {
  const { user, token } = useAuth()
  const [progress, setProgress] = useState(readState)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!token || user?.role !== 'student') return

    const syncProgress = async () => {
      setIsSyncing(true)
      try {
        const res = await getProgressDashboard()
        if (res.success && res.data) {
          const cloudData = {
            completedModules: normalizeModuleList(res.data.completedModules),
            totalXP: res.data.totalXP || 0,
            streakDays: res.data.streakDays || 0,
            unlockedModules: normalizeModuleList(res.data.unlockedModules, ['L1M1']),
            badges: res.data.badges || [],
            lastLoginAt: res.data.lastLoginAt,
          }
          setProgress((prev) => ({ ...prev, ...cloudData }))
          writeState({ ...progress, ...cloudData })
        }
      } catch (err) {
        console.error('Failed to sync student progress:', err)
      } finally {
        setIsSyncing(false)
      }
    }

    syncProgress()
  }, [token, user?.role])

  useEffect(() => {
    writeState(progress)
  }, [progress])

  const completeModule = useCallback(async (moduleKey) => {
    const meta = MODULE_MAP[moduleKey]
    if (!meta) return

    setProgress((prev) => {
      if (prev.completedModules.includes(moduleKey)) return prev

      const today = todayISO()
      const newUnlocked = meta.unlocks && !prev.unlockedModules.includes(meta.unlocks)
        ? [...prev.unlockedModules, meta.unlocks]
        : prev.unlockedModules

      const newBadges = meta.badge && !prev.badges.includes(meta.badge)
        ? [...prev.badges, meta.badge]
        : prev.badges

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

    if (token && user?.role === 'student') {
      try {
        await apiCompleteModule(moduleKey, meta.xp, meta.badge)
      } catch (err) {
        console.error('Failed to sync module completion to backend:', err)
      }
    }
  }, [token, user?.role])

  const isCompleted = useCallback((moduleKey) => {
    return progress.completedModules.includes(moduleKey)
  }, [progress.completedModules])

  const isUnlocked = useCallback((moduleKey) => {
    return progress.unlockedModules.includes(moduleKey)
  }, [progress.unlockedModules])

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
      isSyncing,
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
