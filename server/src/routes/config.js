import { Router } from 'express';
import { getAllConfig, getConfigByKey, upsertConfig } from '../controllers/configController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes for client to read
router.get('/', getAllConfig);
router.get('/:key', getConfigByKey);

// Admin only routes for writing
router.post('/:key', requireAuth, requireRole('admin'), upsertConfig);
router.put('/:key', requireAuth, requireRole('admin'), upsertConfig);

export default router;
