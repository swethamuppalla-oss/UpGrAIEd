import { useEffect } from 'react'
import GradientBackground from '../components/GradientBackground'
import AmbientCursor from '../components/AmbientCursor'
import BrandTopBar from '../components/BrandTopBar'
import HeroSection from '../sections/HeroSection'
import BloomSection from '../sections/BloomSection'
import LearningFlowSection from '../sections/LearningFlowSection'
import EcosystemSection from '../sections/EcosystemSection'
import ParentTrustSection from '../sections/ParentTrustSection'
import CTASection from '../sections/CTASection'
import { useCmsPage, ensureKeyframes } from '../hooks/useCmsPage'

const SECTION_ORDER = [
  'hero',
  'bloom',
  'learningFlow',
  'ecosystem',
  'parentTrust',
  'cta',
]

const SECTION_COMPONENTS = {
  hero:          HeroSection,
  bloom:         BloomSection,
  learningFlow:  LearningFlowSection,
  ecosystem:     EcosystemSection,
  parentTrust:   ParentTrustSection,
  cta:           CTASection,
}

const FOOTER_KF = `
@keyframes footerFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`

export default function HomePage() {
  const { sections, loading } = useCmsPage('home')

  useEffect(() => {
    ensureKeyframes()
    const tag = document.createElement('style')
    tag.textContent = FOOTER_KF
    document.head.appendChild(tag)
    document.title = 'UpGrAIEd — Human Teaching. AI-Guided Growth.'
  }, [])

  // Determine render order from CMS (use order field if present, else default order)
  const renderOrder = loading
    ? SECTION_ORDER
    : SECTION_ORDER.filter(key => {
        const s = sections[key]
        return !s || s.enabled !== false
      }).sort((a, b) => {
        const oa = sections[a]?.order ?? SECTION_ORDER.indexOf(a) + 1
        const ob = sections[b]?.order ?? SECTION_ORDER.indexOf(b) + 1
        return oa - ob
      })

  return (
    <>
      <AmbientCursor />

      <GradientBackground style={{ minHeight: '100vh' }}>
        <BrandTopBar />

        {loading ? (
          // Skeleton shimmer while CMS loads
          <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(110,220,95,0.1)',
              borderTop: '3px solid #6EDC5F',
              animation: 'bloom-spin-slow 0.9s linear infinite',
            }} />
          </div>
        ) : (
          renderOrder.map(key => {
            const SectionComponent = SECTION_COMPONENTS[key]
            if (!SectionComponent) return null
            const sectionData = sections[key] || {}
            return <SectionComponent key={key} data={sectionData} />
          })
        )}

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '48px 32px',
          animation: 'footerFadeIn 1s 0.5s ease both',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>🌿</div>
              <span style={{
                fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em',
                color: '#F0EEF8',
              }}>UpGrAIEd</span>
            </div>

            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Contact', href: '/book-demo' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: 13, color: 'rgba(240,238,248,0.35)',
                    textDecoration: 'none', fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(240,238,248,0.7)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,238,248,0.35)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p style={{ fontSize: 12, color: 'rgba(240,238,248,0.25)', margin: 0 }}>
              © 2025 UpGrAIEd. All rights reserved.
            </p>
          </div>
        </footer>
      </GradientBackground>
    </>
  )
}
