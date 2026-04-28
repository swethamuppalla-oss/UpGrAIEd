import { useState, useEffect } from 'react'
import { getCurrentWeekPlan } from '../../services/api'
import LoadingSkeleton from '../ui/LoadingSkeleton'
import BloomCharacter from '../Bloom/BloomCharacter'
import LessonPlayer from './LessonPlayer'

export default function TodayLesson() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPlan = async () => {
    try {
      const data = await getCurrentWeekPlan()
      setPlan(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlan()
  }, [])

  if (loading) return <LoadingSkeleton rows={5} />

  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <BloomCharacter emotion="encouraging" size="medium" />
        <h2 style={{ fontSize: 24, marginTop: 24, color: 'var(--text-primary)' }}>No learning plan active!</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Ask your parent to upload a chapter to generate your journey.</p>
      </div>
    )
  }

  const activeDay = plan.days.find(d => !d.isComplete)

  if (!activeDay) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <BloomCharacter emotion="celebrating" size="medium" />
        <h2 style={{ fontSize: 24, marginTop: 24, color: 'var(--text-primary)' }}>You finished this week's plan! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Great job! Wait for the next chapter to be uploaded.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple-light)', textTransform: 'uppercase', letterSpacing: 1 }}>{plan.chapterId?.title || 'Chapter Lesson'}</span>
          <h1 style={{ fontSize: 28, margin: '8px 0', color: 'var(--text-primary)' }}>{activeDay.title}</h1>
        </div>
        
        {/* 7-Day Bloom Indicator */}
        <div style={{ display: 'flex', gap: 6 }}>
          {plan.days.map((d, i) => (
            <div key={i} title={`Day ${d.day}: ${d.bloomLevel}`} style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
              background: d.isComplete ? 'rgba(34,197,94,0.15)' : (d.day === activeDay.day ? 'var(--accent-purple)' : 'var(--bg-elevated)'),
              color: d.isComplete ? 'var(--accent-green)' : (d.day === activeDay.day ? '#FFF' : 'var(--text-muted)'),
              border: d.isComplete ? '1px solid var(--accent-green)' : '1px solid var(--border-color)'
            }}>
              {d.isComplete ? '✓' : d.day}
            </div>
          ))}
        </div>
      </div>

      <LessonPlayer planId={plan._id} dayNumber={activeDay.day} dayData={activeDay} onComplete={fetchPlan} />
    </div>
  )
}
