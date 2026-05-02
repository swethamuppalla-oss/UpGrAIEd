import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { bucket } from '../firebase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Media } from '../models/Media.js';

const router = Router();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
});

// Inline multer error handling so size/unexpected errors return clean JSON
function parseUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5 MB)' });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

router.post('/', requireAuth, requireRole('admin'), parseUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' });
  }

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `uploads/images/${randomUUID()}${ext}`;
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: req.user?.id || 'admin',
          originalname: req.file.originalname,
        },
      },
    });

    blobStream.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });

    blobStream.on('finish', async () => {
      await blob.makePublic(); // can switch to signed URLs later if access control needed
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      try {
        const media = await Media.create({
          url: publicUrl,
          type: 'image',
          metadata: {
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          },
        });
        res.json({ success: true, url: publicUrl, filename: blob.name, media });
      } catch (dbErr) {
        console.error('Error saving media record:', dbErr);
        res.json({ success: true, url: publicUrl, filename: blob.name });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
