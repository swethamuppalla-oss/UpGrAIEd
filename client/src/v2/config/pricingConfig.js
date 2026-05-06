/**
 * Default section models for the Pricing page.
 * Shape: { [sectionId]: content }
 * Stored in MongoDB under config.pages.pricingV2
 */
export const pricingConfig = {
  hero: {
    badge: 'PRICING',
    title: 'Simple, transparent pricing',
    titleHighlight: 'for every family.',
    subtitle: 'Choose the plan that works for your child. No hidden fees, cancel anytime.',
    ctaText: '',
    ctaSecondaryText: '',
    image: '',
  },

  plans: {
    badge: 'PLANS',
    heading: 'Choose Your Plan',
    subheading: 'All plans include access to Bloom, our AI learning companion.',
    plans: [
      {
        name: 'Starter',
        price: '₹999',
        period: '/month',
        subtext: 'or $12 USD',
        features: [
          'Access to 3 AI learning modules',
          'Bloom companion (basic)',
          'Weekly progress report',
          'Parent dashboard',
        ],
        excludes: [
          'Live Q&A sessions',
          'Priority support',
          'Advanced analytics',
        ],
        featured: false,
        ctaText: 'Get Started',
      },
      {
        name: 'Champion',
        price: '₹2,499',
        period: '/month',
        subtext: 'or $29 USD',
        features: [
          'Access to all 6 AI learning modules',
          'Bloom companion (full personality)',
          'Daily progress report',
          'Parent dashboard + analytics',
          'Live Q&A sessions (2/month)',
          'Priority support',
        ],
        excludes: [],
        featured: true,
        ctaText: 'Start Champion',
      },
      {
        name: 'Family',
        price: '₹3,999',
        period: '/month',
        subtext: 'or $49 USD',
        features: [
          'Up to 3 children',
          'All Champion features',
          'Family progress dashboard',
          'Live Q&A sessions (4/month)',
          'Dedicated support',
        ],
        excludes: [],
        featured: false,
        ctaText: 'Start Family',
      },
    ],
  },

  whatsIncluded: {
    badge: 'EVERY PLAN INCLUDES',
    heading: 'Built-in from day one.',
    subheading: 'Every UpgrAIed plan ships with the foundation your child needs to succeed.',
    items: [
      { icon: '🤖', title: 'Bloom AI Companion',          desc: 'Your child\'s personal AI learning guide — patient, encouraging, and always available.' },
      { icon: '🎯', title: 'Structured Missions',         desc: 'Curated learning paths designed by educators with clear goals and milestones.' },
      { icon: '📊', title: 'Parent Dashboard',            desc: 'Real-time progress tracking so you always know what your child is learning.' },
      { icon: '🛡️', title: 'Age-Safe Content',           desc: 'Every output is filtered and curated for ages 8–14. Zero inappropriate content.' },
      { icon: '🏆', title: 'Badges & Achievements',       desc: 'Children celebrate milestones and stay motivated with a visual achievement system.' },
      { icon: '📱', title: 'Works on Any Device',         desc: 'Browser-based — no app install needed. Works on tablet, laptop, or desktop.' },
      { icon: '🔒', title: 'Data Privacy',                desc: 'Your child\'s data is never sold or used for advertising. COPPA compliant.' },
      { icon: '🌐', title: 'Multi-language Support',      desc: 'Available in English and Hindi. More languages coming soon.' },
    ],
  },

  guarantees: {
    badge: 'OUR PROMISE',
    heading: 'Zero-risk. Full confidence.',
    subheading: 'We stand behind every plan with promises that put your family first.',
    items: [
      { icon: '🎁', title: 'Free Demo Session',      desc: 'Try a full session with Bloom before you pay. No credit card required.' },
      { icon: '↩️', title: 'Cancel Anytime',         desc: 'No lock-in contracts. Cancel with one click. No questions asked.' },
      { icon: '🛡️', title: 'Data Privacy First',    desc: 'Your child\'s data is never shared, sold, or used to train AI models.' },
      { icon: '👶', title: 'Child Safety Guarantee', desc: 'Every session is safe for ages 8–14. Bloom never produces off-topic or harmful content.' },
    ],
  },

  faq: {
    badge: 'QUESTIONS',
    heading: 'Pricing questions answered',
    items: [
      { question: 'Can I cancel anytime?',        answer: 'Yes. No contracts, cancel with one click from your dashboard. No questions asked.' },
      { question: 'Is there a free trial?',        answer: 'We offer a free demo session before any commitment. Book it from the home page.' },
      { question: 'Do you offer discounts?',        answer: 'Yes — annual plans save 20%. Contact us for school or group pricing.' },
      { question: 'What currency do you accept?',  answer: 'We accept INR and USD. Prices are shown in both. Payments via Stripe and Razorpay.' },
      { question: 'Can I switch plans?',           answer: 'Yes — upgrade or downgrade anytime from your account dashboard. Changes apply at the next billing cycle.' },
    ],
  },

  cta: {
    badge: 'START TODAY',
    heading: 'Your child\'s first session is free.',
    subheading: 'Pick a plan, meet Bloom, and watch your child discover what real learning feels like.',
    ctaText: 'Start Learning Free',
    ctaSecondaryText: 'View All Features',
    note: 'No credit card required · Cancel anytime · Free demo session',
  },
};

/** Ordered list of section IDs to render on the Pricing page. */
export const pricingSections = [
  { id: 'hero',          type: 'hero' },
  { id: 'plans',         type: 'pricing' },
  { id: 'whatsIncluded', type: 'whatsIncluded' },
  { id: 'guarantees',    type: 'guarantees' },
  { id: 'faq',           type: 'faq' },
  { id: 'cta',           type: 'cta' },
];
