import path from 'path'
import fs from 'fs'
import { WrittenSubmission } from '../models/WrittenSubmission.js'

// ── POST /api/submissions ──
export const submitWrittenAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Photo required' } })
    }

    const { questionText, weekPlanId } = req.body
    if (!questionText?.trim()) {
      return res.status(400).json({ error: { message: 'questionText required' } })
    }

    const photoUrl = `/uploads/${req.file.filename}`
    const mimeType = req.file.mimetype
    const result = await ocrAndEvaluate(photoUrl, mimeType, questionText)

    const submission = await WrittenSubmission.create({
      studentId: req.user._id,
      weekPlanId: weekPlanId || null,
      questionText,
      photoUrl,
      ocrText: result.ocrText,
      isCorrect: result.isCorrect,
      score: result.score,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
      mistakeType: result.mistakeType,
    })

    res.status(201).json({
      submissionId: submission._id,
      ocrText: result.ocrText,
      isCorrect: result.isCorrect,
      score: result.score,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
      mistakeType: result.mistakeType,
    })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

async function ocrAndEvaluate(photoUrl, mimeType, questionText) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    await new Promise(r => setTimeout(r, 1500))
    return {
      ocrText: 'Photosynthesis is when plants use sunlight to make food.',
      isCorrect: true,
      score: 85,
      feedback: 'Great work! You understood the main idea really well. Bloom is so proud of you!',
      strengths: ['Correct explanation of photosynthesis', 'Clear and simple answer'],
      improvements: ['Try to mention that plants need water and carbon dioxide too'],
      mistakeType: null,
    }
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const filePath = path.join(process.cwd(), photoUrl)
  const buffer = fs.readFileSync(filePath)
  const base64 = buffer.toString('base64')
  const mediaType = detectMimeType(mimeType)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 }
        },
        {
          type: 'text',
          text: `You are evaluating a student's handwritten answer for a kids learning app (ages 6-12).

Question: "${questionText}"

Do two things:
1. Transcribe exactly what the student wrote (even if messy handwriting)
2. Evaluate the answer with friendly, encouraging feedback for a child

Return ONLY valid JSON, no markdown:
{
  "ocrText": "exact transcription of what was written",
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "2-3 sentences, warm and encouraging, written as Bloom the learning buddy speaking to the child",
  "strengths": ["specific thing they got right (max 3)"],
  "improvements": ["one gentle suggestion phrased positively (max 2)"],
  "mistakeType": "conceptual|calculation|reading|null"
}`
        }
      ]
    }]
  })

  try {
    return JSON.parse(response.content[0].text.trim())
  } catch {
    return {
      ocrText: 'I had trouble reading the handwriting.',
      isCorrect: false,
      score: 0,
      feedback: 'Hmm, I could not read your writing clearly. Try again with bigger, neater letters!',
      strengths: [],
      improvements: ['Write larger so Bloom can read every word'],
      mistakeType: null,
    }
  }
}

function detectMimeType(mimeType) {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return allowed.includes(mimeType) ? mimeType : 'image/jpeg'
}
