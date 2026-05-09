import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { GrippingPoint } from '../models/GrippingPoint.js';
import { StudentProgress } from '../models/StudentProgress.js';

const router = Router();

/* ──────────────────────────────────────────────────────────
   GET /api/gripping-points/:videoId
   Student — fetch all active gripping points for a video
────────────────────────────────────────────────────────── */
router.get('/:videoId', requireAuth, async (req, res, next) => {
  try {
    const points = await GrippingPoint
      .find({ videoId: req.params.videoId, isActive: true })
      .sort({ order: 1, timestampSeconds: 1 })
      .select('-correctAnswer -__v');      // don't expose answer to client

    res.json({ points });
  } catch (err) { next(err); }
});

/* ──────────────────────────────────────────────────────────
   POST /api/gripping-points
   Admin — create a gripping point
────────────────────────────────────────────────────────── */
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { videoId, moduleId, timestampSeconds, questionType, question,
            options, correctAnswer, explanation, bloomReaction, xpReward, order } = req.body;

    if (!videoId || !moduleId || timestampSeconds === undefined || !question || !correctAnswer) {
      return res.status(400).json({ message: 'videoId, moduleId, timestampSeconds, question and correctAnswer are required.' });
    }
    if (questionType === 'mcq' && (!options || options.length < 2)) {
      return res.status(400).json({ message: 'MCQ requires at least 2 options.' });
    }

    const gp = await GrippingPoint.create({
      videoId, moduleId, timestampSeconds,
      questionType: questionType || 'mcq',
      question, options: options || [],
      correctAnswer, explanation: explanation || '',
      bloomReaction: bloomReaction || 'Great thinking! Let\'s keep going 🌿',
      xpReward: xpReward || 10,
      order: order || 0,
    });

    res.status(201).json({ grippingPoint: gp });
  } catch (err) { next(err); }
});

/* ──────────────────────────────────────────────────────────
   PUT /api/gripping-points/:id
   Admin — edit a gripping point
────────────────────────────────────────────────────────── */
router.put('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const allowed = ['timestampSeconds','questionType','question','options',
                     'correctAnswer','explanation','bloomReaction','xpReward','order','isActive'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const gp = await GrippingPoint.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!gp) return res.status(404).json({ message: 'Gripping point not found.' });
    res.json({ grippingPoint: gp });
  } catch (err) { next(err); }
});

/* ──────────────────────────────────────────────────────────
   DELETE /api/gripping-points/:id
   Admin — delete a gripping point
────────────────────────────────────────────────────────── */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    await GrippingPoint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

/* ──────────────────────────────────────────────────────────
   POST /api/gripping-points/:id/answer
   Student — submit answer → get feedback + XP
────────────────────────────────────────────────────────── */
router.post('/:id/answer', requireAuth, async (req, res, next) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: 'answer is required.' });

    // fetch WITH correctAnswer this time
    const gp = await GrippingPoint.findById(req.params.id);
    if (!gp) return res.status(404).json({ message: 'Gripping point not found.' });

    const isCorrect = gp.questionType === 'mcq'
      ? answer.trim().toLowerCase() === gp.correctAnswer.trim().toLowerCase()
      : answer.trim().length > 3; // typed: accept any meaningful response

    let xpAwarded = 0;
    if (isCorrect) {
      xpAwarded = gp.xpReward;
      // add XP to student progress
      try {
        const userId = req.user?._id?.toString() || req.user?.id?.toString();
        const progress = await StudentProgress.findOne({ userId });
        if (progress) {
          progress.totalXP = (progress.totalXP || 0) + xpAwarded;
          progress.currentLevel = progress.computeLevel ? progress.computeLevel() : progress.currentLevel;
          await progress.save();
        }
      } catch (_) { /* XP update non-critical */ }
    }

    res.json({
      isCorrect,
      correctAnswer: gp.correctAnswer,
      explanation:   gp.explanation,
      bloomReaction: isCorrect ? gp.bloomReaction : '🌿 Almost! Here\'s what to remember:',
      xpAwarded,
    });
  } catch (err) { next(err); }
});

export default router;
