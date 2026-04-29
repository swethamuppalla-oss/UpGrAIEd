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
    { label: 'Home', path: '/' },
    { label: 'Why UpgrAIed', path: '/why' },
    { label: 'Pricing', path: '/pricing' },
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
      background: scrolled ? 'rgba(13,35,20,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(110,220,95,0.12)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 2px 12px rgba(110,220,95,0.35)',
        }}>🌿</div>
        <span style={{
          fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #A8F5A2, #6EDC5F)',
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
              color: location.pathname === link.path ? '#A8F5A2' : 'rgba(168,245,162,0.55)',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              transition: 'color 0.2s',
              borderBottom: location.pathname === link.path ? '2px solid #6EDC5F' : '2px solid transparent',
              paddingBottom: '2px',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#A8F5A2'}
            onMouseOut={e => {
              if (location.pathname !== link.path)
                e.currentTarget.style.color = 'rgba(168,245,162,0.55)';
            }}
          >
            {link.label}
          </span>
        ))}
        <button
          onClick={() => navigate('/login')}
          className="bloom-btn-primary"
          style={{ fontSize: '13px', padding: '9px 22px' }}
        >
          Login
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="growth-nav-mobile"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#A8F5A2', fontSize: '24px', padding: '4px',
          display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '68px', left: 0, right: 0,
          background: 'rgba(13,35,20,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(110,220,95,0.12)',
          padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {navLinks.map(link => (
            <span
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{ color: '#A8F5A2', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}
            >
              {link.label}
            </span>
          ))}
          <button
            onClick={() => { navigate('/login'); setMenuOpen(false); }}
            className="bloom-btn-primary"
            style={{ padding: '12px 24px', width: '100%', fontSize: '15px' }}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
