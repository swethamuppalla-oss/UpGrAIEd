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
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 999,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          boxShadow: '0 8px 32px rgba(37,211,102,0.50)',
          transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(37,211,102,0.65)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.50)'; }}
        title="Chat on WhatsApp"
      >💬</a>

      {/* Sticky bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 998,
        background: 'rgba(13,35,20,0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(110,220,95,0.20)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        transform: showBar ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Pulse dot + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              background: 'rgba(110,220,95,0.15)',
              animation: 'bloom-pulse-glow 2s ease-in-out infinite',
            }} />
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              boxShadow: '0 2px 12px rgba(110,220,95,0.4)',
            }}>🌿</div>
          </div>
          <div>
            <div style={{ color: '#F0FFF4', fontWeight: 700, fontSize: 15 }}>
              Future-proof your child today
            </div>
            <div style={{ color: 'rgba(168,245,162,0.6)', fontSize: 13 }}>
              First demo session is completely free
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: 50,
              background: 'rgba(37,211,102,0.10)',
              border: '1px solid rgba(37,211,102,0.30)',
              color: '#25D366', fontWeight: 600, fontSize: 14,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.20)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.10)'; }}
          >💬 WhatsApp</a>
          <button
            onClick={() => navigate('/book-demo')}
            className="bloom-btn-primary"
            style={{ padding: '10px 24px', fontSize: 14 }}
          >Book Free Demo →</button>
        </div>
      </div>
    </>
  );
}
