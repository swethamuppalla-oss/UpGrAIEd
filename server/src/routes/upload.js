import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { bucket } from '../firebase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Media } from '../models/Media.js';

const router = Router();

const ALLOWED_MIME = {
  'image/jpeg':  { dir: 'images', ext: null },
  'image/png':   { dir: 'images', ext: null },
  'image/webp':  { dir: 'images', ext: null },
  'image/gif':   { dir: 'images', ext: null },
  'video/mp4':   { dir: 'videos', ext: '.mp4' },
  'video/webm':  { dir: 'videos', ext: '.webm' },
  'video/quicktime': { dir: 'videos', ext: '.mov' },
};
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB (videos)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
});

function parseUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 100 MB)' });
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

// Local disk fallback — writes to uploads/<dir>/ and returns a /uploads/... URL
function saveLocal(buffer, mimetype, originalname) {
  const info = ALLOWED_MIME[mimetype];
  const ext = info?.ext || path.extname(originalname).toLowerCase();
  const dir = `uploads/${info?.dir || 'files'}`;
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/${dir}/${filename}`;
}

async function handleMediaUpload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { mimetype, buffer, originalname, size } = req.file;
  const info = ALLOWED_MIME[mimetype];
  if (!info) return res.status(400).json({ error: `Unsupported file type: ${mimetype}` });

  const mediaType = info.dir === 'videos' ? 'video' : 'image';
  const section = req.body.section || 'general';

  try {
    let publicUrl;

    if (bucket) {
      // Firebase Storage path
      const ext = info.ext || path.extname(originalname).toLowerCase();
      const filename = `uploads/${info.dir}/${randomUUID()}${ext}`;
      const blob = bucket.file(filename);
      await new Promise((resolve, reject) => {
        const stream = blob.createWriteStream({
          metadata: {
            contentType: mimetype,
            metadata: { uploadedBy: req.user?.id || 'admin', originalname },
          },
        });
        stream.on('error', reject);
        stream.on('finish', resolve);
        stream.end(buffer);
      });
      await blob.makePublic();
      publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    } else {
      // Local disk fallback (dev)
      publicUrl = saveLocal(buffer, mimetype, originalname);
    }

    const media = await Media.create({
      url: publicUrl,
      type: mediaType,
      section,
      tag: section,
      metadata: { originalname, size, mimetype },
    }).catch(() => null); // non-fatal if DB write fails

    res.json({ url: publicUrl, type: mediaType, section, id: media?._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.post('/', requireAuth, requireRole('admin'), parseUpload, handleMediaUpload);
router.post('/upload', requireAuth, requireRole('admin'), parseUpload, handleMediaUpload);

// GET /api/upload/library — admin media library
router.get('/library', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { type, section } = req.query; // ?type=image or ?section=hero
    const filter = {};
    if (type) filter.type = type;
    if (section) filter.section = section;
    const items = await Media.find(filter).sort({ created_at: -1 }).limit(100).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { type, section } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (section) filter.section = section;
    const items = await Media.find(filter).sort({ created_at: -1 }).limit(100).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
