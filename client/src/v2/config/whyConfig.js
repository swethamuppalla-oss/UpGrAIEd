/**
 * Default section models for the Why UpgrAIed page.
 * Shape: { [sectionId]: content }
 * Stored in MongoDB under config.pages.whyV2
 */
export const whyConfig = {
  hero: {
    badge: 'THE UPGRAIED METHOD',
    title: 'Not another learning system.',
    titleHighlight: 'A transformation system.',
    subtitle: "UpgrAIed is built on one belief: children who learn to think with AI will outperform every peer who doesn't. We give them the tools, structure, and companionship to make that happen.",
    ctaText: 'Start Learning Free',
    ctaSecondaryText: 'Book a Demo',
    socialProof: 'Trusted by 1,000+ families across India',
    image: '',
  },

  problem: {
    badge: 'THE PROBLEM',
    heading: 'Traditional learning is broken.',
    subheading: 'Students memorize to pass. UpgrAIed teaches them to think to succeed.',
    oldWay: {
      label: 'TRADITIONAL LEARNING',
      items: [
        'Memorize facts, forget them after the exam',
        'Passive learning — watch, read, repeat',
        'One-size-fits-all curriculum',
        'No feedback until a test is graded',
        'AI used as a shortcut, not a skill',
      ],
    },
    newWay: {
      label: 'THE UPGRAIED WAY',
      items: [
        'Understand deeply — concepts stick for life',
        'Active missions — build, solve, explore every session',
        'Adapts to your child\'s pace and learning style',
        'Real-time feedback from Bloom, your AI companion',
        'AI as a thinking partner that builds real skills',
      ],
    },
  },

  howItWorks: {
    badge: 'HOW IT WORKS',
    heading: 'From day one to breakthrough.',
    subheading: 'A simple, structured system that builds your child\'s thinking skills in 4 clear steps.',
    steps: [
      {
        icon: '🎯',
        title: 'Pick a Mission',
        desc: 'Your child chooses a structured learning mission aligned to their goals and grade level.',
      },
      {
        icon: '🤖',
        title: 'Learn with Bloom',
        desc: 'Bloom guides them through concepts, asks great questions, and never just gives the answer.',
      },
      {
        icon: '🧠',
        title: 'Think & Build',
        desc: 'Every session includes hands-on challenges that require actual thinking — not memorization.',
      },
      {
        icon: '📊',
        title: 'Track Progress',
        desc: 'Parents see real-time reports. Children earn badges and celebrate real milestones.',
      },
    ],
  },

  benefits: {
    badge: 'REAL UNDERSTANDING',
    heading: 'More Than Studying.',
    headingHighlight: 'Real Understanding.',
    subheading: 'Our system focuses on mastery — teaching students how to think, not what to memorize.',
    items: [
      { icon: '🧠', title: 'Learn concepts clearly',        desc: 'Focus on core principles instead of memorizing facts.' },
      { icon: '🧩', title: 'Break problems into steps',     desc: 'Tackle complex topics by dividing them into manageable parts.' },
      { icon: '❓', title: 'Ask better questions',          desc: 'Develop the curiosity and logical thinking needed to explore deeply.' },
      { icon: '🤖', title: 'Use AI as a thinking partner', desc: 'Collaborate with AI to validate ideas and strengthen arguments.' },
    ],
  },

  trust: {
    badge: 'FOR PARENTS',
    heading: 'Give your child more than',
    headingHighlight: 'just answers.',
    subheading: 'Our system helps them understand concepts, think independently, and build confidence — across any subject.',
    stats: [
      { value: '1,000+', label: 'Learners Enrolled',   icon: '👧' },
      { value: '95%',    label: 'Parent Satisfaction',  icon: '⭐' },
      { value: '3x',     label: 'Faster Understanding', icon: '🚀' },
      { value: '0',      label: 'Coding Required',      icon: '✅' },
    ],
    points: [
      { icon: '🛡️', title: 'Age-Appropriate Learning',      desc: 'Every piece of content is curated for ages 8–14. No inappropriate AI outputs, ever.' },
      { icon: '👀', title: 'Guided AI Usage',               desc: 'Children learn to use AI with guardrails — supervised, purposeful, and skill-building.' },
      { icon: '📊', title: 'Progress Visibility',           desc: 'Parents get a real-time dashboard showing exactly what their child learned.' },
      { icon: '📚', title: 'Structured Learning System',    desc: 'Built by educators. Every module has clear goals and milestones.' },
      { icon: '🎓', title: 'Real Skills, Not Passive Videos', desc: 'Interactive missions > passive watching. Children build and solve every session.' },
      { icon: '🤝', title: 'Parent-Friendly Design',        desc: 'Easy onboarding, simple controls, and transparent reporting built for busy parents.' },
    ],
  },

  faq: {
    badge: 'FREQUENTLY ASKED',
    heading: 'Everything parents want to know',
    items: [
      { question: 'Is UpgrAIed safe for children?',            answer: 'Absolutely. Every module is designed for ages 8–14 with age-appropriate content, guided AI usage, and zero access to unfiltered internet. Bloom only responds within curated, safe learning contexts.' },
      { question: 'Do kids need any coding or tech knowledge?', answer: 'Zero prerequisites. UpgrAIed starts from absolute basics. Children who have never touched a computer can start, and those already curious about tech will be challenged at their level.' },
      { question: 'Will my child use AI responsibly?',          answer: "Yes — that's the whole point. We teach children that AI is a tool, not a replacement for thinking. Every mission builds the child's own reasoning skills." },
      { question: 'How much screen time does this involve?',    answer: 'We recommend 30–45 minutes per session, 3–4 times a week. Sessions are designed to be focused and purposeful — not endless scrolling.' },
      { question: 'Can parents track progress?',               answer: "Yes — the parent dashboard is a core feature. You'll see completed missions, earned badges, quiz scores, and module progress in real time." },
      { question: "What if my child doesn't like it?",          answer: 'We offer a free demo session before any commitment. Try it first, see how your child engages with Bloom and the missions.' },
    ],
  },

  cta: {
    badge: 'GET STARTED TODAY',
    heading: 'Give your child the thinking skills that last a lifetime.',
    subheading: 'Join 1,000+ families building the next generation of thinkers. First session is free.',
    ctaText: 'Start Learning Free',
    ctaSecondaryText: 'Book a Demo',
    note: 'No credit card required · Cancel anytime · Free demo session',
  },
};

/** Ordered list of section IDs to render on the Why page. */
export const whySections = [
  { id: 'hero',       type: 'hero' },
  { id: 'problem',    type: 'problem' },
  { id: 'howItWorks', type: 'howItWorks' },
  { id: 'benefits',   type: 'benefits' },
  { id: 'trust',      type: 'trust' },
  { id: 'faq',        type: 'faq' },
  { id: 'cta',        type: 'cta' },
];
