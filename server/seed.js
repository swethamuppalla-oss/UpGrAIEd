import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/upgraied';
// Mongoose uses 'contentsections' (auto-pluralized from ContentSection model)
const COLLECTION = 'contentsections';

const sections = [
  {
    section: 'hero',
    content: {
      type: 'video',
      headline: 'Build thinking skills. Not just answers.',
      subtext: 'AI learning that actually works.',
      media: {
        videoUrl: '/media/demo.mp4',
        slides: [],
      },
    },
  },
  {
    section: 'faq',
    content: {
      title: 'FAQs',
      questions: [
        {
          question: 'What is Bloom?',
          answer: "Your child's AI learning companion.",
        },
      ],
    },
  },
];

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection(COLLECTION);

    for (const item of sections) {
      const result = await collection.updateOne(
        { section: item.section },
        { $set: { section: item.section, content: item.content } },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`Inserted section: ${item.section}`);
      } else {
        console.log(`Updated section: ${item.section}`);
      }
    }

    console.log('Seeding completed');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
