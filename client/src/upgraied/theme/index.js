/**
 * Upgraied V2 design tokens (JS mirror of theme.css variables).
 * Use these in inline styles or pass to styled components if adopted later.
 */
export const colors = {
  primary:         '#6EDC5F',
  secondary:       '#63C7FF',
  accent:          '#FFD95A',
  coral:           '#FF8A65',
  mint:            '#A8F5A2',

  bg:              '#FFFFFF',
  surface:         '#F8FAF8',
  surfaceAlt:      '#F0FFF4',

  textPrimary:     '#0D2318',
  textSecondary:   'rgba(13,35,24,0.65)',
  textMuted:       'rgba(13,35,24,0.40)',

  border:          'rgba(110,220,95,0.20)',
  borderHover:     'rgba(110,220,95,0.42)',
}

export const radius = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '24px',
  '2xl':'32px',
  full: '9999px',
}

export const shadow = {
  card: '0 8px 24px rgba(0,0,0,0.06)',
  glow: '0 0 40px rgba(110,220,95,0.18), 0 8px 32px rgba(10,31,18,0.08)',
  sky:  '0 0 30px rgba(99,199,255,0.15), 0 8px 24px rgba(10,31,18,0.06)',
}

export const font = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "'Nunito', 'Inter', sans-serif",
}

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
}
