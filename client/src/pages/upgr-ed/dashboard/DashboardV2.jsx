import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../../../components/Bloom/BloomCharacter';
import { DEFAULT_CURRICULUM } from '../../../config/defaults';

const NAV = [
  { id: 'home',     label: 'Home',     icon: '🏠' },
  { id: 'modules',  label: 'Modules',  icon: '📚' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const STATS = [
  { label: 'Modules Done', value: '2 / 6', color: '#6EDC5F' },
  { label: 'Day Streak',   value: '3 days 🔥', color: '#FFD95A' },
  { label: 'Accuracy',     value: '78%',   color: '#63C7FF' },
];

function moduleStatus(i) {
  if (i < 2)  return { label: '✓ Done',    bg: 'rgba(110,220,95,0.14)', color: '#22A84B' };
  if (i === 2) return { label: 'Unlocked', bg: 'rgba(99,199,255,0.14)',  color: '#2492CC' };
  return { label: '🔒 Locked', bg: 'rgba(75,107,87,0.08)', color: '#4B6B57' };
}

export default function DashboardV2() {
  const [activeNav, setActiveNav] = useState('home');
  const nav = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7FFF8', color: '#0A1F12' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#FFFFFF',
        borderRight: '1px solid rgba(110,220,95,0.18)',
        display: 'flex', flexDirection: 'column',
        padding: '0', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 20px', borderBottom: '1px solid rgba(110,220,95,0.12)' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0A1F12', cursor: 'pointer' }}
            onClick={() => nav('/upgraied')}>
            UpgrAIed
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6EDC5F', marginTop: 2, letterSpacing: '0.06em' }}>
            UPGRAIED
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 10px', flex: 1 }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeNav === item.id ? 'rgba(110,220,95,0.13)' : 'transparent',
                color: activeNav === item.id ? '#0A1F12' : '#4B6B57',
                fontWeight: activeNav === item.id ? 700 : 500,
                fontSize: 14, marginBottom: 2, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Back link */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(110,220,95,0.1)' }}>
          <button
            onClick={() => nav('/upgraied')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#4B6B57', padding: 0,
            }}
          >
            ← Back to UpGrEd
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, padding: '36px 40px', maxWidth: 'calc(100vw - 220px)' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', color: '#0A1F12' }}>
              Welcome back! 👋
            </h1>
            <p style={{ fontSize: 14, color: '#4B6B57', margin: 0 }}>
              Continue your learning journey
            </p>
          </div>
          <BloomCharacter emotion="encouraging" size="small" speech="You've got this!" animate />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: '#FFFFFF', padding: '20px 24px', borderRadius: 14,
              border: '1px solid rgba(110,220,95,0.14)',
              boxShadow: '0 2px 10px rgba(10,31,18,0.04)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#4B6B57', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#0A1F12' }}>
            Your Modules
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 1fr))',
            gap: 16,
          }}>
            {DEFAULT_CURRICULUM.modules.map((mod, i) => {
              const status = moduleStatus(i);
              return (
                <div
                  key={mod.module}
                  style={{
                    background: '#FFFFFF', padding: '20px', borderRadius: 14,
                    border: '1px solid rgba(110,220,95,0.14)',
                    boxShadow: '0 2px 10px rgba(10,31,18,0.04)',
                    opacity: i > 2 ? 0.55 : 1,
                    cursor: i <= 2 ? 'pointer' : 'default',
                    transition: 'transform 0.12s',
                  }}
                  onMouseEnter={e => i <= 2 && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{mod.icon}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                      background: status.bg, color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0A1F12' }}>
                    {mod.module}. {mod.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#4B6B57', margin: 0, lineHeight: 1.55 }}>
                    {mod.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
