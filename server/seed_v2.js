import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/upgraied'
// Mongoose uses 'contentsections' (auto-pluralized from ContentSection model)
const COLLECTION = 'contentsections'

const sections = [
  {
    section: 'hero',
    content: {
      badge: '🌱 AI Learning for Ages 8–14',
      headline: 'Learn Your Subjects.\nMaster How to Think with AI.',
      subtext: 'UpgrAIed gives every student a personal AI companion that builds real thinking skills — not just answers.',
      cta: { text: 'Start Learning Free', link: '/reserve' },
      ctaSecondary: { text: 'See How It Works', link: '#why' },
      socialProof: '1,000+ students learning',
      media: {
        type: 'grid',
        videoUrl: '',
        images: [],
      },
    },
  },
  {
    section: 'bloomGrid',
    content: {
      badge: 'HOW IT WORKS',
      title: 'Learning that actually sticks',
      subtitle: 'Every session is structured around how kids actually think and learn.',
      tiles: [
        { image: null, label: 'Upload Your Notes', badge: '01' },
        { image: null, label: 'AI Builds Your Plan', badge: '02' },
        { image: null, label: 'Learn & Practice', badge: '03' },
        { image: null, label: 'Track Progress', badge: '04' },
        { image: null, label: 'Ask Anything', badge: '05' },
        { image: null, label: 'Earn Badges', badge: '06' },
      ],
    },
  },
  {
    section: 'why',
    content: {
      badge: 'WHY UPGRAIED',
      title: 'More than studying.\nReal understanding.',
      subtitle: 'We built a learning experience designed around how children actually think.',
      cards: [
        { icon: '🧠', title: 'Think, Don\'t Memorize', description: 'AI walks students through concepts step-by-step, building genuine understanding instead of rote learning.', color: '#6EDC5F' },
        { icon: '📸', title: 'Upload Anything', description: 'Photos of textbooks, handwritten notes, or typed questions — Bloom handles it all and creates a learning plan.', color: '#63C7FF' },
        { icon: '🎯', title: 'Personalized Path', description: 'Every student gets a unique 7-day learning journey adapted to their pace, grade, and subject.', color: '#FFD95A' },
        { icon: '💬', title: 'Ask Without Judgment', description: 'Students can ask the same question 10 times. Bloom never gets frustrated. Always patient, always clear.', color: '#FF8A65' },
        { icon: '📊', title: 'Parent Visibility', description: 'Weekly progress reports so parents know exactly what their child has learned and where they need support.', color: '#6EDC5F' },
        { icon: '🏆', title: 'Real Skill Building', description: 'Bloom teaches critical thinking, problem decomposition, and how to use AI as a thinking partner for life.', color: '#63C7FF' },
      ],
    },
  },
  {
    section: 'trust',
    content: {
      badge: 'TRUSTED BY PARENTS',
      title: 'Built for parents who care about how their child learns.',
      stats: [
        { value: '1,000+', label: 'Active Learners' },
        { value: '95%', label: 'Parent Satisfaction' },
        { value: '3×', label: 'Faster Understanding' },
        { value: '0', label: 'Coding Required' },
      ],
      points: [
        { icon: '👁️', title: 'Full Visibility', description: 'Weekly reports show exactly what your child studied, understood, and where they need support.' },
        { icon: '🛡️', title: 'Safe & Age-Appropriate', description: 'Content is filtered and moderated for 8–14 year olds. No inappropriate content, ever.' },
        { icon: '🤝', title: 'Guided AI Learning', description: 'Bloom guides — never just gives answers. Your child must think and engage to progress.' },
        { icon: '📱', title: 'Parent-Friendly Design', description: 'Simple dashboard for parents with no technical knowledge required to monitor progress.' },
        { icon: '📈', title: 'Measurable Progress', description: 'Track concept mastery, XP earned, badges unlocked, and modules completed over time.' },
        { icon: '🌟', title: 'Real Skills for Life', description: 'Students learn to think critically and use AI as a tool — skills that matter in every career.' },
      ],
    },
  },
  {
    section: 'pricing',
    content: {
      badge: 'SIMPLE PRICING',
      title: 'One plan. Full access.',
      subtitle: 'No hidden fees. Cancel anytime. Your child starts learning immediately.',
      plans: [
        {
          name: 'Free Trial',
          price: '₹0',
          period: '7 days',
          description: 'Try everything free. No card required.',
          featured: false,
          cta: 'Start Free Trial',
          ctaLink: '/reserve',
          features: ['1 subject module', 'AI companion (Bloom)', 'Basic progress tracking', 'Parent report (1 week)', 'Mobile + Desktop access'],
        },
        {
          name: 'Monthly',
          price: '₹999',
          period: 'per month',
          description: 'Full access for one student. Flexible monthly plan.',
          featured: true,
          cta: 'Get Started',
          ctaLink: '/reserve',
          features: ['All subjects unlocked', 'AI companion (Bloom) — unlimited', 'Weekly parent reports', 'Progress + XP tracking', 'Badge system', 'Priority support', 'Cancel anytime'],
        },
        {
          name: 'Annual',
          price: '₹799',
          period: 'per month',
          description: 'Best value. Save ₹2,400 vs monthly.',
          featured: false,
          badge: '2 MONTHS FREE',
          cta: 'Save ₹2,400',
          ctaLink: '/reserve',
          features: ['Everything in Monthly', 'Annual learning roadmap', 'Exam prep modules', 'Downloadable progress reports', 'Family discount available', 'Dedicated onboarding call'],
        },
      ],
    },
  },
  {
    section: 'faq',
    content: {
      badge: 'COMMON QUESTIONS',
      title: 'Everything parents want to know',
      questions: [
        { question: 'What age group is UpgrAIed designed for?', answer: 'UpgrAIed is built for students aged 8–14 years. The content and AI interactions are calibrated for this age range — age-appropriate language, safe content, and a pace that matches school curricula.' },
        { question: 'Is this safe for my child to use unsupervised?', answer: 'Yes. Bloom, our AI companion, is filtered and moderated specifically for children. There are no open internet searches, no user-generated content, and every response is constrained to educational topics.' },
        { question: 'What subjects does UpgrAIed support?', answer: 'We currently support Maths, Science, Social Studies, and English for grades 4–9. We\'re actively expanding to include more subjects and competitive exam prep.' },
        { question: 'How is this different from YouTube or Google?', answer: 'UpgrAIed isn\'t a search engine or video library. It\'s a structured learning system. Your child uploads their actual school material, and Bloom creates a personalized 7-day learning plan.' },
        { question: 'How do I know if my child is actually learning?', answer: 'You\'ll receive a weekly parent report showing which concepts were studied, quiz scores, XP earned, and where your child needs extra support.' },
        { question: 'Can I cancel anytime?', answer: 'Absolutely. There are no contracts. You can cancel from your parent dashboard at any time. Your child\'s progress data is retained for 30 days after cancellation.' },
      ],
    },
  },
  {
    section: 'cta',
    content: {
      badge: 'GET STARTED TODAY',
      title: 'Give your child a real learning advantage.',
      subtitle: 'Join 1,000+ students already learning smarter with UpgrAIed. Start free — no credit card needed.',
      primaryCta: { text: 'Start Free Trial', link: '/reserve' },
      secondaryCta: { text: 'Chat on WhatsApp', link: '' },
      phone: '919876543210',
      whatsappMessage: 'Hi! I want to learn more about UpgrAIed for my child.',
      trustLine: '✓ 7-day free trial  ·  ✓ No credit card  ·  ✓ Cancel anytime',
    },
  },
]

async function seed() {
  const client = new MongoClient(MONGO_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const collection = db.collection(COLLECTION)

    for (const item of sections) {
      const result = await collection.updateOne(
        { section: item.section },
        { $set: { section: item.section, content: item.content } },
        { upsert: true }
      )

      if (result.upsertedCount > 0) {
        console.log(`Inserted: ${item.section}`)
      } else {
        console.log(`Updated:  ${item.section}`)
      }
    }

    console.log('\nV2 seeding complete. Sections seeded:', sections.map(s => s.section).join(', '))
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()
