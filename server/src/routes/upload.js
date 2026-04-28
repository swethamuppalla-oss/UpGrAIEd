import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

import { Media } from '../models/Media.js';

router.post('/', requireAuth, requireRole('admin'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Store the path with /uploads/ so it matches the static route
  const fileUrl = `/uploads/${req.file.filename}`;
  
  try {
    const type = req.file.mimetype.startsWith('video') ? 'video' : req.file.mimetype.startsWith('audio') ? 'audio' : 'image';
    const media = await Media.create({
      url: fileUrl,
      type: type,
      metadata: {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
    res.json({ url: fileUrl, media });
  } catch (error) {
    console.error('Error saving media record:', error);
    res.status(500).json({ message: 'Failed to save media record' });
  }
});

export default router;
