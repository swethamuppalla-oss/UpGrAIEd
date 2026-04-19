import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { createReservation } from '../services/api'

export default function ReservePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    parentName: '', childName: '', grade: '',
    city: '', phone: '', email: '', source: 'friend'
  })
  
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!form.parentName || !form.childName) return showToast('Names are required', 'error')
    
    // Phone validation: strip +91 and spaces, check 10 digits
    const cleanedPhone = form.phone.replace(/^\+91/, '').replace(/\s+/g, '')
    if (!/^\d{10}$/.test(cleanedPhone)) {
      return showToast('Please enter a valid 10-digit phone number', 'error')
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return showToast('Please enter a valid email', 'error')
    if (!form.grade || !form.city) return showToast('Please select a grade and enter a city', 'error')

    setLoading(true)
    try {
      const formattedForm = { ...form, phone: cleanedPhone }
      const data = await createReservation(formattedForm)
      setSuccessData(data || { reservationId: 'RES-' + Date.now() })
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.includes('Duplicate') || err.response?.data?.message?.includes('already reserved')) {
         showToast('This phone number is already registered.', 'error')
      } else {
         showToast(err.response?.data?.message || 'Error creating reservation', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  if (successData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <style>{`
          .drawCheck { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s ease forwards; }
          @keyframes draw { to { stroke-dashoffset: 0; } }
        `}</style>
        <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 460, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <svg width="80" height="80" viewBox="0 0 52 52" style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', padding: 12 }}>
              <circle cx="26" cy="26" r="25" fill="none" />
              <path className="drawCheck" fill="none" stroke="var(--accent-green)" strokeWidth="4" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2 className="clash-display" style={{ fontSize: 24, marginBottom: 12 }}>Reservation Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            Thank you, {form.parentName}. Your spot for {form.childName} is reserved.<br/>
            We will contact you shortly to process your admission.
          </p>
          <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reservation ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: 'var(--accent-purple-light)', marginTop: 4 }}>
              {successData.reservationId || 'RES-12345'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/')}>Back to Home</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
        <h1 className="clash-display" style={{ fontSize: 28, marginBottom: 8, textAlign: 'center' }}>Reserve Your Spot</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32 }}>
          Enrollment is limited. Reserve today to secure your child's future in AI.
        </p>
        
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Parent Name *</label>
              <input className="input-field" placeholder="John Doe" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Child Name *</label>
              <input className="input-field" placeholder="Jane Doe" value={form.childName} onChange={e => setForm({...form, childName: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Grade *</label>
              <select className="input-field" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                <option value="">Select Grade</option>
                {[...Array(7)].map((_, i) => <option key={i} value={`Grade ${i+6}`}>Grade {i+6}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">City *</label>
              <input className="input-field" placeholder="e.g. Bangalore" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Phone Number *</label>
              <input type="tel" className="input-field" placeholder="10-digit number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Email ID *</label>
              <input type="email" className="input-field" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="form-label">How did you hear about us?</label>
            <select className="input-field" value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
              <option value="friend">From a Friend/Family</option>
              <option value="social">Social Media</option>
              <option value="search">Google Search</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 16, height: 48, fontSize: 16 }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  )
}
