import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ContentSection } from '../models/ContentSection.js';

const router = Router();

// GET /api/content/:section — public
router.get('/:section', async (req, res) => {
  try {
    const doc = await ContentSection.findOne({ section: req.params.section }).lean();
    if (!doc) return res.status(404).json({ error: 'Section not found' });
    res.json({ section: doc.section, ...doc.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content — list all sections (admin)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const docs = await ContentSection.find().lean();
    res.json(docs.map(d => ({ section: d.section, ...d.content })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content/:section — upsert (admin only)
router.put('/:section', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { section } = req.params;
    const { section: _omit, ...payload } = req.body; // strip `section` from body if present
    const doc = await ContentSection.findOneAndUpdate(
      { section },
      { $set: { content: payload } },
      { upsert: true, new: true }
    ).lean();
    res.json({ section: doc.section, ...doc.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
