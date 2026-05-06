import { useCallback, useState } from 'react'
import { generatePracticeQuestion, evaluatePracticeAnswer } from '../services/api'

const MODE_LABELS = {
  normal:   'Practice',
  targeted: 'Targeted Practice',
  harder:   'Challenge Mode',
  remedial: 'Let\'s Step Back',
}

export function usePracticeSession(conceptId) {
  const [question, setQuestion]       = useState(null)
  const [answer, setAnswer]           = useState('')
  const [feedback, setFeedback]       = useState(null)
  const [loading, setLoading]         = useState(false)
  const [mode, setMode]               = useState('normal')
  const [mistakeType, setMistakeType] = useState(null)

  const fetchQuestion = useCallback(async (nextMode = mode, nextMistakeType = mistakeType) => {
    setLoading(true)
    setAnswer('')
    setFeedback(null)
    try {
      const q = await generatePracticeQuestion(conceptId, nextMode, nextMistakeType)
      setQuestion(q)
    } finally {
      setLoading(false)
    }
  }, [conceptId, mode, mistakeType])

  const submitAnswer = useCallback(async () => {
    if (!question || !answer.trim() || loading) return
    setLoading(true)
    try {
      const attemptId = `${question.id}-${Date.now()}`
      const result = await evaluatePracticeAnswer({ questionId: question.id, answer, attemptId })
      setFeedback(result)
      const { mode: nm, mistakeType: nmt } = result.nextMode
      setMode(nm)
      setMistakeType(nmt ?? null)
    } finally {
      setLoading(false)
    }
  }, [question, answer, loading])

  const nextQuestion = useCallback(() => {
    fetchQuestion(mode, mistakeType)
  }, [fetchQuestion, mode, mistakeType])

  const start = useCallback(() => {
    fetchQuestion('normal', null)
  }, [fetchQuestion])

  return {
    question,
    answer,
    setAnswer,
    feedback,
    mode,
    modeLabel: MODE_LABELS[mode] || 'Practice',
    loading,
    start,
    fetchQuestion,
    submitAnswer,
    nextQuestion,
  }
}
