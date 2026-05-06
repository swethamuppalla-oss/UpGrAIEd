import { getQuestionFromEngine, evaluateStudentAnswer } from '../services/practiceEngine.js'
import { extractTextFromImage } from '../services/ocrService.js'
import { evaluateAnswer as evaluateLongAnswerService } from '../services/longAnswerEvaluator.js'

export const generateQuestion = async (req, res) => {
  try {
    const { conceptId, mode, mistakeType } = req.body
    const question = await getQuestionFromEngine({ conceptId, mode, mistakeType })
    res.json(question)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate question' })
  }
}

export const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, answer, attemptId } = req.body
    const studentId = req.user?._id?.toString() || req.user?.id?.toString()
    const result = await evaluateStudentAnswer({ questionId, answer, studentId, attemptId })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Evaluation failed' })
  }
}

export const handleImageUpload = async (req, res) => {
  try {
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const text = await extractTextFromImage(file.buffer)

    res.json({ extractedText: text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'OCR failed' })
  }
}

export const evaluateLongAnswer = async (req, res) => {
  try {
    const { text, conceptId } = req.body

    const expectedPoints = [
      'definition',
      'example',
      'steps'
    ] // replace with DB later

    const result = evaluateLongAnswerService({ studentText: text, expectedPoints })

    res.json(result)
  } catch (err) {
    console.error("🔥 ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}
