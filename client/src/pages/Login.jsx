import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sendOtp, verifyOtp } from '../services/api'

const ROLE_ROUTES = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  admin:   '/dashboard/admin',
  creator: '/dashboard/creator',
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [phone,       setPhone]       = useState('')
  const [otp,         setOtp]         = useState('')
  const [step,        setStep]        = useState('phone') // 'phone' | 'otp'
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [otpSentMsg,  setOtpSentMsg]  = useState('')

  // ── Send OTP ────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setOtpSentMsg('')

    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    setLoading(true)
    try {
      await sendOtp(digits)
      setStep('otp')
      setOtpSentMsg(`OTP sent to +91 ${digits.slice(0,5)}XXXXX`)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send OTP. Try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Verify OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    const digits = phone.replace(/\D/g, '')
    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }

    setLoading(true)
    try {
      const res = await verifyOtp(digits, otp.trim())
      const { token, user } = res.data
      login(token, user)
      navigate(ROLE_ROUTES[user.role] || '/login', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Back to phone step ──────────────────────────────────────────
  const handleBack = () => {
    setStep('phone')
    setOtp('')
    setError('')
    setOtpSentMsg('')
  }

  // ── OTP auto-advance: only allow digits, max 6 ──────────────────
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(val)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,63,228,0.08) 0%, transparent 70%)',
        top: -200,
        left: -200,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        bottom: -100,
        right: -100,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            <span style={{ color: 'var(--accent-purple-light)' }}>Upgr</span>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-purple-light), var(--accent-blue))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>AI</span>
            <span style={{ color: 'var(--text-primary)' }}>ed</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            AI-powered learning platform
          </p>
        </div>

        {/* Login box */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* Step header */}
          <div style={{ marginBottom: 24 }}>
            {step === 'otp' && (
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: '0 0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
            )}
            <h1 className="clash-display" style={{ fontSize: 22, marginBottom: 6 }}>
              {step === 'phone' ? 'Sign in to your account' : 'Enter verification code'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {step === 'phone'
                ? 'Enter your registered mobile number to continue'
                : otpSentMsg || 'Check your phone for the OTP'}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="inline-error" style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 15 }}>⚠</span>
              {error}
            </div>
          )}

          {/* ── Phone step ──────────────────────────────────────── */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="phone">
                  Mobile Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute',
                    left: 14,
                    color: 'var(--text-secondary)',
                    fontSize: 15,
                    fontWeight: 500,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}>
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    className="input-field"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                    maxLength={15}
                    disabled={loading}
                    autoFocus
                    style={{ paddingLeft: 52 }}
                  />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>
                  10-digit Indian mobile number
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px 20px', fontSize: 15 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Sending OTP…
                  </>
                ) : 'Send OTP'}
              </button>
            </form>
          )}

          {/* ── OTP step ────────────────────────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="otp">
                  6-Digit OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  className="otp-input"
                  placeholder="● ● ● ● ● ●"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px 20px', fontSize: 15, marginBottom: 12 }}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Verifying…
                  </>
                ) : 'Verify & Login'}
              </button>

              <button
                type="button"
                className="btn-ghost"
                style={{ width: '100%', fontSize: 13 }}
                onClick={handleSendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 12,
          marginTop: 20,
          lineHeight: 1.6,
        }}>
          By signing in you agree to our{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
