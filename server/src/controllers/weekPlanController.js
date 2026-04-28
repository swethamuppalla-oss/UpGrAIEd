import { WeekPlan } from '../models/WeekPlan.js'
import { Chapter } from '../models/Chapter.js'
import { ExamResult } from '../models/ExamResult.js'

export const getWeekPlan = async (req, res) => {
  try {
    const plan = await WeekPlan.findOne({
      _id: req.params.id,
      $or: [
        { parentId: req.user._id },
        { studentId: req.user._id }
      ]
    }).populate('chapterId', 'title subject grade')
    if (!plan) return res.status(404).json({
      error: { message: 'Plan not found' }
    })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

export const getStudentCurrentPlan = async (req, res) => {
  try {
    const plan = await WeekPlan.findOne({
      studentId: req.user._id,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .populate('chapterId', 'title subject grade')
    res.json(plan || null)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

export const approveWeekPlan = async (req, res) => {
  try {
    const plan = await WeekPlan.findOneAndUpdate(
      { _id: req.params.id, parentId: req.user._id },
      {
        status: 'active',
        parentApproved: true,
        parentApprovedAt: new Date(),
        weekStartDate: new Date()
      },
      { new: true }
    )
    if (!plan) return res.status(404).json({
      error: { message: 'Plan not found' }
    })
    res.json({ success: true, plan })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

export const completeDayInPlan = async (req, res) => {
  try {
    const { quizScore, timeSpentMinutes } = req.body
    const plan = await WeekPlan.findOne({
      _id: req.params.id,
      studentId: req.user._id
    })
    if (!plan) return res.status(404).json({
      error: { message: 'Plan not found' }
    })

    const dayIdx = plan.days.findIndex(
      d => d.dayNumber === parseInt(req.params.dayNumber)
    )
    if (dayIdx !== -1) {
      plan.days[dayIdx].isComplete = true
      plan.days[dayIdx].completedAt = new Date()
      if (quizScore !== undefined)
        plan.days[dayIdx].quizScore = quizScore
      if (timeSpentMinutes !== undefined)
        plan.days[dayIdx].timeSpentMinutes = timeSpentMinutes
    }

    const completedDays = plan.days.filter(d => d.isComplete).length
    plan.overallProgress = Math.round(
      (completedDays / plan.days.length) * 100
    )

    if (completedDays === plan.days.length) {
      plan.status = 'complete'
    }

    await plan.save()
    res.json({ success: true, plan })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

export const submitExam = async (req, res) => {
  try {
    const { answers, timeTakenMinutes } = req.body
    const plan = await WeekPlan.findOne({
      _id: req.params.id,
      studentId: req.user._id
    })
    if (!plan) return res.status(404).json({
      error: { message: 'Plan not found' }
    })

    const examDay = plan.days.find(d => d.type === 'exam')
    if (!examDay?.examQuestions) return res.status(400).json({
      error: { message: 'No exam found for this week' }
    })

    let correct = 0
    const processedAnswers = answers.map((answer, i) => {
      const question = examDay.examQuestions[i]
      const isCorrect = answer.selectedIndex === question?.correctIndex
      if (isCorrect) correct++
      return {
        questionIndex: i,
        question: question?.question,
        selectedIndex: answer.selectedIndex,
        correctIndex: question?.correctIndex,
        isCorrect,
        timeTakenSeconds: answer.timeTakenSeconds || 0
      }
    })

    const score = Math.round(
      (correct / examDay.examQuestions.length) * 100
    )

    const weakConcepts = processedAnswers
      .filter(a => !a.isCorrect)
      .map((a, i) => examDay.examQuestions[i]?.concept)
      .filter(Boolean)

    const strongConcepts = processedAnswers
      .filter(a => a.isCorrect)
      .map((a, i) => examDay.examQuestions[i]?.concept)
      .filter(Boolean)

    const result = await ExamResult.create({
      weekPlanId: plan._id,
      studentId: req.user._id,
      chapterId: plan.chapterId,
      answers: processedAnswers,
      totalQuestions: examDay.examQuestions.length,
      correctAnswers: correct,
      score,
      timeTakenMinutes,
      weakConcepts,
      strongConcepts
    })

    plan.examScore = score
    plan.examTakenAt = new Date()
    await plan.save()

    res.json({
      success: true,
      score,
      correct,
      total: examDay.examQuestions.length,
      weakConcepts,
      strongConcepts,
      resultId: result._id
    })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}
