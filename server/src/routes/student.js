import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'
import { StudentProgress } from '../models/StudentProgress.js'

const router = Router()
router.use(requireRole('student'))

function normalizeModuleKey(key) {
  return ({ mod1: 'L1M1', mod2: 'L1M2', mod3: 'L1M3', mod4: 'L1M4', mod5: 'L2M1' }[key] || key)
}

function normalizeModuleList(list, fallback = []) {
  const source = Array.isArray(list) ? list : fallback
  return [...new Set(source.map(normalizeModuleKey))]
}

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
