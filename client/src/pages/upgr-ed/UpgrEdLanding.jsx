import { useNavigate } from 'react-router-dom';

export default function UpgrEdLanding() {
  const nav = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 24px',
      background: 'linear-gradient(160deg, #EDFFF3 0%, #FFFFFF 60%)',
    }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0A1F12', margin: '0 0 12px' }}>
        UpGrEd
      </h1>
      <p style={{ fontSize: 18, color: '#4B6B57', maxWidth: 420, lineHeight: 1.6, margin: '0 0 32px' }}>
        A structured learning system with progress tracking and practice challenges — coming soon.
      </p>
      <span style={{
        display: 'inline-block', padding: '8px 20px', borderRadius: 24,
        background: 'rgba(110,220,95,0.14)', color: '#22A84B',
        fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
        marginBottom: 32,
      }}>
        Coming Soon
      </span>
      <button
        onClick={() => nav('/upgraied')}
        style={{
          background: 'none', border: '1.5px solid rgba(10,31,18,0.15)',
          padding: '10px 24px', borderRadius: 24, cursor: 'pointer',
          fontSize: 14, fontWeight: 600, color: '#4B6B57',
        }}
      >
        ← Back to UpGrAIEd
      </button>
    </div>
  );
}
