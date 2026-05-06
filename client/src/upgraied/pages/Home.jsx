import React from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, radius, shadow } from '../theme'

/**
 * Upgraied V2 — Home page scaffold.
 * Replace placeholder sections with real section components as they're built.
 */
export default function Home() {
  const navigate = useNavigate()

  return (
    <main>
      <HeroPlaceholder navigate={navigate} />
      <SectionPlaceholder label="Benefits" />
      <SectionPlaceholder label="How It Works" />
      <SectionPlaceholder label="Pricing" />
    </main>
  )
}

// ── Placeholder Hero ───────────────────────────────────────────────────────────
function HeroPlaceholder({ navigate }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      background: 'linear-gradient(160deg, #FFFFFF 0%, #F7FFF8 40%, #F0FFF4 100%)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blob */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 16px 5px 12px', borderRadius: radius.full,
        background: 'rgba(110,220,95,0.10)',
        border: `1px solid ${colors.border}`,
        marginBottom: 28,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: colors.primary, display: 'inline-block',
        }} />
        <span style={{ color: '#2A7A20', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>
          UPGRAIED V2 — IN DEVELOPMENT
        </span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(36px, 5.5vw, 68px)',
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: '-0.03em',
        color: colors.textPrimary,
        maxWidth: 780,
        marginBottom: 24,
      }}>
        Learn Your Subjects.{' '}
        <span style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.mint})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Master How to Think with AI.
        </span>
      </h1>

      {/* Sub */}
      <p style={{
        fontSize: 18,
        lineHeight: 1.75,
        color: colors.textSecondary,
        maxWidth: 520,
        marginBottom: 44,
      }}>
        Upload your school pages. We turn them into a structured 7-day learning journey.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/login?role=student')}
          style={{
            background: colors.primary,
            color: '#0D2010',
            border: 'none',
            borderRadius: radius.lg,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(110,220,95,0.4)',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          Start Learning Free
        </button>
        <button
          onClick={() => navigate('/why-v2')}
          style={{
            background: 'transparent',
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          See How It Works
        </button>
      </div>
    </section>
  )
}

// ── Generic section placeholder ────────────────────────────────────────────────
function SectionPlaceholder({ label }) {
  return (
    <section style={{
      padding: '80px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: label === 'Benefits' ? '#F8FAF8' : '#FFFFFF',
      borderTop: '1px solid rgba(110,220,95,0.10)',
    }}>
      <div style={{
        padding: '32px 48px',
        borderRadius: radius.xl,
        border: '2px dashed rgba(110,220,95,0.25)',
        textAlign: 'center',
        color: colors.textMuted,
        maxWidth: 480,
        width: '100%',
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🚧</div>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
          {label} section — coming soon
        </p>
      </div>
    </section>
  )
}
