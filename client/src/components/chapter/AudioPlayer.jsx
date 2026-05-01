import { useState } from 'react'
import { completeDayLesson } from '../../services/api'
import BloomCharacter from '../Bloom/BloomCharacter'
import { useToast } from '../ui/Toast'

export default function AudioPlayer({ planId, dayNumber, dayData, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { showToast } = useToast()
  
  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(dayData.audioScript || 'No audio script found1')
      window.speechSynthesis.speak(msg)
    } else {
      window.speechSynthesis.cancel()
    }
  }

  const handleComplete = async () => {
    try {
      await completeDayLesson(planId, dayNumber, { timeSpentMinutes: 15 })
      showToast('Audio lesson completed!', 'success')
      if (onComplete) onComplete()
    } catch (err) {
      showToast('Failed to save progress', 'error')
    }
  }

  return (
    <div className="lesson-container" style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <BloomCharacter emotion={isPlaying ? "excited" : "happy"} size="medium" />
        <h2 className="clash-display" style={{ fontSize: 24, marginTop: 16 }}>{dayData.title || 'Listen and Learn'}</h2>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
        <button className="ui-button-primary" onClick={handlePlay} style={{ width: 140 }}>
          {isPlaying ? '⏸ Stop' : '🔊 Listen'}
        </button>
        <button className="ui-button-secondary" onClick={handleComplete}>
          Mark Complete ✅
        </button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.03)', padding: 32, borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Transcript</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(dayData.audioScript || '').split('\n').filter(Boolean).map((line, i) => {
            const isVoice1 = line.startsWith('Voice 1:');
            const isVoice2 = line.startsWith('Voice 2:');
            let color = 'var(--text-primary)';
            if (isVoice1) color = 'var(--accent-purple-light)';
            if (isVoice2) color = 'var(--accent-green)';
            
            return (
              <div key={i} style={{ fontSize: 16, lineHeight: 1.6, color }}>
                {line}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
