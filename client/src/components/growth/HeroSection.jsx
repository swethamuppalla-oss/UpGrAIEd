import React from 'react';
import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../Bloom/BloomCharacter';

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
      background: 'linear-gradient(160deg, #0A1F12 0%, #0D2318 40%, #10231A 100%)',
    }}>
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: '5%', left: '-10%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '0%', right: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,199,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '35%', left: '45%',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,217,90,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '64px', alignItems: 'center',
      }} className="hero-grid">
        {/* Left: Copy */}
        <div style={{ animation: 'bloom-rise 0.8s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px 5px 10px', borderRadius: '50px',
            background: 'rgba(110,220,95,0.10)',
            border: '1px solid rgba(110,220,95,0.25)',
            marginBottom: '28px',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#6EDC5F', display: 'inline-block',
              boxShadow: '0 0 8px #6EDC5F',
              animation: 'bloom-pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{ color: '#A8F5A2', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
              AI LEARNING FOR AGES 8–14
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: '#F0FFF4', marginBottom: '24px',
          }}>
            Future Skills<br />
            for Kids{' '}
            <span className="bloom-text-green">
              Bloom Here
            </span>
          </h1>

          <p style={{
            fontSize: '18px', lineHeight: 1.75,
            color: 'rgba(168,245,162,0.7)', marginBottom: '40px', maxWidth: '460px',
          }}>
            AI, confidence, focus and smart thinking — taught in a fun,
            guided way with{' '}
            <strong style={{ color: '#6EDC5F' }}>Bloom</strong>,
            your child's AI learning buddy.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => navigate('/book-demo')}
              className="bloom-btn-primary"
              style={{ fontSize: '16px', padding: '15px 32px' }}
            >
              Book Free Demo
            </button>
            <button
              onClick={() => navigate('/why')}
              className="bloom-btn-ghost"
              style={{ fontSize: '16px', padding: '15px 32px' }}
            >
              Explore Program →
            </button>
          </div>

          {/* Social proof strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex' }}>
              {['#4DB84A','#63C7FF','#6EDC5F','#FFD95A','#FF8A65'].map((color, i) => (
                <div key={i} style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px',
                  marginLeft: i > 0 ? '-10px' : '0',
                  border: '2px solid #10231A',
                }}>
                  {['👩','👨','👩','👨','👩'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '1px', marginBottom: '3px' }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: '#FFD95A', fontSize: '13px' }}>★</span>
                ))}
              </div>
              <p style={{ color: 'rgba(168,245,162,0.6)', fontSize: '12px' }}>
                500+ parents in early access
              </p>
            </div>
          </div>
        </div>

        {/* Right: Bloom Character */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: 'bloom-rise 0.8s ease 0.15s both',
        }}>
          <BloomVisual />
        </div>
      </div>
    </section>
  );
}

function BloomVisual() {
  const chips = [
    { label: '🧠 Critical Thinking', top: '5%', left: '-5%', delay: '0s' },
    { label: '🚀 AI Skills', top: '15%', right: '-8%', delay: '0.8s' },
    { label: '⭐ Confidence', bottom: '22%', left: '-10%', delay: '1.6s' },
    { label: '🎯 Focus', bottom: '10%', right: '-5%', delay: '2.4s' },
  ];

  return (
    <div style={{ position: 'relative', width: '400px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute', inset: '-24px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,220,95,0.14) 0%, transparent 65%)',
        animation: 'bloom-pulse-glow 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Orbiting dashed ring */}
      <svg style={{
        position: 'absolute', inset: '-20px',
        width: 'calc(100% + 40px)', height: 'calc(100% + 40px)',
        opacity: 0.18, pointerEvents: 'none',
      }}>
        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#6EDC5F" strokeWidth="1.5" strokeDasharray="5 9" />
      </svg>

      {/* Bloom mascot */}
      <BloomCharacter
        emotion="excited"
        size="hero"
        animate={true}
        speech="Hi! I'm Bloom — let's learn AI together!"
      />

      {/* Floating skill chips */}
      {chips.map((chip, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: chip.top, left: chip.left, right: chip.right, bottom: chip.bottom,
          padding: '7px 14px', borderRadius: '50px',
          background: 'rgba(22,43,31,0.95)',
          border: '1px solid rgba(110,220,95,0.25)',
          color: '#A8F5A2', fontSize: '12px', fontWeight: 600,
          whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          animation: `bloom-float 4s ease-in-out ${chip.delay} infinite`,
        }}>
          {chip.label}
        </div>
      ))}

      {/* Dot accents */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div key={i} style={{
          position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
          background: i % 2 === 0 ? '#6EDC5F' : '#63C7FF',
          top: `calc(50% + ${215 * Math.sin((deg - 90) * Math.PI / 180)}px - 4px)`,
          left: `calc(50% + ${215 * Math.cos((deg - 90) * Math.PI / 180)}px - 4px)`,
          opacity: 0.5,
        }} />
      ))}
    </div>
  );
}
