import { Chapter } from '../models/Chapter.js'
import { WeekPlan } from '../models/WeekPlan.js'
import { callBloomAI } from '../services/bloom/bloomService.js'

export const generateWeekPlanFromChapter = async (req, res) => {
  try {
    const { chapterId } = req.params

    const chapter = await Chapter.findOne({
      _id: chapterId,
      parentId: req.user._id
    })

    if (!chapter) {
      return res.status(404).json({ error: { message: 'Chapter not found' } })
    }

    if (chapter.status === 'processing') {
      return res.status(400).json({ error: { message: 'Chapter is already processing' } })
    }

    // Set processing
    chapter.status = 'processing'
    chapter.processingStatus = 'processing'
    await chapter.save()

    // Immediate response to client so it can start polling/waiting
    res.json({ success: true, status: 'processing', chapterId })

    // Async execution
    runBloomPipeline(chapter)

  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}

async function runBloomPipeline(chapter) {
  try {
    const aiResult = await callBloomAI(chapter.extractedText || "No text extracted. Please generate plan.")
    
    // Save to WeekPlan
    const weekPlan = await WeekPlan.create({
      chapterId: chapter._id,
      studentId: chapter.studentId,
      parentId: chapter.parentId,
      days: aiResult.days,
      status: 'draft'
    })

    chapter.status = 'ready'
    chapter.processingStatus = 'complete'
    chapter.weekPlanId = weekPlan._id
    await chapter.save()

  } catch (err) {
    console.error('Bloom Pipeline Failed Unrecoverably:', err)
    chapter.status = 'failed'
    chapter.processingStatus = 'failed'
    chapter.processingError = err.message
    await chapter.save()
  }
}
