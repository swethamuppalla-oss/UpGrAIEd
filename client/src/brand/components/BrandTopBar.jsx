import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Why UpGrAIEd', href: '/why' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Pricing', href: '/pricing' },
]

export default function BrandTopBar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 48px',
      height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      background: scrolled ? 'rgba(6,4,15,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      {/* Logo */}
      <button
        onClick={() => navigate('/brand')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, padding: 0,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🌿</div>
        <span style={{
          fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #fff 30%, rgba(110,220,95,0.9) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>UpGrAIEd</span>
      </button>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'rgba(240,238,248,0.6)',
              fontSize: 14, fontWeight: 500,
              padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none',
              transition: 'color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(240,238,248,1)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(240,238,248,0.6)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(240,238,248,0.7)', fontSize: 14, fontWeight: 500,
            padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
            e.currentTarget.style.color = 'rgba(240,238,248,1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.color = 'rgba(240,238,248,0.7)'
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/login?role=student')}
          style={{
            background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
            border: 'none',
            color: '#06040F', fontSize: 14, fontWeight: 700,
            padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(110,220,95,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Get Started
        </button>
      </div>
    </header>
  )
}
