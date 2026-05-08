import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import BloomCharacter from '../components/Bloom/BloomCharacter'
import ChapterUpload from '../components/chapter/ChapterUpload'
import { getChildInfo, getChildActivity, getParentBilling, createPaymentOrder, verifyPayment } from '../services'
import { useConfig } from '../context/ConfigContext'

const NAV_ITEMS = [
  { id: 'overview',  icon: '🏠', label: 'Overview'        },
  { id: 'progress',  icon: '📊', label: "Child's Progress" },
  { id: 'chapters',  icon: '📷', label: 'Upload Chapter'   },
  { id: 'billing',   icon: '💳', label: 'Billing'          },
  { id: 'support',   icon: '📞', label: 'Support'          },
]

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'P'
}

function formatAmount(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

function StatCard({ label, value, sub, color, icon }) {
  const colorMap = {
    purple: { bg: 'rgba(123,63,228,0.12)', border: 'rgba(123,63,228,0.3)',  text: 'var(--accent-purple-light)' },
    orange: { bg: 'rgba(255,122,47,0.12)', border: 'rgba(255,122,47,0.3)', text: 'var(--accent-orange)'        },
    green:  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: 'var(--accent-green)'         },
    pink:   { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', text: 'var(--accent-pink)'          },
  }
  const c = colorMap[color] || colorMap.purple
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-md)', padding: '20px 24px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: c.text, lineHeight: 1 }}>{value}</span>
        {sub  && <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{sub}</span>}
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      </div>
    </div>
  )
}

function ActivityBadge({ status }) {
  if (status === 'completed')
    return <span className="badge-green">Completed</span>
  return <span className="badge-orange">In Progress</span>
}

function ActivityTable({ activity }) {
  const config = useConfig()
  const rows = (activity || []).slice(0, 10)
  return (
    <div className="table-wrapper">
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>{config?.ui?.text?.parent_activity_title || 'Recent Activity'}</h2>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
            {['Module', 'Level', 'Status', 'Date'].map(h => (
              <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: 14 }}>No activity yet</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-primary)' }}>{row.module}</td>
              <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{row.level}</td>
              <td style={{ padding: '14px 20px' }}><ActivityBadge status={row.status} /></td>
              <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OverviewTab({ child, activity, loading }) {
  const config = useConfig()
  
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <LoadingSkeleton height="120px" borderRadius="12px" />
      <LoadingSkeleton height="120px" borderRadius="12px" />
      <LoadingSkeleton height="200px" borderRadius="12px" />
    </div>
  )

  if (!child) return (
    <div className="empty-state">
      <div className="empty-state-icon">🚸</div>
      <div className="empty-state-text">No child account linked yet. Contact support to link your child's account.</div>
    </div>
  )
  
  const progress = child.progress ?? 0
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ROB Parent Update Card */}
      <div className="ui-card dark-surface" style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(123,63,228,0.08) 100%)',
        border: '1px solid rgba(0,212,255,0.2)',
        padding: '30px 40px',
        display: 'flex', gap: 32, alignItems: 'center'
      }}>
        <div style={{ padding: 10, background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}>
          <BloomCharacter size="medium" emotion="happy" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🌿</span>
            <span style={{ fontWeight: 700, color: '#00D4FF', textTransform: 'uppercase', letterSpacing: 1, fontSize: 13 }}>
              {config?.ui?.text?.parent_weekly_update || 'Bloom Weekly Update'}
            </span>
          </div>
          <p style={{ color: 'var(--text-inverse)', fontSize: 18, lineHeight: 1.5, marginBottom: 24, maxWidth: 600 }}>
            <strong style={{ color: 'white' }}>{child.name}</strong> learned 4 days this week and improved consistency! They earned 150 XP and unlocked the "Prompt Explorer" badge.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary" style={{ background: '#7B3FE4' }}>👋 Encourage Child</button>
            <button className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>View Full Progress</button>
            <button className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Book Mentor Session</button>
          </div>
        </div>
      </div>

      {/* Child Card */}
      <div className="ui-card" style={{
        padding: '24px 28px',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 20 }}>
          {getInitials(child.name)}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="clash-display" style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
            {child.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
            {child.grade}&nbsp;·&nbsp;{child.programme}&nbsp;·&nbsp;Level {child.currentLevel} of 11
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="progress-bar-track" style={{ flex: 1, height: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{progress}% overall</span>
          </div>
        </div>
        <span className="badge-green">Active</span>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Level"   value={child.currentLevel || 1}     sub="/ 11"      color="purple" />
        <StatCard label="Modules" value={child.modulesCompleted || 0} sub="done"      color="orange" />
        <StatCard label="Streak"  value={child.streak || 0}           sub="days"      color="green"  icon="🔥" />
        <StatCard label="Time"    value={child.totalHours || 0}       sub="hrs"       color="pink"   icon="⏱" />
      </div>

      {/* Activity Table */}
      <ActivityTable activity={activity} />
    </div>
  )
}

function BillingTab({ billing, navigate, showToast, loading }) {
  if (loading) return <LoadingSkeleton height="200px" borderRadius="12px" />

  if (!billing || billing.status === 'reserved') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="clash-display" style={{ fontSize: 22 }}>Billing</h2>
        <div className="ui-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-orange)', marginBottom: 8 }}>Application under Review</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Your reservation is currently pending approval. We will notify you once it's approved.
          </div>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    try {
      showToast('Initializing payment...', 'info')
      const order = await createPaymentOrder({ amount: billing.amount || 50000 })
      
      if (!order || !order.id) {
        throw new Error('Failed to create order')
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey123',
        amount: order.amount,
        currency: order.currency,
        name: 'UpGrAIEd',
        description: 'Lifetime Access Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            showToast('Verifying payment...', 'info')
            const verification = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
            
            if (verification.success) {
              showToast('Payment successful! Lifetime access unlocked.', 'success')
              // Optionally refresh billing state or navigate
              navigate(0) // Refresh the page to get new state
            } else {
              showToast('Payment verification failed.', 'error')
            }
          } catch (err) {
            showToast('An error occurred during verification.', 'error')
          }
        },
        prefill: {
          name: 'Parent User',
          email: 'parent@upgraied.com',
          contact: '9999999999'
        },
        theme: {
          color: '#7B3FE4'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        showToast('Payment failed: ' + response.error.description, 'error')
      })
      rzp.open()
    } catch (error) {
      showToast('Error initializing payment. Please try again later.', 'error')
      console.error(error)
    }
  }

  if (billing.status === 'approved') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="clash-display" style={{ fontSize: 22 }}>Billing</h2>
        <div className="ui-card" style={{ padding: 40, textAlign: 'center', border: '1px solid var(--accent-blue)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 8 }}>Application Approved!</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Click below to complete your payment and unlock lifetime access to the programme.
          </div>
          <button className="btn-primary" onClick={handlePayment}>Pay Now →</button>
        </div>
      </div>
    )
  }

  // Paid state
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 className="clash-display" style={{ fontSize: 22 }}>Billing</h2>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', 
        border: '1px solid rgba(34,197,94,0.25)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '28px 32px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="badge-green" style={{ marginBottom: 14 }}>Lifetime Access Active</span>
            <div className="clash-display" style={{ fontSize: 36, color: 'var(--accent-green)', marginBottom: 4 }}>
              {formatAmount(billing.amount)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Paid on {billing.date}&nbsp;·&nbsp;{billing.grade}&nbsp;·&nbsp;{billing.programme} Programme
            </div>
          </div>
          <button className="btn-ghost" onClick={() => showToast('Downloading invoice...', 'info')} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span>📄</span> Download Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

function SupportTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 className="clash-display" style={{ fontSize: 22 }}>Support</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {[
          { icon: '💬', title: 'WhatsApp Support', desc: 'Chat with us on WhatsApp for instant help', action: 'Message Us'  },
          { icon: '📧', title: 'Email Support',    desc: 'Write to us at support@upgraied.com',     action: 'Send Email' },
          { icon: '📞', title: 'Call Us',          desc: 'Mon–Sat, 10am–7pm IST',                   action: 'View Number' },
        ].map(s => (
          <div key={s.title} className="ui-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{s.desc}</div>
            <button className="btn-ghost" style={{ fontSize: 13 }}>{s.action}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  const navigate         = useNavigate()
  const config           = useConfig()

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading]     = useState(true)
  const [child, setChild]         = useState(null)
  const [activity, setActivity]   = useState([])
  const [billing, setBilling]     = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [childRes, actRes, billRes] = await Promise.all([
          getChildInfo().catch(() => null),
          getChildActivity().catch(() => []),
          getParentBilling().catch(() => null),
        ])
        setChild(childRes || null)
        setActivity(Array.isArray(actRes) ? actRes : [])
        setBilling(billRes || null)
      } catch (e) {
        showToast('Error loading parent dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [showToast])

  const handleSignOut = () => {
    logout()
  }

  return (
    <div className="dark-surface" style={{ minHeight: '100vh' }}>
      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userName={user?.name || 'Parent'}
        userRole="Parent"
        userInitials={getInitials(user?.name)}
        onSignOut={handleSignOut}
      />

      <main className="main-content">
        <div className="page-header">
          <button
            type="button"
            className="ui-button secondary"
            onClick={() => navigate('/')}
            style={{ marginBottom: 12, fontSize: 12, padding: '6px 12px' }}
          >
            ← Home
          </button>
          <h1 className="page-title">{config?.ui?.text?.parent_dashboard_title || 'Parent Dashboard'}</h1>
          <p className="page-subtitle">
            {config?.ui?.text?.parent_dashboard_subtitle || 'Monitoring'} <strong style={{ color: 'var(--accent-purple-light)' }}>{child?.name || 'your child'}</strong>'s learning journey
          </p>
        </div>

        {activeTab === 'overview' && <OverviewTab child={child} activity={activity} loading={loading} />}
        {activeTab === 'progress' && <OverviewTab child={child} activity={activity} loading={loading} />}
        {activeTab === 'chapters' && <ChapterUpload />}
        {activeTab === 'billing'  && <BillingTab billing={billing} navigate={navigate} showToast={showToast} loading={loading} />}
        {activeTab === 'support'  && <SupportTab />}
      </main>
    </div>
  )
}
