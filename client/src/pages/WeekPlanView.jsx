import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWeekPlan, approveWeekPlan } from '../services'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import BloomCharacter from '../components/Bloom/BloomCharacter'
import { useToast } from '../components/ui/Toast'

export default function WeekPlanView() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedDay, setExpandedDay] = useState(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getWeekPlan(planId)
        setPlan(data)
      } catch (e) {
        showToast('Failed to load plan', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [planId, showToast])

  const handleApprove = async () => {
    try {
      await approveWeekPlan(planId)
      showToast('Plan approved!', 'success')
      setPlan({ ...plan, status: 'active', parentApproved: true })
    } catch (e) {
      showToast('Failed to approve plan', 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
        <LoadingSkeleton rows={8} />
      </div>
    )
  }

  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h2>Plan not found</h2>
        <button className="btn-primary" onClick={() => navigate('/dashboard/parent')}>Go Back</button>
      </div>
    )
  }

  const icons = { lesson: '🎬', audio: '🎧', revision: '🔄', exam: '📝' }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto', paddingBottom: 100 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <button className="btn-ghost" onClick={() => navigate(-1)} style={{ padding: 0, marginBottom: 16 }}>← Back</button>
          <h1 className="clash-display" style={{ fontSize: 32 }}>Week Plan Overview</h1>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            {plan.chapterId?.title} · {plan.chapterId?.subject}
          </div>
        </div>
        <div>
          {plan.status === 'draft' ? (
            <span style={{ padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', fontSize: 12, fontWeight: 600 }}>Draft</span>
          ) : (
            <span style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', borderRadius: 'var(--radius-xl)', fontSize: 12, fontWeight: 600 }}>Active</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {plan.days.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;
          return (
            <div key={day.dayNumber} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div 
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, cursor: 'pointer', background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
              >
                <div style={{ fontSize: 32 }}>{icons[day.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: day.type === 'exam' ? 'var(--accent-orange)' : 'var(--text-primary)' }}>{day.dayName}</span>
                    <span style={{ fontSize: 11, background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{day.type}</span>
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text-primary)' }}>{day.title}</div>
                  {day.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{day.description}</div>}
                </div>
                <div style={{ fontSize: 24, color: 'var(--text-muted)' }}>
                  {isExpanded ? '−' : '+'}
                </div>
              </div>
              
              {isExpanded && (
                <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
                  
                  {day.type === 'lesson' && (
                    <>
                      <div style={{ marginBottom: 24 }}>
                        <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Concepts Covered</h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {day.conceptsCovered?.map((c, i) => (
                            <span key={i} style={{ background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 4, fontSize: 12, border: '1px solid var(--border-color)' }}>{c}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Video Script Preview</h4>
                        <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius-md)' }}>
                          {day.videoScript}
                        </div>
                      </div>
                      {day.quizQuestions?.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>Checkpoint Quizzes ({day.quizQuestions.length})</h4>
                          {day.quizQuestions.map((q, i) => (
                            <div key={i} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>{q.question}</div>
                              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
                                {q.options.map((o, j) => (
                                  <li key={j} style={{ color: j === q.correctIndex ? 'var(--accent-green)' : 'inherit' }}>
                                    {o} {j === q.correctIndex && '✅'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {day.type === 'audio' && (
                    <div>
                      <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>Audio Script</h4>
                      <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap' }}>
                        {day.audioScript}
                      </div>
                    </div>
                  )}

                  {day.type === 'exam' && (
                    <div>
                      <h4 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>Exam Questions ({day.examQuestions?.length || 0})</h4>
                      {day.examQuestions?.map((q, i) => (
                        <div key={i} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>{q.question}</div>
                          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
                            {q.options.map((o, j) => (
                              <li key={j} style={{ color: j === q.correctIndex ? 'var(--accent-green)' : 'inherit' }}>
                                {o} {j === q.correctIndex && '✅'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          )
        })}
      </div>

      {!plan.parentApproved && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(15, 11, 28, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border-color)', padding: 24, zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <BloomCharacter emotion="happy" size="tiny" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Ready to start learning?</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Approve this plan so your child can access it.</div>
            </div>
          </div>
          <button className="btn-primary" onClick={handleApprove} style={{ background: '#4ADE80', color: '#000', padding: '16px 40px', fontSize: 16 }}>
            Approve Plan
          </button>
        </div>
      )}
    </div>
  )
}
