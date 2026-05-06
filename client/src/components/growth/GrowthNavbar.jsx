import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditMode } from '../../context/EditModeContext';
import { useToast } from '../ui/Toast';
import VersionHistoryPanel from '../admin/VersionHistoryPanel';

export default function GrowthNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { editMode, isAdmin, hasDraft, enterEditMode, discardDraft, publishDraft } = useEditMode();
  const { showToast } = useToast();

  const handlePublish = async () => {
    setSaving(true);
    try {
      await publishDraft();
      showToast('Changes published!', 'success');
    } catch (err) {
      showToast(err.message || 'Publish failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home',      path: '/' },
    { label: 'Why',       path: '/why-v2' },
    { label: 'Pricing',   path: '/pricing-v2' },
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
      background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(110,220,95,0.15)' : 'none',
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
          background: 'linear-gradient(135deg, #2A7A20, #6EDC5F)',
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
              color: location.pathname === link.path ? '#0A1F12' : '#4B6B57',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              transition: 'color 0.2s',
              borderBottom: location.pathname === link.path ? '2px solid #6EDC5F' : '2px solid transparent',
              paddingBottom: '2px',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#0A1F12'}
            onMouseOut={e => {
              if (location.pathname !== link.path)
                e.currentTarget.style.color = '#4B6B57';
            }}
          >
            {link.label}
          </span>
        ))}
        {isAdmin && !editMode && (
          <button
            onClick={enterEditMode}
            style={{
              fontSize: '12px', padding: '7px 16px', borderRadius: '8px',
              background: 'rgba(110,220,95,0.12)', border: '1px solid rgba(110,220,95,0.35)',
              color: '#2A7A20', cursor: 'pointer', fontWeight: 600,
            }}
          >
            Edit Page
          </button>
        )}
        <button
          onClick={() => navigate('/login')}
          className="bloom-btn-primary"
          style={{ fontSize: '13px', padding: '9px 22px' }}
        >
          Login
        </button>
      </div>

      {/* Edit mode toolbar */}
      {editMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
          height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          background: 'linear-gradient(90deg, #0D2318, #10291D)',
          borderBottom: '2px solid #6EDC5F',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6EDC5F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em' }}>
              EDIT MODE
            </span>
            {hasDraft && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FFD95A', fontSize: '11px' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#FFD95A', display: 'inline-block',
                  boxShadow: '0 0 6px #FFD95A',
                }} />
                Unsaved changes
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setShowHistory(true)}
              style={{
                fontSize: '12px', padding: '5px 14px', borderRadius: '6px',
                background: 'transparent', border: '1px solid rgba(168,245,162,0.2)',
                color: 'rgba(168,245,162,0.6)', cursor: 'pointer',
              }}
            >
              History
            </button>
            <button
              onClick={discardDraft}
              style={{
                fontSize: '12px', padding: '5px 14px', borderRadius: '6px',
                background: 'transparent', border: '1px solid rgba(168,245,162,0.3)',
                color: 'rgba(168,245,162,0.7)', cursor: 'pointer',
              }}
            >
              Discard
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              style={{
                fontSize: '12px', padding: '5px 20px', borderRadius: '6px',
                background: saving ? 'rgba(110,220,95,0.3)' : '#6EDC5F',
                border: 'none', color: '#0A1F12', cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 700,
              }}
            >
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      )}

      {/* Version history panel */}
      {showHistory && <VersionHistoryPanel onClose={() => setShowHistory(false)} />}

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="growth-nav-mobile"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#0A1F12', fontSize: '24px', padding: '4px',
          display: 'none',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '68px', left: 0, right: 0,
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(110,220,95,0.15)',
          padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {navLinks.map(link => (
            <span
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              style={{ color: '#0A1F12', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}
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
