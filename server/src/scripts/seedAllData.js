import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import User from '../models/User.js';
import { StudentProgress } from '../models/StudentProgress.js';
import { Chapter } from '../models/Chapter.js';
import { WeekPlan } from '../models/WeekPlan.js';
import { ExamResult } from '../models/ExamResult.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MongoDB URI not found in environment');
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected.');

    // 1. Find the seeded users
    const parent = await User.findOne({ email: 'parent@upgraied.com' });
    const student = await User.findOne({ email: 'student@upgraied.com' });

    if (!parent || !student) {
      throw new Error('Please run seedUsers.js first. Parent or Student account not found.');
    }

    // 2. Seed/Update Student Progress
    console.log('📈 Seeding/Updating Student Progress...');
    
    // Update StudentProgress collection
    await StudentProgress.findOneAndUpdate(
      { userId: student._id.toString() },
      {
        totalXP: 15400,
        streakDays: 14,
        badges: ['first_login', 'perfect_week', 'science_whiz'],
        completedModules: ['L1M1', 'L1M2', 'L1M3'],
        unlockedModules: ['L1M1', 'L1M2', 'L1M3', 'L1M4'],
        lastCompletedAt: new Date(Date.now() - 86400000),
        lastLoginAt: new Date(),
        currentLevel: 8
      },
      { upsert: true, new: true }
    );

    // Update User collection (for RobContext)
    await User.findByIdAndUpdate(student._id, {
      'robProgress.xp': 15400,
      'robProgress.level': 8,
      'robProgress.badges': ['first_login', 'perfect_week', 'science_whiz'],
      'robProgress.updatedAt': new Date(),
      'loginStreak': 14,
      'lastLoginAt': new Date()
    });
    console.log('  -> Updated Student Progress in both collections');

    // 3. Seed Chapters
    console.log('📚 Seeding Chapters...');
    await Chapter.deleteMany({ studentId: student._id }); // Clear to avoid duplicates
    
    const chapterScience = await Chapter.create({
      parentId: parent._id,
      studentId: student._id,
      title: 'Photosynthesis & Plant Life',
      subject: 'Science',
      grade: 'Grade 8',
      extractedText: 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.',
      keyConcepts: ['Chlorophyll', 'Sunlight Energy', 'Carbon Dioxide', 'Oxygen production'],
      vocabulary: [{ word: 'Chloroplast', definition: 'Organelle where photosynthesis occurs' }],
      learningObjectives: ['Understand the equation of photosynthesis', 'Identify the inputs and outputs'],
      processingStatus: 'complete',
      status: 'ready'
    });

    const chapterMath = await Chapter.create({
      parentId: parent._id,
      studentId: student._id,
      title: 'Algebraic Expressions',
      subject: 'Mathematics',
      grade: 'Grade 8',
      extractedText: 'An algebraic expression in mathematics is an expression which is made up of variables and constants, along with algebraic operations.',
      keyConcepts: ['Variables', 'Constants', 'Coefficients', 'Terms'],
      vocabulary: [{ word: 'Variable', definition: 'A letter representing an unknown number' }],
      learningObjectives: ['Simplify algebraic expressions', 'Solve for x'],
      processingStatus: 'complete',
      status: 'ready'
    });
    console.log('  -> Re-created 2 Chapters');

    // 4. Seed Week Plans
    console.log('📅 Seeding Week Plans...');
    await WeekPlan.deleteMany({ studentId: student._id });

    const activePlan = await WeekPlan.create({
      chapterId: chapterScience._id,
      studentId: student._id,
      parentId: parent._id,
      weekStartDate: new Date(Date.now() - 3 * 86400000),
      status: 'active',
      parentApproved: true,
      parentApprovedAt: new Date(Date.now() - 4 * 86400000),
      overallProgress: 40,
      days: [
        { day: 1, bloomLevel: 'remember', title: 'Introduction to Photosynthesis', estimatedTime: 15, isComplete: true, quizScore: 100, completedAt: new Date(Date.now() - 2 * 86400000), sections: [] },
        { day: 2, bloomLevel: 'understand', title: 'The Chloroplast', estimatedTime: 20, isComplete: true, quizScore: 80, completedAt: new Date(Date.now() - 86400000), sections: [] },
        { day: 3, bloomLevel: 'apply', title: 'Inputs and Outputs', estimatedTime: 25, isComplete: false, sections: [] },
        { day: 4, bloomLevel: 'analyze', title: 'Factors affecting rate', estimatedTime: 20, isComplete: false, sections: [] },
        { day: 5, bloomLevel: 'create', title: 'Weekly Exam', estimatedTime: 30, isComplete: false, sections: [] }
      ]
    });

    const completePlan = await WeekPlan.create({
      chapterId: chapterMath._id,
      studentId: student._id,
      parentId: parent._id,
      weekStartDate: new Date(Date.now() - 10 * 86400000),
      status: 'complete',
      parentApproved: true,
      parentApprovedAt: new Date(Date.now() - 11 * 86400000),
      overallProgress: 100,
      examScore: 85,
      examTakenAt: new Date(Date.now() - 4 * 86400000),
      days: [
        { day: 1, bloomLevel: 'remember', title: 'What is a variable?', estimatedTime: 15, isComplete: true, quizScore: 100, sections: [] },
        { day: 2, bloomLevel: 'understand', title: 'Like vs Unlike Terms', estimatedTime: 20, isComplete: true, quizScore: 90, sections: [] },
        { day: 3, bloomLevel: 'apply', title: 'Simplifying Expressions', estimatedTime: 25, isComplete: true, quizScore: 80, sections: [] },
        { day: 4, bloomLevel: 'analyze', title: 'Word Problems', estimatedTime: 20, isComplete: true, quizScore: 75, sections: [] },
        { day: 5, bloomLevel: 'create', title: 'Weekly Exam', estimatedTime: 30, isComplete: true, quizScore: 85, sections: [] }
      ]
    });

    chapterScience.weekPlanId = activePlan._id;
    await chapterScience.save();
    chapterMath.weekPlanId = completePlan._id;
    await chapterMath.save();
    console.log('  -> Re-created Week Plans');

    // 5. Seed Exam Result
    console.log('📝 Seeding Exam Results...');
    await ExamResult.deleteMany({ studentId: student._id });
    await ExamResult.create({
      weekPlanId: completePlan._id,
      studentId: student._id,
      chapterId: completePlan.chapterId,
      totalQuestions: 10,
      correctAnswers: 8,
      score: 80,
      timeTakenMinutes: 25,
      weakConcepts: ['Word Problems'],
      strongConcepts: ['Variables', 'Simplifying Expressions'],
      parentNotified: true,
      answers: [
        { questionIndex: 0, question: 'Solve for x: 2x = 4', selectedIndex: 1, correctIndex: 1, isCorrect: true, timeTakenSeconds: 30 },
        { questionIndex: 1, question: 'Simplify: 3x + 2x', selectedIndex: 0, correctIndex: 0, isCorrect: true, timeTakenSeconds: 15 },
      ]
    });
    console.log('  -> Re-created Exam Result');

    console.log('🎉 All data re-seeded and synced successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedData();
