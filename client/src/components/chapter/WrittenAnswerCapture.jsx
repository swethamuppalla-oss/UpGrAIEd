import { useRef, useState } from 'react'
import BloomCharacter from '../Bloom/BloomCharacter'
import { submitWrittenAnswer } from '../../services/api'

// state: 'idle' | 'preview' | 'submitting' | 'feedback'

export default function WrittenAnswerCapture({ question, weekPlanId, onComplete, onSkip }) {
  const [phase, setPhase] = useState('idle')
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const cameraRef = useRef(null)
  const fileRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setPhase('preview')
  }

  function retake() {
    setPhotoFile(null)
    setPreviewUrl(null)
    setPhase('idle')
    setError(null)
  }

  async function submit() {
    setPhase('submitting')
    setError(null)
    try {
      const fd = new FormData()
      fd.append('photo', photoFile)
      fd.append('questionText', question)
      if (weekPlanId) fd.append('weekPlanId', weekPlanId)
      const data = await submitWrittenAnswer(fd)
      setResult(data)
      setPhase('feedback')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
      setPhase('preview')
    }
  }

  if (phase === 'idle') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
        <div className="ui-card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Question
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            {question}
          </p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15 }}>
          Write your answer on paper, then take a photo of it.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            className="ui-button-primary"
            style={{ padding: '18px 24px', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            onClick={() => cameraRef.current?.click()}
          >
            📷 Take Photo
          </button>
          <button
            className="ui-button-secondary"
            style={{ padding: '14px 24px', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            onClick={() => fileRef.current?.click()}
          >
            📁 Upload Image
          </button>
          {onSkip && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', padding: '8px 0' }}
              onClick={onSkip}
            >
              Skip this question
            </button>
          )}
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    )
  }

  if (phase === 'preview') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--text-primary)' }}>
          Does this look clear?
        </h3>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 24, border: '2px solid var(--border-color)' }}>
          <img
            src={previewUrl}
            alt="Your written answer"
            style={{ width: '100%', maxHeight: 420, objectFit: 'contain', display: 'block', background: '#f9f9f9' }}
          />
        </div>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16, color: '#EF4444', fontSize: 14 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="ui-button-secondary" style={{ flex: 1 }} onClick={retake}>
            Retake
          </button>
          <button className="ui-button-primary" style={{ flex: 2 }} onClick={submit}>
            Submit Answer
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <BloomCharacter emotion="thinking" size="large" />
        <p style={{ marginTop: 24, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
          Reading your answer...
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Bloom is looking at your work
        </p>
      </div>
    )
  }

  // phase === 'feedback'
  const emotion = result.score >= 80 ? 'celebrating' : result.score >= 50 ? 'happy' : 'encouraging'
  const stars = Math.round((result.score / 100) * 5)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <BloomCharacter emotion={emotion} size="medium" />
        <div style={{ marginTop: 16, fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <div className="clash-display" style={{ fontSize: 56, background: 'linear-gradient(135deg, #FF5C28, #7B3FE4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '8px 0' }}>
          {result.score}%
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
          {result.feedback}
        </p>
      </div>

      <div className="ui-card" style={{ padding: 20, marginBottom: 16, background: 'rgba(0,0,0,0.02)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          What Bloom read
        </div>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{result.ocrText}"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {result.strengths?.length > 0 && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid var(--accent-green)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: 10, fontSize: 13 }}>
              ✅ What you nailed
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6 }}>
              {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        {result.improvements?.length > 0 && (
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 'var(--radius-md)', padding: 16 }}>
            <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 10, fontSize: 13 }}>
              🌱 Keep growing
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6 }}>
              {result.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="ui-button-secondary" onClick={retake} style={{ flex: 1 }}>
          Try Again
        </button>
        {onComplete && (
          <button className="ui-button-primary" onClick={() => onComplete(result)} style={{ flex: 2 }}>
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}
