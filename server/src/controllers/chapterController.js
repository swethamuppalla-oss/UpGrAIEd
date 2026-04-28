import { Chapter } from '../models/Chapter.js'
import { WeekPlan } from '../models/WeekPlan.js'
import { Media } from '../models/Media.js'

// ── POST /api/chapters/upload ──
export const uploadChapter = async (req, res) => {
  try {
    const { title, subject, grade, studentId } = req.body
    const photoUrls = req.files?.map(f => `/uploads/${f.filename}`) || []

    if (photoUrls.length === 0) {
      return res.status(400).json({
        error: { message: 'At least one photo required' }
      })
    }

    for (const url of photoUrls) {
      await Media.create({ url, type: 'image',
        tag: 'chapter-photo',
        metadata: { uploadedBy: req.user._id }
      })
    }

    const chapter = await Chapter.create({
      parentId: req.user._id,
      studentId: studentId || null,
      title: title || 'Chapter ' + Date.now(),
      subject: subject || '',
      grade: grade || '',
      photoUrls,
      processingStatus: 'pending'
    })

    processChapterWithAI(chapter._id).catch(err =>
      console.error('AI processing failed:', err))

    res.status(201).json({
      success: true,
      chapterId: chapter._id,
      status: 'pending'
    })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

// ── GET /api/chapters/:id/status ──
export const getChapterStatus = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({
      _id: req.params.id,
      parentId: req.user._id
    })
    if (!chapter) return res.status(404).json({
      error: { message: 'Chapter not found' }
    })

    res.json({
      status: chapter.processingStatus,
      keyConcepts: chapter.keyConcepts,
      detectedSubject: chapter.detectedSubject,
      detectedGrade: chapter.detectedGrade,
      weekPlanId: chapter.weekPlanId,
      error: chapter.processingError
    })
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

// ── GET /api/chapters ──
export const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({
      parentId: req.user._id
    }).sort({ createdAt: -1 }).lean()
    res.json(chapters)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

// ── AI PROCESSING (async, server-side) ──
async function processChapterWithAI(chapterId) {
  const chapter = await Chapter.findById(chapterId)
  if (!chapter) return

  try {
    await Chapter.findByIdAndUpdate(chapterId, {
      processingStatus: 'processing'
    })

    const extractedContent = await extractWithClaudeVision(chapter.photoUrls)
    const weekPlanData = await buildWeekPlanWithClaude(extractedContent)

    const weekPlan = await WeekPlan.create({
      chapterId: chapter._id,
      studentId: chapter.studentId,
      parentId: chapter.parentId,
      days: weekPlanData.days,
      status: 'draft'
    })

    await Chapter.findByIdAndUpdate(chapterId, {
      extractedText: extractedContent.text,
      keyConcepts: extractedContent.concepts,
      vocabulary: extractedContent.vocabulary,
      learningObjectives: extractedContent.objectives,
      detectedSubject: extractedContent.subject,
      detectedGrade: extractedContent.grade,
      processingStatus: 'complete',
      weekPlanId: weekPlan._id
    })

  } catch (err) {
    await Chapter.findByIdAndUpdate(chapterId, {
      processingStatus: 'failed',
      processingError: err.message
    })
  }
}

// ── Claude Vision: extract chapter content ──
async function extractWithClaudeVision(photoUrls) {
  // Mock fallback
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    // Artificial delay to simulate processing
    await new Promise(r => setTimeout(r, 4000));
    return {
      text: "This is mock extracted text about plants.",
      subject: "Science",
      grade: "Grade 3",
      title: "Chapter: Plants",
      concepts: ["Photosynthesis", "Roots"],
      vocabulary: [{word: "Photosynthesis", definition: "Process of making food"}],
      objectives: ["Understand how plants make food"],
      summary: "Plants make food using sunlight."
    }
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const fs = (await import('fs')).default
  const path = (await import('path')).default

  const imageContents = []
  for (const url of photoUrls.slice(0, 6)) {
    try {
      const filePath = path.join(process.cwd(), url)
      const buffer = fs.readFileSync(filePath)
      const base64 = buffer.toString('base64')
      imageContents.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: base64
        }
      })
    } catch (e) {
      console.warn('Could not read image:', url)
    }
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: [
        ...imageContents,
        {
          type: 'text',
          text: `You are analyzing textbook pages for a child learning platform.
Extract the following from these textbook page photos:

Return ONLY valid JSON with this exact structure:
{
  "text": "full extracted text from all pages",
  "subject": "detected subject (Maths/English/Science/etc)",
  "grade": "estimated grade level (Grade 1-5)",
  "title": "chapter title if visible",
  "concepts": ["concept1", "concept2", "concept3"],
  "vocabulary": [{"word": "...", "definition": "..."}],
  "objectives": ["learning objective 1", "learning objective 2"],
  "summary": "2-3 sentence plain English summary for a child"
}`
        }
      ]
    }]
  })

  try {
    return JSON.parse(response.content[0].text)
  } catch {
    return {
      text: response.content[0].text,
      subject: 'General',
      grade: 'Grade 3',
      title: 'Chapter',
      concepts: [],
      vocabulary: [],
      objectives: [],
      summary: ''
    }
  }
}

// ── Claude: build 7-day week plan ──
async function buildWeekPlanWithClaude(content) {
  // Mock fallback
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    return {
      days: [1,2,3,4,5,6,7].map(n => ({
        dayNumber: n,
        dayName: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][n-1],
        type: n === 5 ? 'audio' :
              n === 6 ? 'revision' :
              n === 7 ? 'exam' : 'lesson',
        title: `Mock Day ${n}`,
        description: `Description for day ${n}`,
        videoScript: n <= 4 ? "Hello! Let's learn about plants. Plants have roots." : undefined,
        audioScript: n === 5 ? "Voice 1: Hello!\nVoice 2: Hi!" : undefined,
        quizQuestions: n !== 5 && n !== 7 ? [{
          question: "What do plants have?",
          options: ["Roots", "Wings", "Fins", "Wheels"],
          correctIndex: 0,
          explanation: "Because plants have roots.",
          concept: "Roots"
        }] : [],
        examQuestions: n === 7 ? [{
          question: "Exam Question?",
          options: ["A", "B", "C", "D"],
          correctIndex: 0,
          explanation: "Because A.",
          concept: "Concepts"
        }] : []
      }))
    }
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const prompt = `You are creating a 7-day learning plan for a child
(${content.grade}, subject: ${content.subject}).

Chapter content:
${content.text?.slice(0, 3000)}

Key concepts: ${content.concepts?.join(', ')}

Create a structured 7-day plan. Return ONLY valid JSON:
{
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "type": "lesson",
      "title": "Introduction to [topic]",
      "description": "Brief description",
      "conceptsCovered": ["concept1"],
      "videoScript": "2-3 paragraph script for the lesson video. Start with Bloom the character saying hello. Explain concept simply for a child. Include an analogy.",
      "quizQuestions": [
        {
          "question": "Simple question about the concept?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "explanation": "Because...",
          "concept": "concept name"
        }
      ]
    },
    {
      "dayNumber": 2, "dayName": "Tuesday",
      "type": "lesson", ...same structure
    },
    {
      "dayNumber": 3, "dayName": "Wednesday",
      "type": "lesson", ...
    },
    {
      "dayNumber": 4, "dayName": "Thursday",
      "type": "lesson", ...
    },
    {
      "dayNumber": 5, "dayName": "Friday",
      "type": "audio",
      "title": "Listen and Learn",
      "audioScript": "A conversational two-voice script (Voice 1: Teacher, Voice 2: Student) that reviews the week's learning. 400-500 words. Fun and engaging for children."
    },
    {
      "dayNumber": 6, "dayName": "Saturday",
      "type": "revision",
      "title": "Let's Revise!",
      "conceptsCovered": [...all week concepts],
      "quizQuestions": [...5 revision questions mixing all concepts]
    },
    {
      "dayNumber": 7, "dayName": "Sunday",
      "type": "exam",
      "title": "Weekly Exam",
      "examQuestions": [...12 comprehensive exam questions covering entire chapter]
    }
  ]
}`

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 6000,
    messages: [{ role: 'user', content: prompt }]
  })

  try {
    return JSON.parse(response.content[0].text)
  } catch {
    return {
      days: [1,2,3,4,5,6,7].map(n => ({
        dayNumber: n,
        dayName: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][n-1],
        type: n === 5 ? 'audio' :
              n === 6 ? 'revision' :
              n === 7 ? 'exam' : 'lesson',
        title: `Day ${n}`,
        quizQuestions: [],
        examQuestions: []
      }))
    }
  }
}
