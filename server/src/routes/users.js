import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// CREATE USER
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, email, role = 'student', parentId } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
    if (!User.ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    let parent = null;
    if (role === 'student') {
      if (!parentId) return res.status(400).json({ message: 'Student users must link to a parent' });
      parent = await User.findById(parentId);
      if (!parent || parent.role !== 'parent') {
        return res.status(400).json({ message: 'Parent ID must belong to an existing parent user' });
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      parentId: role === 'student' ? parentId : null,
    });

    if (parent) {
      await User.findByIdAndUpdate(parent._id, { $addToSet: { children: user._id } });
    }

    res.json(user);
  } catch (err) { next(err); }
});

// GET USERS BY ROLE
router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query);
    res.json(users);
  } catch (err) { next(err); }
});

// LINK STUDENT TO PARENT
router.post('/link', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { parentId, studentId } = req.body;
    await User.findByIdAndUpdate(parentId, { $addToSet: { children: studentId } });
    await User.findByIdAndUpdate(studentId, { $set: { parentId } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
