import CmsSection from './cms.model.js'

// ── Seed defaults (returned when DB has no documents for a page) ──────────────
const HOME_DEFAULTS = [
  {
    section: 'hero',
    order: 1,
    title: 'Human Teaching.\nAI-Guided Growth.',
    subtitle:
      'UpGrAIEd is the first AI-native learning ecosystem where every child gets a personalized companion, every parent gets real insight, and every lesson compounds into mastery.',
    primaryCTA: 'Start Learning',
    secondaryCTA: 'Explore Ecosystem',
    primaryCTALink: '/login?role=student',
    secondaryCTALink: '#ecosystem',
    enabled: true,
    metadata: {},
  },
  {
    section: 'bloom',
    order: 2,
    title: 'Meet Bloom',
    subtitle:
      'Your child\'s AI learning companion — built on empathy, powered by intelligence, designed for curiosity.',
    primaryCTA: 'See Bloom in Action',
    primaryCTALink: '/login?role=student',
    enabled: true,
    metadata: {
      features: [
        {
          icon: '🧠',
          title: 'Adaptive Intelligence',
          description: 'Bloom learns how your child thinks and adapts every lesson to match their pace.',
        },
        {
          icon: '💬',
          title: 'Natural Conversation',
          description: 'Ask anything. Bloom explains concepts in simple, age-appropriate language.',
        },
        {
          icon: '📊',
          title: 'Real-time Insights',
          description: 'Parents and teachers see exactly where each child excels and where to focus.',
        },
        {
          icon: '🎯',
          title: 'Precision Learning',
          description: 'No wasted time. Every session targets the highest-leverage gaps.',
        },
      ],
    },
  },
  {
    section: 'learningFlow',
    order: 3,
    title: 'How UpGrAIEd Works',
    subtitle: 'A learning system that adapts, compounds, and grows with every child.',
    enabled: true,
    metadata: {
      steps: [
        {
          number: '01',
          title: 'Assess',
          description: 'Bloom runs a deep diagnostic to map knowledge gaps and learning style.',
        },
        {
          number: '02',
          title: 'Personalise',
          description: 'A unique learning path is generated — no two paths are ever the same.',
        },
        {
          number: '03',
          title: 'Learn',
          description: 'Video lessons, quizzes, and guided practice — all paced by Bloom.',
        },
        {
          number: '04',
          title: 'Master',
          description: 'Spaced repetition and challenge missions lock in long-term retention.',
        },
      ],
    },
  },
  {
    section: 'ecosystem',
    order: 4,
    title: 'The Ecosystem',
    subtitle: 'Two products. One vision. Infinite learning.',
    enabled: true,
    metadata: {
      products: [
        {
          name: 'UpGrAIEd',
          tagline: 'AI-Native Learning Platform',
          description:
            'The core learning platform. Adaptive curriculum, Bloom AI companion, gamified progress, and parent insights — all in one.',
          status: 'Live',
          statusColor: '#6EDC5F',
          link: '/login',
          accent: '#6EDC5F',
        },
        {
          name: 'UpGrEd',
          tagline: 'Structured Curriculum Engine',
          description:
            'A teacher-led, chapter-based learning system with weekly plans, exam prep, and deep progress tracking.',
          status: 'Beta',
          statusColor: '#7B3FE4',
          link: '/upgred',
          accent: '#7B3FE4',
        },
      ],
    },
  },
  {
    section: 'parentTrust',
    order: 5,
    title: 'Trusted by 10,000+ Families',
    subtitle: 'Real results. Real families. Real transformation.',
    enabled: true,
    metadata: {
      stats: [
        { value: '10,000+', label: 'Active Students' },
        { value: '95%', label: 'Parent Satisfaction' },
        { value: '3×', label: 'Faster Concept Retention' },
        { value: '150+', label: 'Partner Schools' },
      ],
      testimonials: [
        {
          quote:
            'My son went from dreading math to asking for extra practice. Bloom just clicks with how he learns.',
          name: 'Priya S.',
          role: 'Parent, Grade 6',
        },
        {
          quote:
            'The parent dashboard gives me visibility I never had with any other platform. I can see exactly what she struggled with.',
          name: 'Arjun M.',
          role: 'Parent, Grade 8',
        },
        {
          quote:
            'Finally an EdTech product that feels premium and actually works. The AI companion is unlike anything else.',
          name: 'Deepa R.',
          role: 'Parent, Grade 5',
        },
      ],
    },
  },
  {
    section: 'cta',
    order: 6,
    title: 'Ready to Transform Learning?',
    subtitle:
      'Join thousands of families who chose intelligence over information overload.',
    primaryCTA: 'Start Free Trial',
    secondaryCTA: 'Book a Demo',
    primaryCTALink: '/login?role=student',
    secondaryCTALink: '/book-demo',
    enabled: true,
    metadata: {},
  },
]

const DEFAULTS_BY_PAGE = { home: HOME_DEFAULTS }

// ── Public: enabled sections sorted by order ──────────────────────────────────
export async function getSectionsForPage(page) {
  const docs = await CmsSection.find({ page, enabled: true }).sort({ order: 1 }).lean()
  if (docs.length) return docs

  const defaults = DEFAULTS_BY_PAGE[page]
  if (!defaults) return []

  // Seed defaults into DB on first request so admin can edit them
  try {
    await CmsSection.insertMany(
      defaults.map(d => ({ ...d, page })),
      { ordered: false }
    )
  } catch {
    // ignore duplicate-key errors on concurrent first requests
  }

  return defaults.filter(d => d.enabled).sort((a, b) => a.order - b.order)
}

// ── Admin: all sections (enabled + disabled) ──────────────────────────────────
export async function getAllSectionsForPage(page) {
  const docs = await CmsSection.find({ page }).sort({ order: 1 }).lean()
  if (docs.length) return docs

  const defaults = DEFAULTS_BY_PAGE[page] || []
  return defaults.sort((a, b) => a.order - b.order)
}

// ── Upsert one section ────────────────────────────────────────────────────────
export async function upsertSection(page, section, data) {
  const { page: _p, section: _s, ...rest } = data
  return CmsSection.findOneAndUpdate(
    { page, section },
    { $set: { ...rest, page, section } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

// ── Toggle enabled ────────────────────────────────────────────────────────────
export async function toggleSection(page, section, enabled) {
  return CmsSection.findOneAndUpdate(
    { page, section },
    { $set: { enabled } },
    { new: true }
  )
}

// ── Reorder sections ──────────────────────────────────────────────────────────
export async function reorderSections(page, orderedSections) {
  const ops = orderedSections.map((s, i) => ({
    updateOne: {
      filter: { page, section: s.section },
      update: { $set: { order: i + 1 } },
    },
  }))
  return CmsSection.bulkWrite(ops)
}
