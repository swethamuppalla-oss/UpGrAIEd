import React from 'react'
import BloomCharacter from '../Bloom/BloomCharacter'
import { useNavigate } from 'react-router-dom'

export default function WeekPlanPreview({ aiResult, handleApprovePlan }) {
  const navigate = useNavigate()
  
  if (!aiResult) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 className="clash-display" style={{ fontSize: 32, marginBottom: 24 }}>Your Bloom Plan is Ready! 🎉</h1>
        <BloomCharacter emotion="celebrating" size="medium" />
      </div>

      <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <span style={{ background: 'rgba(123,63,228,0.15)', color: 'var(--accent-purple-light)', padding: '4px 12px', borderRadius: 'var(--radius-xl)', fontSize: 12, fontWeight: 700 }}>{aiResult.detectedSubject || 'Subject'}</span>
          <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', padding: '4px 12px', borderRadius: 'var(--radius-xl)', fontSize: 12, fontWeight: 700 }}>{aiResult.detectedGrade || 'Grade'}</span>
        </div>
        
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Key concepts:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {aiResult.keyConcepts?.map((concept, i) => (
            <span key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-primary)' }}>
              {concept}
            </span>
          ))}
          {(!aiResult.keyConcepts || aiResult.keyConcepts.length === 0) && (
             <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Standard Curriculum</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>7-Day Bloom Journey</div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, i) => {
            const expectedLevels = ['remember', 'understand', 'understand', 'apply', 'apply', 'analyze', 'create'];
            const bloomLevel = expectedLevels[i];
            const icons = { remember: '🧠', understand: '💡', apply: '🛠️', analyze: '🔍', create: '✨' };
            
            return (
              <div key={dayName} style={{ 
                minWidth: 110, 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                padding: 16, 
                borderRadius: 'var(--radius-md)', 
                textAlign: 'center' 
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 12 }}>{dayName}</div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icons[bloomLevel]}</div>
                <div style={{ fontSize: 11, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>
                  {bloomLevel}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <button className="btn-primary" onClick={handleApprovePlan} style={{ flex: 1, padding: '16px', fontSize: 16, background: '#4ADE80', color: '#000' }}>
          ✓ Approve & Start Learning
        </button>
        <button className="btn-ghost" onClick={() => navigate(`/dashboard/parent/weekplan/${aiResult.weekPlanId}`)} style={{ flex: 1, padding: '16px', fontSize: 16 }}>
          View Full Plan
        </button>
      </div>
    </div>
  )
}
