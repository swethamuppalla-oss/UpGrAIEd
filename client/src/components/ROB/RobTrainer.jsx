import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import {
  deleteROBKnowledge,
  getCreatorROBKnowledge,
  getCreatorVideos,
  publishROBModule,
  trainROBConcept,
} from '../../services/api'
import RobCharacter from './RobCharacter'

const trainerTabs = [
  { id: 'concept', label: '📝 Key Concepts' },
  { id: 'quiz', label: '❓ Quiz Questions' },
  { id: 'hint', label: '💡 Hints & Tips' },
]

function scorePreview(question, knowledge) {
  const words = question.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  let best = null
  let score = 0

  knowledge.forEach((item) => {
    const itemScore = words.reduce((total, word) => (
      item.content.toLowerCase().includes(word) ? total + 1 : total
    ), 0)
    if (itemScore > score) {
      score = itemScore
      best = item
    }
  })

  return {
    answer: best?.content || "Hmm, I don't know that yet! Maybe add more training first.",
    confidence: Math.min(score * 20, 100),
  }
}

export default function RobTrainer() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [modules, setModules] = useState([])
  const [knowledge, setKnowledge] = useState([])
  const [activeTab, setActiveTab] = useState('concept')
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [search, setSearch] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishModal, setPublishModal] = useState(false)
  const [testingQuestion, setTestingQuestion] = useState('')
  const [preview, setPreview] = useState(null)
  const [editingQuizId, setEditingQuizId] = useState(null)

  const [conceptContent, setConceptContent] = useState('')
  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
  })
  const [hintForm, setHintForm] = useState({
    triggerPhrase: '',
    hintResponse: '',
  })

  useEffect(() => {
    Promise.all([
      getCreatorVideos().catch(() => []),
      getCreatorROBKnowledge().catch(() => []),
    ]).then(([videos, items]) => {
      setModules(videos)
      setKnowledge(items)
      if (videos[0]?._id) setSelectedModuleId(videos[0]._id)
    })
  }, [])

  const selectedModule = modules.find(module => module._id === selectedModuleId)
  const moduleKnowledge = knowledge.filter(item => item.moduleId === selectedModuleId)
  const filteredKnowledge = moduleKnowledge.filter(item => (
    !search
    || item.content.toLowerCase().includes(search.toLowerCase())
    || item.type.toLowerCase().includes(search.toLowerCase())
  ))
  const trainingProgress = Math.min(100, moduleKnowledge.length * 16)

  const addKnowledge = async (payload) => {
    const response = await trainROBConcept(payload)
    setKnowledge(prev => [response.knowledge, ...prev])
  }

  const submitConcept = async () => {
    if (!selectedModuleId || !conceptContent.trim()) return
    try {
      await addKnowledge({
        moduleId: selectedModuleId,
        type: 'concept',
        content: conceptContent.trim(),
      })
      setConceptContent('')
      showToast("I'm learning! Keep going! 🧠", 'success')
    } catch {
      showToast('ROB could not save that concept yet.', 'error')
    }
  }

  const submitQuiz = async () => {
    if (!selectedModuleId || !quizForm.question.trim()) return
    const options = quizForm.options.map((text, index) => ({
      text,
      isCorrect: index === quizForm.correct,
    }))

    try {
      if (editingQuizId) {
        await deleteROBKnowledge(editingQuizId).catch(() => {})
        setKnowledge(prev => prev.filter(item => item._id !== editingQuizId))
      }

      await addKnowledge({
        moduleId: selectedModuleId,
        type: 'quiz',
        content: quizForm.question.trim(),
        question: quizForm.question.trim(),
        options,
        explanation: quizForm.explanation.trim(),
      })

      setEditingQuizId(null)
      setQuizForm({
        question: '',
        options: ['', '', '', ''],
        correct: 0,
        explanation: '',
      })
      showToast("I'm learning! Keep going! 🧠", 'success')
    } catch {
      showToast('ROB could not save that quiz yet.', 'error')
    }
  }

  const submitHint = async () => {
    if (!selectedModuleId || !hintForm.triggerPhrase.trim() || !hintForm.hintResponse.trim()) return
    try {
      await addKnowledge({
        moduleId: selectedModuleId,
        type: 'hint',
        content: hintForm.hintResponse.trim(),
        triggerPhrase: hintForm.triggerPhrase.trim(),
        hintResponse: hintForm.hintResponse.trim(),
      })
      setHintForm({ triggerPhrase: '', hintResponse: '' })
      showToast("I'm learning! Keep going! 🧠", 'success')
    } catch {
      showToast('ROB could not save that hint yet.', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteROBKnowledge(id)
      setKnowledge(prev => prev.filter(item => item._id !== id))
      showToast('Knowledge removed from ROBs brain.', 'info')
    } catch {
      showToast('Could not delete that knowledge item.', 'error')
    }
  }

  const handleEditQuiz = (item) => {
    setActiveTab('quiz')
    setEditingQuizId(item._id)
    setQuizForm({
      question: item.question || '',
      options: item.options?.map(option => option.text) || ['', '', '', ''],
      correct: Math.max(0, item.options?.findIndex(option => option.isCorrect)),
      explanation: item.explanation || '',
    })
  }

  const handleTestKnowledge = () => {
    const response = scorePreview(testingQuestion, moduleKnowledge.filter(item => item.type === 'concept'))
    setPreview(response)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(moduleKnowledge, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rob-brain-${selectedModuleId || 'module'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePublish = async () => {
    if (!selectedModuleId) return
    setPublishing(true)
    try {
      await publishROBModule(selectedModuleId)
      setKnowledge(prev => prev.map(item => (
        item.moduleId === selectedModuleId
          ? { ...item, isPublished: true }
          : item
      )))
      setPublishModal(false)
      showToast("I'm live! Students can talk to me now! 🚀", 'success')
    } catch {
      showToast('Publish failed. ROB is still in training.', 'error')
    } finally {
      setPublishing(false)
    }
  }

  const summaryCards = useMemo(() => ([
    ['ROB knows', `${moduleKnowledge.length} things`],
    ['Published', `${moduleKnowledge.filter(item => item.isPublished).length} live`],
    ['Confidence', `${preview?.confidence || 0}%`],
  ]), [moduleKnowledge, preview])

  return (
    <>
      <style>{`
        @media (max-width: 960px) {
          .rob-trainer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="rob-trainer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
              Select Module To Train
            </div>
            <select className="input-field" value={selectedModuleId} onChange={(event) => setSelectedModuleId(event.target.value)}>
              {modules.map(module => (
                <option key={module._id} value={module._id}>
                  {module.title} ({module.moduleTitle})
                </option>
              ))}
            </select>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="clash-display" style={{ fontSize: 22 }}>
                Training ROB for: {selectedModule?.title || 'Select a module'}
              </div>
              {selectedModule && <span className="badge-purple">Level {selectedModule.level}</span>}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              {trainerTabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'concept' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <textarea
                  className="input-field"
                  rows={7}
                  maxLength={2000}
                  value={conceptContent}
                  onChange={(event) => setConceptContent(event.target.value)}
                  placeholder="Enter key concepts ROB should know..."
                />
                <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {conceptContent.length} / 2000
                </div>
                <button type="button" className="btn-primary" onClick={submitConcept}>
                  Add To ROBs Brain 🧠
                </button>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input-field"
                  value={quizForm.question}
                  onChange={(event) => setQuizForm(prev => ({ ...prev, question: event.target.value }))}
                  placeholder="Question"
                />
                {quizForm.options.map((option, index) => (
                  <div key={`option-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                    <input
                      className="input-field"
                      value={option}
                      onChange={(event) => setQuizForm(prev => {
                        const nextOptions = [...prev.options]
                        nextOptions[index] = event.target.value
                        return { ...prev, options: nextOptions }
                      })}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                      <input
                        type="radio"
                        checked={quizForm.correct === index}
                        onChange={() => setQuizForm(prev => ({ ...prev, correct: index }))}
                      />
                      Correct
                    </label>
                  </div>
                ))}
                <textarea
                  className="input-field"
                  rows={4}
                  value={quizForm.explanation}
                  onChange={(event) => setQuizForm(prev => ({ ...prev, explanation: event.target.value }))}
                  placeholder="Explanation shown after answer"
                />
                <button type="button" className="btn-primary" onClick={submitQuiz}>
                  {editingQuizId ? 'Save Question' : 'Add Question +'}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  {moduleKnowledge.filter(item => item.type === 'quiz').map(item => (
                    <div key={item._id} style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.question}</div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="btn-ghost" onClick={() => handleEditQuiz(item)}>
                          Edit ✏️
                        </button>
                        <button type="button" className="btn-danger" onClick={() => handleDelete(item._id)}>
                          Delete 🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hint' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input-field"
                  value={hintForm.triggerPhrase}
                  onChange={(event) => setHintForm(prev => ({ ...prev, triggerPhrase: event.target.value }))}
                  placeholder="Trigger phrase input"
                />
                <textarea
                  className="input-field"
                  rows={5}
                  value={hintForm.hintResponse}
                  onChange={(event) => setHintForm(prev => ({ ...prev, hintResponse: event.target.value }))}
                  placeholder="Hint response"
                />
                <button type="button" className="btn-primary" onClick={submitHint}>
                  Add Hint +
                </button>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div className="clash-display" style={{ fontSize: 22, marginBottom: 10 }}>
              Test what ROB knows
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input-field"
                value={testingQuestion}
                onChange={(event) => setTestingQuestion(event.target.value)}
                placeholder="Ask ROB a question about this module..."
              />
              <button type="button" className="btn-primary" onClick={handleTestKnowledge}>
                Test
              </button>
            </div>
            {preview && (
              <div style={{ marginTop: 14, padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ marginBottom: 8, color: 'var(--text-primary)' }}>{preview.answer}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  ROB is {preview.confidence}% confident
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RobCharacter
                size="medium"
                emotion="learning"
                speech="I'm learning! Keep going! 🧠"
                chestProgress={trainingProgress}
              />
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>ROBs training for {selectedModule?.title || 'module'}</span>
                <span>{trainingProgress}%</span>
              </div>
              <div className="progress-bar-track" style={{ height: 10 }}>
                <div className="progress-bar-fill" style={{ width: `${trainingProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="clash-display" style={{ fontSize: 22 }}>Knowledge Base</div>
              <button type="button" className="btn-ghost" onClick={handleExport}>
                Export ROBs Brain 📤
              </button>
            </div>
            <input
              className="input-field"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search knowledge"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {summaryCards.map(([label, value]) => (
                <div key={label} style={{ padding: 12, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="clash-display" style={{ fontSize: 18 }}>{value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 330, overflowY: 'auto' }}>
              {filteredKnowledge.map(item => (
                <div key={item._id} style={{ padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ marginBottom: 6 }}>
                        {item.type === 'concept' ? '📝' : item.type === 'quiz' ? '❓' : '💡'} {item.content.slice(0, 80)}
                      </div>
                      <span className="badge-purple">{selectedModule?.moduleTitle || 'Module'}</span>
                      {item.isPublished && <span className="badge-green" style={{ marginLeft: 8 }}>Published</span>}
                    </div>
                    <button type="button" className="btn-danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredKnowledge.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-text">ROB knows 0 things for this module right now.</div>
                </div>
              )}
            </div>
          </div>

          <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={() => setPublishModal(true)}>
            Publish ROBs Training
          </button>
        </div>
      </div>

      {publishModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-card" style={{ width: 'min(100%, 420px)', padding: 24, background: '#120d22' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <RobCharacter size="small" emotion="excited" />
            </div>
            <div className="clash-display" style={{ fontSize: 24, textAlign: 'center', marginBottom: 8 }}>
              ROB is ready to help students!
            </div>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 18 }}>
              Publish ROBs training for {selectedModule?.title || 'this module'} so enrolled students can chat and quiz with him.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn-ghost" onClick={() => setPublishModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handlePublish} style={{ flex: 1 }} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, textAlign: 'center', color: 'var(--text-secondary)' }}>
              Creator: {user?.name || 'Creator'}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
