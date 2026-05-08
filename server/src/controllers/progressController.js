import { StudentProgress, NEXT_MODULE_MAP } from '../models/StudentProgress.js'
import { getStudentWeakAreas } from '../services/studentWeakAreaService.js'

// ── helpers ──────────────────────────────────────────────────────────────────

function toDateOnly(date) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysBetween(a, b) {
  return Math.floor((toDateOnly(b) - toDateOnly(a)) / 86400000)
}

function userId(req) {
  return req.user._id?.toString() || req.user.id?.toString() || 'demo'
}

async function getOrCreate(uid) {
  let doc = await StudentProgress.findOne({ userId: uid })
  if (!doc) {
    doc = await StudentProgress.create({ userId: uid })
  }
  return doc
}

// ── controllers ──────────────────────────────────────────────────────────────

// GET /api/progress/me
export async function getMyProgress(req, res, next) {
  try {
    const doc = await getOrCreate(userId(req))
    res.json({ success: true, data: doc })
  } catch (err) { next(err) }
}

// GET /api/progress/dashboard
export async function getDashboard(req, res, next) {
  try {
    const uid = userId(req)
    const [doc, weakAreas] = await Promise.all([
      getOrCreate(uid),
      getStudentWeakAreas(uid),
    ])

    const nextModule = doc.completedModules.length > 0
      ? (NEXT_MODULE_MAP[doc.completedModules[doc.completedModules.length - 1]] || null)
      : (doc.unlockedModules[0] || 'L1M1')

    res.json({
      success: true,
      data: {
        totalXP:          doc.totalXP,
        streakDays:       doc.streakDays,
        completedCount:   doc.completedModules.length,
        currentLevel:     doc.currentLevel,
        nextModule,
        badges:           doc.badges,
        completedModules: doc.completedModules,
        unlockedModules:  doc.unlockedModules,
        lastCompletedAt:  doc.lastCompletedAt,
        weakAreas,
      },
    })
  } catch (err) { next(err) }
}

// POST /api/progress/complete-module
export async function completeModule(req, res, next) {
  try {
    const { moduleId, xp = 0, badge } = req.body

    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required' })
    }

    const doc = await getOrCreate(userId(req))
    const now = new Date()
    let streakUpdated = false

    // Idempotent — skip if already completed
    const alreadyDone = doc.completedModules.includes(moduleId)

    if (!alreadyDone) {
      // Mark complete
      doc.completedModules.push(moduleId)

      // Add XP
      doc.totalXP += Number(xp) || 0

      // Recompute level
      doc.currentLevel = doc.computeLevel()

      // Add badge (dedup)
      if (badge && !doc.badges.includes(badge)) {
        doc.badges.push(badge)
      }

      // Unlock next module
      const next = NEXT_MODULE_MAP[moduleId]
      if (next && !doc.unlockedModules.includes(next)) {
        doc.unlockedModules.push(next)
      }

      // Streak logic
      if (doc.lastCompletedAt) {
        const gap = daysBetween(doc.lastCompletedAt, now)
        if (gap === 0) {
          // Same day — no change
        } else if (gap === 1) {
          doc.streakDays += 1
          streakUpdated = true
        } else {
          // Gap > 1 day — reset
          doc.streakDays = 1
          streakUpdated = true
        }
      } else {
        // First completion ever
        doc.streakDays = 1
        streakUpdated = true
      }

      doc.lastCompletedAt = now
      await doc.save()
    }

    const nextModule = NEXT_MODULE_MAP[moduleId] || null

    res.json({
      success: true,
      alreadyCompleted: alreadyDone,
      data: {
        totalXP:         doc.totalXP,
        currentLevel:    doc.currentLevel,
        streakDays:      doc.streakDays,
        streakUpdated,
        badges:          doc.badges,
        nextModule,
        unlockedModules: doc.unlockedModules,
        completedModules: doc.completedModules,
      },
    })
  } catch (err) { next(err) }
}

// POST /api/progress/login-check
export async function loginCheck(req, res, next) {
  try {
    const doc = await getOrCreate(userId(req))
    const now = new Date()

    let comeback = false
    let daysAway = 0

    if (doc.lastLoginAt) {
      daysAway = daysBetween(doc.lastLoginAt, now)
      comeback = daysAway >= 2

      // If came back after a long gap, reset streak on next completion
      // (streak is only updated on module complete, not on login)
    }

    doc.lastLoginAt = now
    await doc.save()

    res.json({
      success: true,
      data: {
        comeback,
        daysAway,
        streakDays:  doc.streakDays,
        totalXP:     doc.totalXP,
        currentLevel: doc.currentLevel,
      },
    })
  } catch (err) { next(err) }
}
