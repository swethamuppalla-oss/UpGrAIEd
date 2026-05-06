import { Router } from 'express';
import { getUIConfig, updateUIConfig } from '../controllers/uiConfigController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/',  getUIConfig);
router.put('/',  requireAuth, requireRole('admin'), updateUIConfig);

export default router;
