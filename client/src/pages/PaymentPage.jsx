import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { getPaymentStatus, createPaymentOrder, verifyPayment } from '../services'

export default function PaymentPage() {
  const { user }         = useAuth()
  const navigate         = useNavigate()
  const { showToast }    = useToast()

  const [loading, setLoading] = useState(true)
  const [pageState, setPageState] = useState('loading') // 'loading', 'reserved', 'approved', 'success'
  const [paymentData, setPaymentData] = useState(null)
  
  const loadStatus = async () => {
    try {
      const res = await getPaymentStatus().catch(() => ({ status: 'none' }))
      const { status, ...data } = res || { status: 'none' }
      
      if (status === 'none') return navigate('/reserve')
      if (status === 'paid') return navigate('/dashboard/parent')
      
      setPageState(status) // 'reserved' or 'approved'
      setPaymentData(data)
    } catch {
      showToast('Error loading payment status', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
    let interval
    if (pageState === 'reserved') {
      interval = setInterval(() => {
        loadStatus()
      }, 60000)
    }
    return () => clearInterval(interval)
  }, [pageState])

  const handlePay = async () => {
    if (!window.Razorpay) {
      showToast('Payment system not loaded. Refresh and try again.', 'error')
      return
    }
    try {
      setLoading(true)
      const order = await createPaymentOrder()
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'UpgrAIed',
        description: 'Lifetime Access Enrollment',
        order_id: order.orderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            setPageState('success')
          } catch (e) {
            showToast('Payment verification failed', 'error')
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#7B3FE4' }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function () {
        showToast('Payment failed', 'error')
      })
      rzp.open()
    } catch {
      showToast('Error initializing payment', 'error')
    } finally {
      setLoading(false)
    }
  }

  const simulatePayment = async () => {
    try {
      setLoading(true)
      await verifyPayment({
        razorpay_order_id: 'test_order',
        razorpay_payment_id: 'test_payment',
        razorpay_signature: 'test_signature'
      })
      setPageState('success')
    } catch {
      showToast('Simulation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (pageState === 'loading') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <LoadingSkeleton width="400px" height="300px" borderRadius="var(--radius-lg)" />
      </div>
    )
  }

  if (pageState === 'success') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
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
          <h2 className="clash-display" style={{ fontSize: 24, marginBottom: 12 }}>Welcome to UpgrAIed! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            Your payment was successful. Lifetime access has been unlocked for your child!
          </p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/dashboard/parent')}>Go to Dashboard</button>
        </div>
      </div>
    )
  }

  if (pageState === 'reserved') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
        <div style={{ maxWidth: 600, width: '100%' }}>
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 className="clash-display" style={{ fontSize: 24, marginBottom: 12, color: 'var(--accent-orange)' }}>Under Review</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>
              Your application for <strong>{paymentData?.childName || 'your child'}</strong> is currently pending admin approval.<br />
              This usually takes 2-4 hours. We will email you once it's approved.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Auto-refreshing status every minute...</span>
            </div>
            <button className="btn-ghost" style={{ marginTop: 24 }} onClick={() => navigate('/dashboard/parent')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  // Approved -> show payment form
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) minmax(350px, 460px)', gap: 32, alignItems: 'flex-start' }}>
        
        {/* Left: Summary */}
        <div>
          <h1 className="clash-display" style={{ fontSize: 28, marginBottom: 24 }}>Complete Enrollment</h1>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Programme Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Student</span>
                <span style={{ fontWeight: 600 }}>{paymentData?.childName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Grade</span>
                <span style={{ fontWeight: 600 }}>{paymentData?.grade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Programme</span>
                <span style={{ fontWeight: 600 }}>{paymentData?.programme} Level</span>
              </div>
            </div>
            
            <hr className="divider" style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>✅ Lifetime Access to all 11 Levels</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>✅ Project Reviews by Expert AI Creators</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>✅ Certificate upon completion</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>✅ Dedicated Parent Dashboard</div>
            </div>
          </div>
        </div>

        {/* Right: Payment details */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Payment Details</h3>
          
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Base Price</span>
              <span style={{ fontWeight: 600 }}>₹{paymentData?.pricing?.base?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
              <span style={{ fontWeight: 600 }}>₹{paymentData?.pricing?.gst?.toLocaleString('en-IN') || 0}</span>
            </div>
            <hr className="divider" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: 'var(--accent-purple-light)', fontWeight: 700 }}>
              <span>Total Amount</span>
              <span>₹{paymentData?.pricing?.total?.toLocaleString('en-IN') || 0}</span>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', height: 50, fontSize: 16, marginBottom: 16 }} 
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Pay with Razorpay'}
          </button>
          
          {import.meta.env.MODE === 'development' && (
            <button 
              className="btn-ghost" 
              style={{ width: '100%' }} 
              onClick={simulatePayment}
              disabled={loading}
            >
              🧪 Simulate Payment (Dev Only)
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
            Secured by Razorpay. All major cards, UPI, and Net Banking supported.
          </p>
        </div>

      </div>
    </div>
  )
}
