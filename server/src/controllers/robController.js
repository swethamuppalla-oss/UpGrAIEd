import RobKnowledge from '../models/RobKnowledge.js'
import User from '../models/User.js'

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
