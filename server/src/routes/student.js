import { Router } from 'express'
import { requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireRole('student'))

router.get('/stats', async (req, res, next) => {
  try {
    res.json({ currentLevel: 3, modulesCompleted: 12, streak: 7, hoursLearned: 18.5 })
  } catch (err) { next(err) }
})

router.get('/progress', async (req, res, next) => {
  try {
    res.json({ currentModule: { _id: 'mod3', title: 'Control Flow & Loops', percent: 75 }, overallPercent: 50 })
  } catch (err) { next(err) }
})

router.get('/levels', async (req, res, next) => {
  try {
    res.json([
      { id: '1', name: 'Level 1 — Python Basics',  status: 'completed' },
      { id: '2', name: 'Level 2 — Control Flow',   status: 'active'    },
      { id: '3', name: 'Level 3 — Functions',      status: 'locked'    },
    ])
  } catch (err) { next(err) }
})

import { StudentProgress } from '../models/StudentProgress.js'

router.get('/curriculum', async (req, res, next) => {
  try {
    const progress = await StudentProgress.findOne({ userId: req.user._id })
    const completed = progress?.completedModules || []
    const unlocked = progress?.unlockedModules || ['mod1']

    const curriculum = [
      { _id: 'lvl1', name: 'Level 1 — Python Basics', status: 'completed', modules: [
        { _id: 'mod1', title: 'Introduction to Python', isMustDo: true,  taskDescription: 'Run your first Python program.' },
        { _id: 'mod2', title: 'Variables & Data Types',  isMustDo: true,  taskDescription: 'Declare variables of each type.' },
      ]},
      { _id: 'lvl2', name: 'Level 2 — Control Flow', status: 'active', modules: [
        { _id: 'mod3', title: 'Control Flow & Loops', isMustDo: true, taskDescription: 'Write a program with if/else and a for loop.' },
        { _id: 'mod4', title: 'Functions & Scope',    isMustDo: false, taskDescription: 'Define and call three functions.' },
      ]},
      { _id: 'lvl3', name: 'Level 3 — Data Structures', status: 'locked', modules: [
        { _id: 'mod5', title: 'Lists, Tuples & Dicts', isMustDo: true, taskDescription: 'Use each collection type.' },
      ]},
    ]

    // Map status and percent based on real DB progress
    const mapped = curriculum.map(lvl => {
      const mappedModules = lvl.modules.map(mod => {
        const isDone = completed.includes(mod._id)
        const isLock = !unlocked.includes(mod._id) && !isDone
        return {
          ...mod,
          status: isDone ? 'completed' : isLock ? 'locked' : 'active',
          percent: isDone ? 100 : 0
        }
      })
      
      const allDone = mappedModules.every(m => m.status === 'completed')
      const anyActive = mappedModules.some(m => m.status === 'active')
      
      return {
        ...lvl,
        modules: mappedModules,
        status: allDone ? 'completed' : anyActive ? 'active' : 'locked'
      }
    })

    res.json(mapped)
  } catch (err) { next(err) }
})

export default router
