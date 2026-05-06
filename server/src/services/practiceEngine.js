import Anthropic from '@anthropic-ai/sdk'
import PracticeQuestion from '../models/PracticeQuestion.js'
import StudentConceptRecord from '../models/StudentConceptRecord.js'
import { getTemplatesByConcept } from './templateService.js'
import { generateFromTemplate } from './questionGenerator.js'
import { getStudentWeakAreas } from './weakAreaAggregator.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MISTAKE_TO_TEMPLATE = {
  calculation: 'remedial',
  conceptual:  'conceptual',
  reading:     'same_pattern',
}

export const getQuestionFromEngine = async ({ conceptId, mode = 'normal', mistakeType }) => {
  const templates = await getTemplatesByConcept(conceptId)
  let selectedTemplate

  if (mode === 'harder') {
    selectedTemplate = templates.find(t => t.difficulty === 'hard') || templates[0]
  } else if (mode === 'remedial') {
    selectedTemplate = templates.find(t => t.type === 'remedial') || templates[0]
  } else if (mode === 'targeted' && mistakeType) {
    const targetType = MISTAKE_TO_TEMPLATE[mistakeType] ?? 'remedial'
    selectedTemplate = templates.find(t => t.type === targetType) || templates[0]
  } else {
    selectedTemplate = templates[0]
  }

  const generated = selectedTemplate
    ? generateFromTemplate(selectedTemplate)
    : await generateFromClaude({ conceptId, mode })

  const question = await PracticeQuestion.create({
    conceptId:  conceptId ?? null,
    text:       generated.text,
    mode:       mode ?? 'normal',
    answer:     generated.answer ?? null,
    templateId: generated.templateId ?? null,
  })

  return { id: question._id, text: question.text, mode }
}

export const evaluateStudentAnswer = async ({ questionId, answer, studentId }) => {
  const question = await PracticeQuestion.findById(questionId)
  if (!question) throw new Error('Question not found')

  let isCorrect, mistakeType, explanation

  if (question.answer) {
    isCorrect = answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
    mistakeType = isCorrect ? null : 'calculation'
    explanation = isCorrect ? 'Great job!' : `The correct answer is ${question.answer}.`
  } else {
    const result = await evaluateWithClaude(question.text, answer)
    isCorrect = result.correct
    mistakeType = result.mistakeType
    explanation = result.explanation
  }

  let nextMode = { mode: 'normal' }
  let snapshot = null
  if (studentId && question.conceptId) {
    const record = await updateStudentRecord(studentId, question.conceptId, isCorrect, mistakeType)
    nextMode = computeNextMode(record, mistakeType)

    const correctCount = record.history.filter(h => h.isCorrect).length
    const accuracy = record.history.length > 0 ? correctCount / record.history.length : 0

    const weakAreas = await getStudentWeakAreas(studentId)

    snapshot = { accuracy, streak: record.consecutiveCorrect, weakAreas }
  }

  return { correct: isCorrect, explanation, mistakeType, nextMode, snapshot }
}

async function updateStudentRecord(studentId, conceptId, isCorrect, mistakeType) {
  let record = await StudentConceptRecord.findOne({ studentId, conceptId })
  if (!record) {
    record = new StudentConceptRecord({ studentId, conceptId })
  }

  record.history.push({ isCorrect, mistakeType, at: new Date() })
  if (record.history.length > 10) record.history = record.history.slice(-10)

  if (isCorrect) {
    record.consecutiveCorrect += 1
    record.consecutiveWrong = 0
  } else {
    record.consecutiveWrong += 1
    record.consecutiveCorrect = 0
  }

  await record.save()
  return record
}

function computeNextMode(record, mistakeType) {
  if (record.consecutiveWrong >= 2) return { mode: 'remedial' }
  if (record.consecutiveCorrect >= 3) return { mode: 'harder' }
  if (record.consecutiveWrong === 1) return { mode: 'targeted', mistakeType }
  return { mode: 'normal' }
}

export async function ocrHandwriting(buffer, mimeType) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    await new Promise(r => setTimeout(r, 800))
    return { ocrText: 'Mock extracted text from image.' }
  }

  const base64 = buffer.toString('base64')
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const mediaType = allowed.includes(mimeType) ? mimeType : 'image/jpeg'

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: 'Transcribe exactly what is handwritten in this image. Return ONLY the transcribed text, nothing else.' }
      ]
    }]
  })

  return { ocrText: response.content[0].text.trim() }
}

export async function evaluateLongAnswer({ questionId, answer, studentId }) {
  const question = await PracticeQuestion.findById(questionId)
  if (!question) throw new Error('Question not found')

  const result = await evaluateLongWithClaude(question.text, answer)

  let nextMode = { mode: 'normal' }
  if (studentId && question.conceptId) {
    const record = await updateStudentRecord(studentId, question.conceptId, result.isCorrect, result.mistakeType)
    nextMode = computeNextMode(record, result.mistakeType)
  }

  return { ...result, nextMode }
}

async function evaluateLongWithClaude(questionText, studentAnswer) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    return {
      isCorrect: true,
      score: 78,
      feedback: 'Really good effort! You covered the main ideas clearly.',
      strengths: ['Good structure', 'Key concept identified'],
      improvements: ['Add more detail to your explanation'],
      mistakeType: null,
    }
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are evaluating a student's written answer for a kids learning app (ages 6-12).

Question: "${questionText}"
Student answer: "${studentAnswer}"

Return ONLY valid JSON:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "2-3 sentences, warm and encouraging, as Bloom the learning buddy speaking to the child",
  "strengths": ["specific thing they got right (max 3)"],
  "improvements": ["gentle suggestion phrased positively (max 2)"],
  "mistakeType": "conceptual|calculation|reading|null"
}`,
    }],
  })

  try {
    return JSON.parse(response.content[0].text.trim())
  } catch {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Hmm, something went wrong reading your answer. Try submitting again!',
      strengths: [],
      improvements: [],
      mistakeType: null,
    }
  }
}

async function evaluateWithClaude(questionText, studentAnswer) {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Question: "${questionText}"
Student answer: "${studentAnswer}"

Is this correct? If wrong, classify the mistake as: conceptual, calculation, or reading.
Return ONLY valid JSON: {"correct": true/false, "mistakeType": "conceptual|calculation|reading|null", "explanation": "one sentence"}`,
    }],
  })

  try {
    return JSON.parse(response.content[0].text.trim())
  } catch {
    return { correct: false, mistakeType: 'conceptual', explanation: 'Check your answer and try again.' }
  }
}

async function generateFromClaude({ conceptId, mode }) {
  const modeHints = {
    harder:   'Generate a more challenging question requiring deeper understanding.',
    remedial: 'Generate a very simple, basic question to build foundational understanding.',
    targeted: 'Generate a focused question targeting the core concept.',
    normal:   'Generate a clear, grade-appropriate question.',
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are a practice question generator for school students.

Topic: ${conceptId || 'general school curriculum'}
${modeHints[mode] || modeHints.normal}

Return ONLY valid JSON — no markdown, no explanation:
{"text": "your question here", "answer": "expected answer"}`,
    }],
  })

  return JSON.parse(response.content[0].text.trim())
}
