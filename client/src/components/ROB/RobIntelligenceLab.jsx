import { useEffect, useState } from 'react'
import { getRobIntelligence, trainROBConcept } from '../../services'
import LoadingSkeleton from '../ui/LoadingSkeleton'
import RobCharacter from './RobCharacter'

export default function RobIntelligenceLab() {
  const [activeTab, setActiveTab] = useState('interactions')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  // Recap Form State
  const [recapForm, setRecapForm] = useState({ question: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }], explanation: '' })
  const [savingRecap, setSavingRecap] = useState(false)

  // Simulation State
  const [simText, setSimText] = useState('')
  const [simResponse, setSimResponse] = useState(null)

  useEffect(() => {
    getRobIntelligence()
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to load intelligence data')
        setLoading(false)
      })
  }, [])

  const handleAddOption = () => {
    if (recapForm.options.length >= 4) return
    setRecapForm(prev => ({ ...prev, options: [...prev.options, { text: '', isCorrect: false }] }))
  }

  const handleOptionChange = (idx, text) => {
    const newOptions = [...recapForm.options]
    newOptions[idx].text = text
    setRecapForm(prev => ({ ...prev, options: newOptions }))
  }

  const setCorrectOption = (idx) => {
    const newOptions = recapForm.options.map((opt, i) => ({ ...opt, isCorrect: i === idx }))
    setRecapForm(prev => ({ ...prev, options: newOptions }))
  }

  const handleSaveRecap = async () => {
    if (!recapForm.question || recapForm.options.some(o => !o.text)) {
      alert("Please fill out all fields.")
      return
    }
    setSavingRecap(true)
    try {
      await trainROBConcept({
        moduleId: 'recap', // Or allow selection
        type: 'quiz',
        description: recapForm.question,
        content: JSON.stringify(recapForm.options),
        hint: recapForm.explanation
      })
      setRecapForm({ question: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }], explanation: '' })
      alert("Recap question saved successfully!")
    } catch (e) {
      alert("Failed to save recap.")
    }
    setSavingRecap(false)
  }

  const handleSimulate = () => {
    setSimResponse("Based on my current training data, I think this relates to Generative AI! Let me explain...")
  }

  if (loading) return <LoadingSkeleton rows={6} />
  if (error) return <div className="card" style={{ color: '#ef4444' }}>{error}</div>
  if (!data) return null

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 24, marginBottom: 32, alignItems: 'center' }}>
        <div>
          <h2 className="clash-display" style={{ fontSize: 32, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>🧪</span> ROB Intelligence Lab
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitor how your students learn, track common mistakes, and shape ROB's behavior.
          </p>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#00D4FF', lineHeight: 1 }}>{data.students.active}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Active Students</div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
        {[
          { id: 'interactions', label: 'Interactions' },
          { id: 'mistakes', label: 'Common Mistakes' },
          { id: 'recap', label: 'Add Recap Questions' },
          { id: 'preview', label: 'Preview ROB' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: activeTab === tab.id ? '#00D4FF' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #00D4FF' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'interactions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Top Weak Topics (Network-Wide)</h3>
            {data.students.topWeakTopics.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Not enough data yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.students.topWeakTopics.map((topic, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                    <span>{topic.topic || 'Unknown Module'}</span>
                    <span style={{ fontWeight: 600, color: '#EF4444' }}>{topic.count} students struggling</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Recent Active Students</h3>
            {data.students.recent.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No active students.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.students.recent.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Level {s.level}</div>
                    </div>
                    <div style={{ color: '#00D4FF', fontWeight: 700 }}>{s.xp} XP</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
          <h3>Mistake Analytics (Coming Soon)</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
            We're gathering data on the most frequently picked wrong options in your modules to help you improve your curriculum.
          </p>
        </div>
      )}

      {activeTab === 'recap' && (
        <div className="card" style={{ maxWidth: 800 }}>
          <h3 style={{ marginBottom: 20 }}>Create Quick Recap Question</h3>
          
          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Question Text</label>
            <input 
              className="input-field" 
              value={recapForm.question} 
              onChange={e => setRecapForm({...recapForm, question: e.target.value})} 
              placeholder="e.g. Which of these is an example of an LLM?"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Options</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recapForm.options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button 
                    onClick={() => setCorrectOption(idx)}
                    style={{ 
                      width: 24, height: 24, borderRadius: '50%', 
                      background: opt.isCorrect ? '#22C55E' : 'rgba(255,255,255,0.1)', 
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    {opt.isCorrect && <span style={{ color: '1A1430', fontSize: 14 }}>✓</span>}
                  </button>
                  <input 
                    className="input-field" 
                    style={{ flex: 1, borderColor: opt.isCorrect ? '#22C55E' : undefined }}
                    value={opt.text} 
                    onChange={e => handleOptionChange(idx, e.target.value)} 
                    placeholder={`Option ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
            {recapForm.options.length < 4 && (
              <button className="btn-ghost" onClick={handleAddOption} style={{ marginTop: 12, fontSize: 13 }}>
                + Add Option
              </button>
            )}
          </div>

          <div style={{ marginBottom: 32 }}>
            <label className="input-label">Explanation (If they get it right/wrong)</label>
            <input 
              className="input-field" 
              value={recapForm.explanation} 
              onChange={e => setRecapForm({...recapForm, explanation: e.target.value})} 
              placeholder="e.g. ChatGPT is an LLM because it generates text based on large training datasets."
            />
          </div>

          <button className="btn-primary" onClick={handleSaveRecap} disabled={savingRecap}>
            {savingRecap ? 'Saving...' : 'Save Recap Question'}
          </button>
        </div>
      )}

      {activeTab === 'preview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 32 }}>
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Chat Simulator</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Type a question to see how ROB will respond to students based on the knowledge you've provided.
            </p>
            <textarea 
              className="input-field" 
              rows={4} 
              value={simText}
              onChange={e => setSimText(e.target.value)}
              placeholder="Ask ROB a question..."
              style={{ marginBottom: 16 }}
            />
            <button className="btn-primary" onClick={handleSimulate}>Test Response</button>

            {simResponse && (
              <div style={{ marginTop: 32, padding: 20, background: 'rgba(0,212,255,0.1)', borderRadius: 16, border: '1px solid rgba(0,212,255,0.2)' }}>
                <div style={{ fontWeight: 600, color: '#00D4FF', marginBottom: 8 }}>ROB says:</div>
                <div style={{ lineHeight: 1.5 }}>{simResponse}</div>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <RobCharacter size="hero" emotion={simResponse ? 'teaching' : 'idle'} />
          </div>
        </div>
      )}
    </div>
  )
}
