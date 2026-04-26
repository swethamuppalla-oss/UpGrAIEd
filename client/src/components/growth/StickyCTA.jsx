import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = '919999999999';
const WA_MESSAGE = encodeURIComponent("Hi, I'd like to know more about UpgrAIed for my child.");

export default function StickyCTA() {
  const [showBar, setShowBar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp floating button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '28px', right: '28px',
          zIndex: 999,
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px',
          boxShadow: '0 8px 32px rgba(37,211,102,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          textDecoration: 'none',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.6)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.45)'; }}
        title="Chat on WhatsApp"
      >
        💬
      </a>

      {/* Sticky bottom bar (appears on scroll) */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 998,
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(155,111,244,0.2)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px',
        transform: showBar ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px' }}>🤖</div>
          <div>
            <div style={{
              color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px',
            }}>
              Future-proof your child today
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              First demo session is completely free
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: '50px',
              background: 'rgba(37,211,102,0.12)',
              border: '1px solid rgba(37,211,102,0.3)',
              color: '#25D366', fontWeight: 600, fontSize: '14px',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.12)'; }}
          >
            💬 WhatsApp
          </a>
          <button
            onClick={() => navigate('/book-demo')}
            style={{
              padding: '10px 24px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
              color: '#fff', border: 'none', fontWeight: 700,
              fontSize: '14px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(123,63,228,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Book Free Demo →
          </button>
        </div>
      </div>
    </>
  );
}
