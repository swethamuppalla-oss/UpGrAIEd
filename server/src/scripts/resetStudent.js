import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import User from '../models/User.js';
import { StudentProgress } from '../models/StudentProgress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetStudent = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MongoDB URI not found in environment');
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected.');

    const student = await User.findOne({ email: 'student@upgraied.com' });
    if (!student) throw new Error('Student account not found.');

    console.log(`🧹 Resetting progress for ${student.email}...`);

    // 1. Reset StudentProgress collection
    await StudentProgress.findOneAndUpdate(
      { userId: student._id.toString() },
      {
        totalXP: 0,
        streakDays: 0,
        badges: [],
        completedModules: [],
        unlockedModules: ['mod1'],
        lastCompletedAt: null,
        lastLoginAt: new Date(),
        currentLevel: 1
      },
      { upsert: true }
    );

    // 2. Reset User.robProgress
    await User.findByIdAndUpdate(student._id, {
      'robProgress.xp': 0,
      'robProgress.level': 1,
      'robProgress.badges': [],
      'robProgress.updatedAt': new Date(),
      'loginStreak': 0,
      'lastLoginAt': new Date()
    });

    console.log('✅ Student progress has been reset to zero.');
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetStudent();
