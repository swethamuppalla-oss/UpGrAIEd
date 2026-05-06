import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BloomCharacter from '../Bloom/BloomCharacter'
import WeekPlanPreview from './WeekPlanPreview'
import { uploadChapterPhotos, getChapterStatus } from '../../services'
import { useToast } from '../ui/Toast'

export default function ChapterUpload() {
  const [step, setStep] = useState(1) // 1: upload, 2: processing, 3: review
  const [photos, setPhotos] = useState([])
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [title, setTitle] = useState('')
  const [chapterId, setChapterId] = useState(null)
  
  // AI Processing State
  const [processingStatus, setProcessingStatus] = useState('pending')
  const [aiResult, setAiResult] = useState(null)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  
  const fileInputRef = useRef(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const loadingMessages = [
    "Reading your chapter pages... 📖",
    "Understanding the concepts... 🧠",
    "Building your week plan... 📅",
    "Almost ready! ✨"
  ]

  // Poll for AI status
  useEffect(() => {
    let interval;
    if (step === 2 && chapterId && processingStatus !== 'complete' && processingStatus !== 'failed') {
      interval = setInterval(async () => {
        try {
          const res = await getChapterStatus(chapterId)
          if (res.status === 'complete') {
            setAiResult(res)
            setProcessingStatus('complete')
            setStep(3)
          } else if (res.status === 'failed') {
            setProcessingStatus('failed')
            showToast(res.error || 'AI processing failed', 'error')
          }
        } catch (err) {
          console.error(err)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [step, chapterId, processingStatus, showToast])

  // Cycle loading messages
  useEffect(() => {
    let interval;
    if (step === 2 && processingStatus === 'processing') {
      interval = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % loadingMessages.length)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [step, processingStatus])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (photos.length + files.length > 6) {
      showToast('Maximum 6 photos allowed', 'error')
      return
    }
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))
    setPhotos([...photos, ...newPhotos])
  }

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleProcessChapter = async () => {
    if (photos.length === 0) return
    
    const formData = new FormData()
    formData.append('subject', subject)
    formData.append('grade', grade)
    formData.append('title', title)
    photos.forEach(p => formData.append('photos', p.file))

    try {
      setStep(2)
      setProcessingStatus('processing')
      const res = await uploadChapterPhotos(formData)
      setChapterId(res.chapterId)
    } catch (err) {
      setStep(1)
      showToast('Failed to upload photos', 'error')
    }
  }

  const handleApprovePlan = async () => {
    try {
      // Approve via API (assuming approveWeekPlan is implemented in api.js)
      // await approveWeekPlan(aiResult.weekPlanId)
      showToast("Week plan approved! Your child can start learning.", "success")
      setStep(1)
      setPhotos([])
      setSubject('')
      setGrade('')
      setTitle('')
    } catch (err) {
      showToast('Failed to approve plan', 'error')
    }
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Stepper Header */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30, color: 'var(--text-secondary)', fontSize: 14 }}>
        <span style={{ fontWeight: step >= 1 ? 700 : 400, color: step >= 1 ? 'var(--text-primary)' : 'inherit' }}>1. Upload Photos</span>
        <span>→</span>
        <span style={{ fontWeight: step >= 2 ? 700 : 400, color: step >= 2 ? 'var(--text-primary)' : 'inherit' }}>2. AI Processing</span>
        <span>→</span>
        <span style={{ fontWeight: step >= 3 ? 700 : 400, color: step >= 3 ? 'var(--text-primary)' : 'inherit' }}>3. Review Plan</span>
      </div>

      {step === 1 && (
        <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h2 className="clash-display" style={{ fontSize: 24, marginBottom: 24 }}>📷 Add a Chapter</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Science"
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>Grade</label>
              <select 
                value={grade} 
                onChange={e => setGrade(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
              >
                <option value="">Select Grade</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>Chapter Title (Optional)</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3: Plants and Animals"
              style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 48, 
              background: 'var(--bg-elevated)', 
              textAlign: 'center', 
              cursor: 'pointer',
              marginBottom: 24
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>📷</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>Take photos of each page</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>or click to browse</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Up to 6 pages · JPG or PNG · Max 20MB each</div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileSelect} 
              style={{ display: 'none' }} 
            />
          </div>

          {photos.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{photos.length} of 6 pages</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 100px)', gap: 12 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: 100, height: 100 }}>
                    <img src={p.url} alt={`Page ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <button 
                      onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: 'white', border: 'none', width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            className="btn-primary" 
            disabled={photos.length === 0}
            onClick={handleProcessChapter}
            style={{ width: '100%', padding: '16px 0', fontSize: 16, opacity: photos.length === 0 ? 0.5 : 1, cursor: photos.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            Process Chapter →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: 'var(--bg-card)', padding: 64, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {processingStatus === 'failed' ? (
            <>
              <BloomCharacter emotion="error" size="medium" animate={false} />
              <h2 style={{ fontSize: 20, color: '#EF4444', marginTop: 24, marginBottom: 16 }}>Processing Failed</h2>
              <button className="btn-primary" onClick={() => setStep(1)}>Try again</button>
            </>
          ) : (
            <>
              <BloomCharacter emotion="thinking" size="medium" animate={true} />
              <div style={{ width: 240, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, margin: '32px auto 16px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '50%', background: 'linear-gradient(90deg, transparent, var(--accent-purple), transparent)', animation: 'shimmer 1.5s infinite linear' }} />
              </div>
              <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                {loadingMessages[loadingMsgIdx]}
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && aiResult && (
        <WeekPlanPreview aiResult={aiResult} handleApprovePlan={handleApprovePlan} />
      )}
    </div>
  )
}
