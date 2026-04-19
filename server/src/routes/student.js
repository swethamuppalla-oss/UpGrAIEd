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

router.get('/curriculum', async (req, res, next) => {
  try {
    res.json([
      { _id: 'lvl1', name: 'Level 1 — Python Basics', status: 'completed', modules: [
        { _id: 'mod1', title: 'Introduction to Python', status: 'completed', percent: 100, isMustDo: true,  taskDescription: 'Run your first Python program.' },
        { _id: 'mod2', title: 'Variables & Data Types',  status: 'completed', percent: 100, isMustDo: true,  taskDescription: 'Declare variables of each type.' },
      ]},
      { _id: 'lvl2', name: 'Level 2 — Control Flow', status: 'active', modules: [
        { _id: 'mod3', title: 'Control Flow & Loops', status: 'active', percent: 75, isMustDo: true, taskDescription: 'Write a program with if/else and a for loop.' },
        { _id: 'mod4', title: 'Functions & Scope',    status: 'locked', percent: 0,  isMustDo: false, taskDescription: 'Define and call three functions.' },
      ]},
      { _id: 'lvl3', name: 'Level 3 — Data Structures', status: 'locked', modules: [
        { _id: 'mod5', title: 'Lists, Tuples & Dicts', status: 'locked', percent: 0, isMustDo: true, taskDescription: 'Use each collection type.' },
      ]},
    ])
  } catch (err) { next(err) }
})

export default router
