export const EDITABLE_FIELDS = {
  hero: ['title', 'subtitle', 'ctaText', 'image'],
  navbar: ['logo', 'brandName'],
}

export const PAGES_DEFAULT = {
  home: {
    hero: { title: '', subtitle: '', ctaText: 'Start Learning Free', image: '' },
    features: [],
    cta: { title: '', button: 'Book Free Demo' },
  },
  whyUpgraied: {
    intro: { title: '', description: '' },
    benefits: [],
  },
  pricing: {
    plans: [],
  },
  login: {
    title: '',
    subtitle: '',
    buttonText: 'Sign In',
    image: '',
  },
  // v2 editable-sections pages — content is stored per section id
  whyV2:     {},
  pricingV2: {},
}

export function validateUIConfig(config) {
  const errors = []
  if (!config.sections?.hero?.title?.trim()) errors.push('Hero title is required')
  if (!config.sections?.hero?.ctaText?.trim()) errors.push('CTA text is required')
  return errors
}

export function isFieldEditable(section, field) {
  return EDITABLE_FIELDS[section]?.includes(field) ?? false
}
