import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const SALT_ROUNDS = 10;

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI or MONGO_URI is not defined in the environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');

    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@upgraied.com',
        phone: '1000000000',
        role: 'admin',
        password: 'adminpassword123',
      },
      {
        name: 'Parent User',
        email: 'parent@upgraied.com',
        phone: '2000000000',
        role: 'parent',
        password: 'parentpassword123',
      },
      {
        name: 'Student User',
        email: 'student@upgraied.com',
        phone: '3000000000',
        role: 'student',
        password: 'studentpassword123',
      },
      {
        name: 'Creator User',
        email: 'creator@upgraied.com',
        phone: '4000000000',
        role: 'creator',
        password: 'creatorpassword123',
      },
    ];

    console.log('Seeding standard users...');

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
        await User.create({
          ...userData,
          password: hashedPassword,
          isActive: true,
        });
        console.log(`✅ Created user: ${userData.role} (${userData.email})`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.role} (${userData.email})`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedUsers();
