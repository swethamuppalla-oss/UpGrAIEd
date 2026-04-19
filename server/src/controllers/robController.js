import RobKnowledge from '../models/RobKnowledge.js'
import User from '../models/User.js'

// ── Companion / Greeting ────────────────────────────────────────────────────

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 16) return 'afternoon'
  if (h >= 16 && h < 22) return 'evening'
  return 'night'
}

function normalizeText(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
}

function scoreKnowledge(content, questionWords) {
  const normalizedContent = normalizeText(content)
  return questionWords.reduce((score, word) => (
    normalizedContent.includes(word) ? score + 1 : score
  ), 0)
}

export async function trainROB(req, res, next) {
  try {
    const {
      moduleId,
      type,
      content,
      question,
      options,
      explanation,
      triggerPhrase,
      hintResponse,
    } = req.body

    if (!moduleId || !type) {
      return res.status(400).json({ message: 'moduleId and type are required' })
    }

    const normalizedOptions = Array.isArray(options)
      ? options
        .filter(option => option?.text?.trim())
        .map(option => ({
          text: option.text.trim(),
          isCorrect: Boolean(option.isCorrect),
        }))
      : []

    const derivedContent = content
      || question
      || hintResponse
      || triggerPhrase

    if (!derivedContent?.trim()) {
      return res.status(400).json({ message: 'content is required' })
    }

    const knowledge = await RobKnowledge.create({
      creatorId: String(req.user._id),
      moduleId: String(moduleId),
      type,
      content: derivedContent.trim(),
      question: question?.trim(),
      options: normalizedOptions,
      explanation: explanation?.trim(),
      triggerPhrase: triggerPhrase?.trim(),
      hintResponse: hintResponse?.trim(),
    })

    res.json({ success: true, knowledge })
  } catch (err) {
    next(err)
  }
}

export async function getKnowledge(req, res, next) {
  try {
    const knowledge = await RobKnowledge.find({
      moduleId: String(req.params.moduleId),
      isPublished: true,
    }).sort({ createdAt: -1 })

    res.json(knowledge)
  } catch (err) {
    next(err)
  }
}

export async function getCreatorKnowledge(req, res, next) {
  try {
    const knowledge = await RobKnowledge.find({
      creatorId: String(req.user._id),
    }).sort({ createdAt: -1 })

    res.json(knowledge)
  } catch (err) {
    next(err)
  }
}

export async function deleteKnowledge(req, res, next) {
  try {
    await RobKnowledge.findOneAndDelete({
      _id: req.params.id,
      creatorId: String(req.user._id),
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function publishModule(req, res, next) {
  try {
    await RobKnowledge.updateMany({
      moduleId: String(req.params.moduleId),
      creatorId: String(req.user._id),
    }, {
      isPublished: true,
      updatedAt: new Date(),
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getQuiz(req, res, next) {
  try {
    const query = {
      type: 'quiz',
      isPublished: true,
    }

    if (req.query.moduleId) {
      query.moduleId = String(req.query.moduleId)
    }

    const quizzes = await RobKnowledge.find(query)

    if (!quizzes.length) {
      return res.json({ available: false })
    }

    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)]

    res.json({
      available: true,
      question: quiz.question,
      options: quiz.options,
      explanation: quiz.explanation,
      quizId: quiz._id,
    })
  } catch (err) {
    next(err)
  }
}

export async function chatWithROB(req, res, next) {
  try {
    const { question, moduleId } = req.body

    if (!question?.trim()) {
      return res.status(400).json({ message: 'question is required' })
    }

    const conceptQuery = {
      isPublished: true,
      type: 'concept',
    }

    if (moduleId) {
      conceptQuery.moduleId = String(moduleId)
    }

    const knowledge = await RobKnowledge.find(conceptQuery)
    const hints = await RobKnowledge.find({
      isPublished: true,
      type: 'hint',
      ...(moduleId ? { moduleId: String(moduleId) } : {}),
    })

    const normalizedQuestion = normalizeText(question)
    const questionWords = normalizedQuestion
      .split(/\s+/)
      .filter(word => word.length > 3)

    const hintMatch = hints.find(item => (
      item.triggerPhrase
      && normalizedQuestion.includes(normalizeText(item.triggerPhrase))
    ))

    if (hintMatch) {
      return res.json({
        answer: hintMatch.hintResponse,
        source: 'hint',
        confidence: 95,
      })
    }

    let bestMatch = null
    let bestScore = 0

    for (const item of knowledge) {
      const score = scoreKnowledge(item.content, questionWords)
      if (score > bestScore) {
        bestScore = score
        bestMatch = item
      }
    }

    if (bestMatch && bestScore > 0) {
      return res.json({
        answer: bestMatch.content,
        source: 'concept',
        confidence: Math.min(bestScore * 20, 90),
      })
    }

    res.json({
      answer: null,
      source: null,
      confidence: 0,
    })
  } catch (err) {
    next(err)
  }
}

export async function saveXP(req, res, next) {
  try {
    if (String(req.user._id) === 'demo') {
      return res.json({ success: true })
    }

    const {
      xp,
      level,
      badges,
      lessonsCompleted,
      questionsAnswered,
      correctAnswers,
      xpToday,
    } = req.body

    await User.findByIdAndUpdate(req.user._id, {
      'robProgress.xp': Number(xp) || 0,
      'robProgress.level': Number(level) || 1,
      'robProgress.badges': Array.isArray(badges) ? badges : [],
      'robProgress.lessonsCompleted': Array.isArray(lessonsCompleted) ? lessonsCompleted : [],
      'robProgress.questionsAnswered': Number(questionsAnswered) || 0,
      'robProgress.correctAnswers': Number(correctAnswers) || 0,
      'robProgress.xpToday': Number(xpToday) || 0,
      'robProgress.updatedAt': new Date(),
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getProgress(req, res, next) {
  try {
    if (String(req.user._id) === 'demo') {
      return res.json({
        xp: 0,
        level: 1,
        badges: [],
        lessonsCompleted: [],
        questionsAnswered: 0,
        correctAnswers: 0,
        xpToday: 0,
      })
    }

    const user = await User.findById(req.user._id).select('robProgress name')

    res.json(user?.robProgress || {
      xp: 0,
      level: 1,
      badges: [],
      lessonsCompleted: [],
      questionsAnswered: 0,
      correctAnswers: 0,
      xpToday: 0,
    })
  } catch (err) {
    next(err)
  }
}

// ── Companion greeting data ─────────────────────────────────────────────────

export async function getCompanion(req, res, next) {
  try {
    const timeOfDay = getTimeOfDay()

    if (String(req.user._id) === 'demo') {
      return res.json({
        timeOfDay,
        daysSinceLogin: 0,
        streak: 0,
        lastModule: null,
        weakTopics: [],
        comebackRecap: false,
        robName: '',
        robColor: 'cyan',
      })
    }

    const user = await User.findById(req.user._id).select('lastLoginAt loginStreak robProgress name')
    const lastLogin = user?.lastLoginAt ? new Date(user.lastLoginAt) : null
    const daysSinceLogin = lastLogin
      ? Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
      : 999

    res.json({
      timeOfDay,
      daysSinceLogin,
      streak: user?.loginStreak || 0,
      lastModule: user?.robProgress?.lastModule || null,
      weakTopics: user?.robProgress?.weakTopics || [],
      comebackRecap: daysSinceLogin >= 2,
      robName: user?.robProgress?.robName || '',
      robColor: user?.robProgress?.robColor || 'cyan',
    })
  } catch (err) {
    next(err)
  }
}

// ── Save companion state (robName, weakTopics, lastModule) ──────────────────

export async function saveCompanionState(req, res, next) {
  try {
    if (String(req.user._id) === 'demo') return res.json({ success: true })

    const { robName, robColor, weakTopics, lastModule } = req.body
    const update = {}
    if (robName !== undefined) update['robProgress.robName'] = String(robName).trim().slice(0, 20)
    if (robColor !== undefined) update['robProgress.robColor'] = String(robColor)
    if (Array.isArray(weakTopics)) update['robProgress.weakTopics'] = weakTopics.slice(0, 10)
    if (lastModule !== undefined) update['robProgress.lastModule'] = String(lastModule)

    await User.findByIdAndUpdate(req.user._id, update)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// ── Creator: ROB Intelligence ───────────────────────────────────────────────

export async function getRobIntelligence(req, res, next) {
  try {
    // Aggregate knowledge items to find popular content
    const knowledgeStats = await RobKnowledge.aggregate([
      { $match: { creatorId: String(req.user._id) } },
      { $group: {
        _id: '$type',
        count: { $sum: 1 },
        published: { $sum: { $cond: ['$isPublished', 1, 0] } },
      }},
    ])

    const quizCount = await RobKnowledge.countDocuments({ creatorId: String(req.user._id), type: 'quiz' })
    const conceptCount = await RobKnowledge.countDocuments({ creatorId: String(req.user._id), type: 'concept' })
    const hintCount = await RobKnowledge.countDocuments({ creatorId: String(req.user._id), type: 'hint' })

    // Get recent students who have engaged with ROB (those with xp > 0)
    const activeStudents = await User.find({
      role: 'student',
      'robProgress.xp': { $gt: 0 },
    }).select('name robProgress.xp robProgress.level robProgress.streak robProgress.weakTopics lastLoginAt').limit(20)

    const avgXP = activeStudents.length
      ? Math.round(activeStudents.reduce((s, u) => s + (u.robProgress?.xp || 0), 0) / activeStudents.length)
      : 0

    // Aggregate weak topics across all students
    const weakTopicMap = {}
    for (const student of activeStudents) {
      for (const topic of (student.robProgress?.weakTopics || [])) {
        weakTopicMap[topic] = (weakTopicMap[topic] || 0) + 1
      }
    }
    const topWeakTopics = Object.entries(weakTopicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    res.json({
      knowledge: { quizCount, conceptCount, hintCount, stats: knowledgeStats },
      students: {
        active: activeStudents.length,
        avgXP,
        topWeakTopics,
        recent: activeStudents.slice(0, 8).map(u => ({
          name: u.name,
          xp: u.robProgress?.xp || 0,
          level: u.robProgress?.level || 1,
          lastSeen: u.lastLoginAt,
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}
