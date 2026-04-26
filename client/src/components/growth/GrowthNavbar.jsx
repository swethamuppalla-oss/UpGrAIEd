import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GrowthNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Why UpgrAIed', path: '/why' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Book Demo', path: '/book-demo' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '0 32px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>🤖</div>
        <span style={{
          fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #9B6FF4, #EC4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>UpgrAIed</span>
      </div>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}
        className="growth-nav-desktop">
        {navLinks.map(link => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              color: location.pathname === link.path ? '#F0F0FF' : 'rgba(240,240,255,0.6)',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              transition: 'color 0.2s',
              borderBottom: location.pathname === link.path ? '2px solid #9B6FF4' : '2px solid transparent',
              paddingBottom: '2px',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#F0F0FF'}
            onMouseOut={e => {
              if (location.pathname !== link.path)
                e.currentTarget.style.color = 'rgba(240,240,255,0.6)';
            }}
          >
            {link.label}
          </span>
        ))}
        <button
          onClick={() => navigate('/book-demo')}
          style={{
            padding: '9px 22px', borderRadius: '50px',
            background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
            color: '#fff', border: 'none', fontWeight: 700,
            fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(123,63,228,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(123,63,228,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(123,63,228,0.35)'; }}
        >
          Book Free Demo
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="growth-nav-mobile"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#F0F0FF', fontSize: '24px', padding: '4px',
          display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '68px', left: 0, right: 0,
          background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {navLinks.map(link => (
            <span
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{ color: '#F0F0FF', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}
            >
              {link.label}
            </span>
          ))}
          <button
            onClick={() => { navigate('/book-demo'); setMenuOpen(false); }}
            style={{
              padding: '12px 24px', borderRadius: '50px', width: '100%',
              background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
            }}
          >
            Book Free Demo
          </button>
        </div>
      )}
    </nav>
  );
}
