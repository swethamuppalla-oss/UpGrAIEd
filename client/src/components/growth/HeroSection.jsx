import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '120px 32px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: '5%', left: '-15%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,63,228,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '0%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '40%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,122,47,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '64px', alignItems: 'center',
      }} className="hero-grid">
        {/* Left: Copy */}
        <div style={{ animation: 'heroRise 0.8s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '50px',
            background: 'rgba(123,63,228,0.12)',
            border: '1px solid rgba(155,111,244,0.25)',
            marginBottom: '28px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#9B6FF4', display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ color: '#9B6FF4', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
              AI LEARNING FOR AGES 8–14
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', marginBottom: '24px',
          }}>
            Future Skills<br />
            for Kids{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9B6FF4 0%, #EC4899 50%, #FF7A2F 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Starts Here</span>
          </h1>

          <p style={{
            fontSize: '18px', lineHeight: 1.75,
            color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '460px',
          }}>
            AI, confidence, focus and smart thinking — taught in a fun,
            guided way with{' '}
            <strong style={{ color: '#9B6FF4' }}>ROB</strong>,
            your child's AI learning buddy.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                padding: '15px 32px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #7B3FE4, #EC4899)',
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '16px',
                cursor: 'pointer', boxShadow: '0 8px 32px rgba(123,63,228,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(123,63,228,0.55)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(123,63,228,0.4)'; }}
            >
              🚀 Book Free Demo
            </button>
            <button
              onClick={() => navigate('/why')}
              style={{
                padding: '15px 32px', borderRadius: '50px',
                background: 'transparent', color: 'var(--text-primary)',
                border: '1px solid rgba(255,255,255,0.14)', fontWeight: 600,
                fontSize: '16px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(155,111,244,0.5)'; e.currentTarget.style.background = 'rgba(123,63,228,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Explore Program →
            </button>
          </div>

          {/* Social proof strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex' }}>
              {['#7B3FE4','#EC4899','#FF7A2F','#22C55E','#3B82F6'].map((color, i) => (
                <div key={i} style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px',
                  marginLeft: i > 0 ? '-10px' : '0',
                  border: '2px solid var(--bg-primary)',
                }}>
                  {['👩','👨','👩','👨','👩'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '1px', marginBottom: '3px' }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: '#FF7A2F', fontSize: '13px' }}>★</span>
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                500+ parents in early access
              </p>
            </div>
          </div>
        </div>

        {/* Right: ROB Visualization */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: 'heroRise 0.8s ease 0.15s both',
        }}>
          <RobVisual />
        </div>
      </div>
    </section>
  );
}

function RobVisual() {
  const floatingChips = [
    { label: '🧠 Critical Thinking', top: '8%', left: '-8%' },
    { label: '🚀 AI Skills', top: '18%', right: '-12%' },
    { label: '⭐ Confidence', bottom: '22%', left: '-12%' },
    { label: '🎯 Focus', bottom: '12%', right: '-8%' },
  ];

  return (
    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: '-30px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,63,228,0.18) 0%, transparent 65%)',
        animation: 'pulse 3s ease-in-out infinite',
      }} />

      {/* Inner circle */}
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(123,63,228,0.1) 0%, rgba(236,72,153,0.08) 100%)',
        border: '1px solid rgba(155,111,244,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'visible',
        boxShadow: 'inset 0 0 60px rgba(123,63,228,0.05)',
      }}>
        <div style={{ fontSize: '110px', animation: 'robFloat 4s ease-in-out infinite', userSelect: 'none' }}>
          🤖
        </div>

        {/* Skill chips */}
        {floatingChips.map((chip, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: chip.top, left: chip.left, right: chip.right, bottom: chip.bottom,
            padding: '7px 14px', borderRadius: '50px',
            background: 'rgba(18, 18, 26, 0.92)',
            border: '1px solid rgba(155,111,244,0.25)',
            color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
            whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            animation: `robFloat 4s ease-in-out ${i * 0.6}s infinite`,
          }}>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Orbiting ring */}
      <svg style={{ position: 'absolute', inset: '-40px', width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', opacity: 0.15 }}>
        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#9B6FF4" strokeWidth="1" strokeDasharray="4 8" />
      </svg>

      {/* Dot accents */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div key={i} style={{
          position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
          background: i % 2 === 0 ? '#7B3FE4' : '#EC4899',
          top: `calc(50% + ${225 * Math.sin((deg - 90) * Math.PI / 180)}px - 4px)`,
          left: `calc(50% + ${225 * Math.cos((deg - 90) * Math.PI / 180)}px - 4px)`,
          opacity: 0.5,
        }} />
      ))}
    </div>
  );
}
