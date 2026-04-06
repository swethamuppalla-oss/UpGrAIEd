import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { getChildInfo, getChildActivity, getParentBilling } from '../services/api'

const NAV_ITEMS = [
  { id: 'overview',  icon: '🏠', label: 'Overview'        },
  { id: 'progress',  icon: '📊', label: "Child's Progress" },
  { id: 'billing',   icon: '💳', label: 'Billing'          },
  { id: 'support',   icon: '📞', label: 'Support'          },
]

const MOCK_CHILD = {
  name: 'Arjun Kumar', grade: 'Grade 8', programme: 'Junior',
  currentLevel: 3, progress: 27, streak: 5, modulesCompleted: 12, totalHours: 8,
}
const MOCK_ACTIVITY = [
  { module: 'Build a Chatbot UI',        level: 'Level 3', status: 'in-progress', date: 'Today'     },
  { module: 'Intro: What is an AI App?', level: 'Level 3', status: 'completed',   date: 'Yesterday' },
  { module: 'Advanced Prompting',        level: 'Level 2', status: 'completed',   date: '3 days ago'},
  { module: 'Prompt Engineering Basics', level: 'Level 2', status: 'completed',   date: '4 days ago'},
  { module: 'AI Tools Overview',         level: 'Level 1', status: 'completed',   date: '1 week ago'},
]
const MOCK_BILLING = {
  amount: 6999, date: '2 Apr 2025', status: 'paid', invoiceId: 'INV-001',
  grade: 'Grade 8', programme: 'Junior',
}

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
    return <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(34,197,94,0.3)', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>Completed</span>
  return <span style={{ background: 'rgba(255,122,47,0.15)', color: 'var(--accent-orange)', border: '1px solid rgba(255,122,47,0.3)', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>In Progress</span>
}

function ActivityTable({ activity }) {
  const rows = (activity || []).slice(0, 10)
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Module', 'Level', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{h}</th>
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
    </div>
  )
}

function OverviewTab({ child, activity }) {
  if (!child) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
      No child account linked yet. Contact support to link your child's account.
    </div>
  )
  const progress = child.progress ?? 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Child Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(123,63,228,0.08) 0%, rgba(59,130,246,0.06) 50%, rgba(236,72,153,0.06) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 20, flexShrink: 0 }}>
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
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', borderRadius: 99, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{progress}% overall</span>
          </div>
        </div>
        <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(34,197,94,0.3)', padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          Active
        </span>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Level"   value={child.currentLevel}     sub="/ 11"      color="purple" />
        <StatCard label="Modules" value={child.modulesCompleted ?? 0} sub="done" color="orange" />
        <StatCard label="Streak"  value={child.streak ?? 0}      sub="days" icon="🔥" color="green" />
        <StatCard label="Time"    value={child.totalHours ?? 0}  sub="hrs"       color="pink"   />
      </div>

      {/* Activity Table */}
      <ActivityTable activity={activity} />
    </div>
  )
}

function ProgressTab({ child, activity }) {
  const c = child || MOCK_CHILD
  const progress = c.progress ?? 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
        <h2 className="clash-display" style={{ fontSize: 20, marginBottom: 20 }}>{c.name}'s Progress</h2>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>Overall Progress</span><span>{progress}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', borderRadius: 99 }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 24 }}>
          {[
            { label: 'Current Level', val: `Level ${c.currentLevel}`, color: 'var(--accent-purple-light)' },
            { label: 'Modules Done',  val: c.modulesCompleted ?? 0,   color: 'var(--accent-orange)'       },
            { label: 'Day Streak',    val: `${c.streak ?? 0} 🔥`,     color: 'var(--accent-green)'        },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <ActivityTable activity={activity} />
    </div>
  )
}

function BillingTab({ billing, navigate, showToast }) {
  const handleInvoice = () => {
    if (billing?.invoiceId) {
      window.open(`/api/payments/invoice/${billing.invoiceId}`, '_blank')
    } else {
      showToast('Invoice not available', 'error')
    }
  }

  if (!billing || billing.status !== 'paid') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="clash-display" style={{ fontSize: 22 }}>Billing</h2>
        <div style={{ background: 'rgba(255,122,47,0.08)', border: '1px solid rgba(255,122,47,0.25)', borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)', marginBottom: 6 }}>Payment Pending</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Complete payment to activate your child's access to all 11 levels.
          </div>
          <button className="btn-primary" onClick={() => navigate('/payment')}>Complete Payment</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 className="clash-display" style={{ fontSize: 22 }}>Billing</h2>
      <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.04))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--radius-lg)', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 14 }}>
              Lifetime Access Active
            </span>
            <div className="clash-display" style={{ fontSize: 36, color: 'var(--accent-green)', marginBottom: 4 }}>
              {formatAmount(billing.amount)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Paid on {billing.date}&nbsp;·&nbsp;{billing.grade}&nbsp;·&nbsp;{billing.programme} Programme
            </div>
          </div>
          <button className="btn-ghost" onClick={handleInvoice} style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span>📄</span> Download Invoice
          </button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 20 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Invoice Reference</div>
        <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 15, color: 'var(--text-primary)' }}>{billing.invoiceId}</div>
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
          <div key={s.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 24 }}>
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

  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading]     = useState(true)
  const [child, setChild]         = useState(null)
  const [activity, setActivity]   = useState([])
  const [billing, setBilling]     = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [childRes, actRes, billRes] = await Promise.allSettled([
          getChildInfo(),
          getChildActivity(),
          getParentBilling(),
        ])
        setChild(childRes.status === 'fulfilled'   ? childRes.value.data   : MOCK_CHILD)
        setActivity(actRes.status === 'fulfilled'  ? actRes.value.data     : MOCK_ACTIVITY)
        setBilling(billRes.status === 'fulfilled'  ? billRes.value.data    : MOCK_BILLING)
      } catch {
        setChild(MOCK_CHILD)
        setActivity(MOCK_ACTIVITY)
        setBilling(MOCK_BILLING)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleSignOut = () => {
    showToast('Signed out', 'info')
    setTimeout(logout, 400)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
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
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          {loading ? (
            <>
              <LoadingSkeleton height={38} width="40%" borderRadius={10} />
              <div style={{ marginTop: 10 }}><LoadingSkeleton height={18} width="52%" borderRadius={6} /></div>
            </>
          ) : (
            <>
              <h1 className="clash-display" style={{ fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>
                Parent Dashboard
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                Monitoring <strong style={{ color: 'var(--accent-purple-light)' }}>{child?.name || 'your child'}</strong>'s learning journey
              </p>
            </>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ height: 110, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 96, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />)}
            </div>
            <div style={{ height: 240, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab child={child} activity={activity} />}
            {activeTab === 'progress' && <ProgressTab child={child} activity={activity} />}
            {activeTab === 'billing'  && <BillingTab billing={billing} navigate={navigate} showToast={showToast} />}
            {activeTab === 'support'  && <SupportTab />}
          </>
        )}
      </main>
    </div>
  )
}
