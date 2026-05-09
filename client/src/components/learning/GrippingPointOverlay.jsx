import { useState, useRef, useEffect } from 'react';
import { useROB } from '../../context/RobContext';
import CheckpointMCQ from './CheckpointMCQ';
import CheckpointTyped from './CheckpointTyped';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function submitAnswer(grippingPointId, answer) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/api/gripping-points/${grippingPointId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) throw new Error('Failed to submit');
  return res.json();
}

/* ───────────────────────────────────────────────────────────────
   GrippingPointOverlay
   Props:
     point       — the GrippingPoint object (from API, no correctAnswer)
     onComplete  — () => void, called when student is ready to continue
   ─────────────────────────────────────────────────────────────── */
export default function GrippingPointOverlay({ point, onComplete }) {
  const { addXP } = useROB() || {};
  const [phase, setPhase]         = useState('question'); // 'question' | 'feedback'
  const [feedback, setFeedback]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [visible, setVisible]     = useState(false);

  // entrance animation
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const handleSubmit = async (answer) => {
    setLoading(true);
    try {
      const data = await submitAnswer(point._id, answer);
      setFeedback(data);
      if (data.isCorrect && data.xpAwarded > 0) {
        addXP?.(data.xpAwarded);
      }
      setPhase('feedback');
    } catch {
      setFeedback({ isCorrect: false, explanation: 'Could not check answer — please continue.', bloomReaction: '🌿 No worries, keep going!' });
      setPhase('feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 10, 7, 0.78)',
      backdropFilter: 'blur(12px)',
      padding: '20px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 520, borderRadius: 28,
        background: 'linear-gradient(160deg, #0D2318 0%, #08150F 100%)',
        border: '1px solid rgba(110,220,95,0.2)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(110,220,95,0.08)',
        overflow: 'hidden',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      }}>
        {/* ── Header ── */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(110,220,95,0.12)', border: '1px solid rgba(110,220,95,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🌿</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6EDC5F', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>Bloom paused the video</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Answer to continue watching · +{point.xpReward} XP</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 1 ? '#6EDC5F' : 'rgba(255,255,255,0.1)', animation: i === 1 ? 'gpPulse 1.5s ease-in-out infinite' : 'none' }} />)}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px 24px 24px' }}>
          {phase === 'question' ? (
            <>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.55, marginBottom: 20 }}>
                {point.question}
              </p>
              {point.questionType === 'mcq'
                ? <CheckpointMCQ point={point} onSubmit={handleSubmit} loading={loading} />
                : <CheckpointTyped point={point} onSubmit={handleSubmit} loading={loading} />
              }
            </>
          ) : (
            /* ── Feedback phase ── */
            <div>
              {/* Result banner */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14,
                background: feedback.isCorrect ? 'rgba(110,220,95,0.1)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${feedback.isCorrect ? 'rgba(110,220,95,0.3)' : 'rgba(239,68,68,0.25)'}`,
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 26 }}>{feedback.isCorrect ? '✅' : '❌'}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: feedback.isCorrect ? '#6EDC5F' : '#F87171', marginBottom: 2 }}>
                    {feedback.isCorrect ? `+${feedback.xpAwarded} XP earned!` : 'Not quite…'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{feedback.bloomReaction}</div>
                </div>
              </div>

              {/* Explanation */}
              {feedback.explanation && (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>💡 Explanation</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>{feedback.explanation}</p>
                </div>
              )}

              <button
                onClick={handleContinue}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14,
                  background: 'linear-gradient(135deg,#6EDC5F,#3DAA3A)',
                  color: '#0A1F12', border: 'none', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Continue Watching →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gpPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
