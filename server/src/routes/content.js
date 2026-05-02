import { Router } from 'express';
import { db } from '../firebase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/content/:section
router.get('/:section', async (req, res) => {
  const { section } = req.params;
  try {
    const doc = await db.collection('content').doc(section).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Section not found' });
    }
    const data = doc.data();
    // faq is stored as { items: [...] } in Firestore — return the array directly
    res.json(section === 'faq' ? (data.items ?? []) : data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content/:section  (admin only)
router.put('/:section', requireAuth, requireRole('admin'), async (req, res) => {
  const { section } = req.params;
  const newData = req.body;
  try {
    // faq arrives as an array — wrap it for Firestore (docs must be objects)
    const stored = section === 'faq' && Array.isArray(newData)
      ? { items: newData }
      : newData;
    await db.collection('content').doc(section).set(stored);
    res.json({ success: true, message: `${section} updated in Firestore` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
