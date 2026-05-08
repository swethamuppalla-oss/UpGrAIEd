import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { StudentProgress } from '../models/StudentProgress.js'
import { Video } from '../models/Video.js'

const router = Router()
router.use(requireRole('student'))

function normalizeModuleKey(key) {
  return ({ mod1: 'L1M1', mod2: 'L1M2', mod3: 'L1M3', mod4: 'L1M4', mod5: 'L2M1' }[key] || key)
}

function normalizeModuleList(list, fallback = []) {
  const source = Array.isArray(list) ? list : fallback
  return [...new Set(source.map(normalizeModuleKey))]
}

const DASHBOARD_MODULES = [
  { _id: 'L1M1', title: 'ROB Saves Your Day with AI' },
  { _id: 'L1M2', title: 'Better Questions, Better Answers' },
  { _id: 'L1M3', title: 'ROB Becomes Your Tutor' },
  { _id: 'L1M4', title: "Catch ROB's Wrong Facts" },
  { _id: 'L2M1', title: 'Applied Prompting Kickoff' },
]

router.get('/dashboard', async (req, res, next) => {
  try {
    const progress = await StudentProgress.findOne({ userId: req.user._id.toString() })
    const completed = normalizeModuleList(progress?.completedModules)
    const unlocked = normalizeModuleList(progress?.unlockedModules, ['L1M1'])
    const activeModule = DASHBOARD_MODULES.find((mod) => unlocked.includes(mod._id) && !completed.includes(mod._id))
      || DASHBOARD_MODULES.find((mod) => !completed.includes(mod._id))
      || DASHBOARD_MODULES[DASHBOARD_MODULES.length - 1]

    const questionsAnswered = req.user.robProgress?.questionsAnswered || 0
    const correctAnswers = req.user.robProgress?.correctAnswers || 0
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 70
    const overallPercent = Math.round((completed.length / DASHBOARD_MODULES.length) * 100)

    const curriculum = [
      {
        _id: 'lvl1',
        name: 'Level 1 - AI Foundations',
        status: completed.length >= 4 ? 'completed' : 'active',
        modules: DASHBOARD_MODULES.slice(0, 4).map((mod) => {
          const isDone = completed.includes(mod._id)
          const isLocked = !unlocked.includes(mod._id) && !isDone
          return { ...mod, status: isDone ? 'completed' : isLocked ? 'locked' : 'active', percent: isDone ? 100 : 0 }
        }),
      },
      {
        _id: 'lvl2',
        name: 'Level 2 - Applied Prompting',
        status: unlocked.includes('L2M1') || completed.includes('L2M1') ? 'active' : 'locked',
        modules: DASHBOARD_MODULES.slice(4).map((mod) => {
          const isDone = completed.includes(mod._id)
          const isLocked = !unlocked.includes(mod._id) && !isDone
          return { ...mod, status: isDone ? 'completed' : isLocked ? 'locked' : 'active', percent: isDone ? 100 : 0 }
        }),
      },
    ]

    const dashboardSummary = {
      name: req.user.name || 'Student',
      grade: req.user.grade ?? 8,
      currentConcept: activeModule.title,
      progress: overallPercent,
      accuracy,
      timeSpent: progress?.timeSpent || '0h 00m',
      completed: completed.length,
      weakAreas: req.user.robProgress?.weakTopics || [],
    }

    res.json({
      ...dashboardSummary,
      accuracy,
      progress: overallPercent,
      stats: {
        ...dashboardSummary,
        grade: dashboardSummary.grade,
        accuracy,
        progress: overallPercent,
        modulesCompleted: completed.length,
        streak: progress?.streakDays || req.user.loginStreak || 0,
      },
      progressData: {
        currentModule: { ...activeModule, percent: completed.includes(activeModule._id) ? 100 : 0 },
        overallPercent,
      },
      levels: [
        { id: '1', name: 'Level 1 - AI Foundations', status: completed.length >= 4 ? 'completed' : 'active' },
        { id: '2', name: 'Level 2 - Applied Prompting', status: unlocked.includes('L2M1') ? 'active' : 'locked' },
        { id: '3', name: 'Level 3 - Guided Learning', status: 'locked' },
      ],
      curriculum,
    })
  } catch (err) { next(err) }
})

router.get('/stats', async (_req, res, next) => {
  try {
    res.json({ currentLevel: 1, modulesCompleted: 0, streak: 0, hoursLearned: 0 })
  } catch (err) { next(err) }
})

router.get('/progress', async (_req, res, next) => {
  try {
    res.json({
      currentModule: { _id: 'L1M1', title: 'ROB Saves Your Day with AI', percent: 0 },
      overallPercent: 0,
    })
  } catch (err) { next(err) }
})

router.get('/levels', async (req, res, next) => {
  try {
    const progress = await StudentProgress.findOne({ userId: req.user._id.toString() })
    const completed = normalizeModuleList(progress?.completedModules)
    const unlocked = normalizeModuleList(progress?.unlockedModules, ['L1M1'])
    const levelOneDone = ['L1M1', 'L1M2', 'L1M3', 'L1M4'].every((id) => completed.includes(id))
    const levelTwoOpen = unlocked.includes('L2M1') || completed.includes('L2M1')

    res.json([
      { id: '1', name: 'Level 1 - AI Foundations', status: levelOneDone ? 'completed' : 'active' },
      { id: '2', name: 'Level 2 - Applied Prompting', status: levelTwoOpen ? 'active' : 'locked' },
      { id: '3', name: 'Level 3 - Guided Learning', status: 'locked' },
    ])
  } catch (err) { next(err) }
})

router.get('/curriculum', async (req, res, next) => {
  try {
    const progress = await StudentProgress.findOne({ userId: req.user._id.toString() })
    const completed = normalizeModuleList(progress?.completedModules)
    const unlocked = normalizeModuleList(progress?.unlockedModules, ['L1M1'])

    const curriculum = [
      {
        _id: 'lvl1',
        name: 'Level 1 - AI Foundations',
        status: 'active',
        modules: [
          { _id: 'L1M1', title: 'ROB Saves Your Day with AI', isMustDo: true, taskDescription: 'See how AI can help organize a real day.' },
          { _id: 'L1M2', title: 'Better Questions, Better Answers', isMustDo: true, taskDescription: 'Practice writing stronger prompts for smarter AI answers.' },
          { _id: 'L1M3', title: 'ROB Becomes Your Tutor', isMustDo: true, taskDescription: 'Use AI as a learning coach for tough topics.' },
          { _id: 'L1M4', title: "Catch ROB's Wrong Facts", isMustDo: true, taskDescription: 'Spot mistakes and verify AI answers carefully.' },
        ],
      },
      {
        _id: 'lvl2',
        name: 'Level 2 - Applied Prompting',
        status: 'locked',
        modules: [
          { _id: 'L2M1', title: 'Applied Prompting Kickoff', isMustDo: true, taskDescription: 'Begin Level 2 by learning structured prompt patterns.' },
        ],
      },
    ]

    const dbVideos = await Video.find().sort({ order: 1 })
    if (dbVideos.length > 0) {
      curriculum.push({
        _id: 'lvl3_dynamic',
        name: 'New Lessons (CMS)',
        status: 'active',
        modules: dbVideos.map((v, i) => ({
          _id: v._id.toString(),
          title: v.title,
          thumbnail: v.thumbnail,
          url: v.url,
          isMustDo: false,
          taskDescription: v.description,
          isDynamic: true,
        }))
      })
    }

    const mapped = curriculum.map((level) => {
      const modules = level.modules.map((mod) => {
        const isDone = completed.includes(mod._id)
        const isLock = !unlocked.includes(mod._id) && !isDone

        return {
          ...mod,
          status: isDone ? 'completed' : isLock ? 'locked' : 'active',
          percent: isDone ? 100 : 0,
        }
      })

      const allDone = modules.every((mod) => mod.status === 'completed')
      const anyActive = modules.some((mod) => mod.status === 'active')

      return {
        ...level,
        modules,
        status: allDone ? 'completed' : anyActive ? 'active' : 'locked',
      }
    })

    res.json(mapped)
  } catch (err) { next(err) }
})

export default router
