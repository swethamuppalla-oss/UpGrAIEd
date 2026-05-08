import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import {
  getAdminStats, getReservations, approveReservation,
  getAdminPayments, getAdminUsers, blockUser, unblockUser,
  createUser, getUsers
} from '../services'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('') || 'A'
}

function formatRevenue(val) {
  if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L'
  return '₹' + Number(val).toLocaleString('en-IN')
}

function normalizeUser(u) {
  return {
    ...u,
    email: u.email || u.phone || '',
    isBlocked: typeof u.isBlocked === 'boolean' ? u.isBlocked : u.isActive === false,
  }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [reservations, setReservations] = useState([])
  const [payments, setPayments] = useState([])
  const [users, setUsers] = useState([])
  
  // Users filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        if (activeTab === 'overview') {
          const data = await getAdminStats().catch(() => ({ totalEnrolled:0, pendingReservations:0, totalRevenue:0, activeToday:0 }))
          setStats(data)
        } else if (activeTab === 'reservations') {
          const data = await getReservations().catch(() => [])
          setReservations(Array.isArray(data) ? data : [])
        } else if (activeTab === 'payments') {
          const data = await getAdminPayments().catch(() => [])
          setPayments(Array.isArray(data) ? data : [])
        } else if (activeTab === 'users') {
          const data = await getAdminUsers().catch(() => [])
          setUsers(Array.isArray(data) ? data.map(normalizeUser) : [])
        }
      } catch (err) {
        showToast('Error loading ' + activeTab, 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab, showToast])

  const handleApprove = async (id) => {
    try {
      await approveReservation(id)
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'approved' } : r))
      showToast('Reservation approved!', 'success')
    } catch {
      showToast('Failed to approve reservation', 'error')
    }
  }

  const handleToggleBlock = async (uId, currentlyBlocked) => {
    try {
      if (currentlyBlocked) {
        await unblockUser(uId)
        showToast('User unblocked', 'success')
      } else {
        await blockUser(uId)
        showToast('User blocked', 'success')
      }
      setUsers(prev => prev.map(u => u._id === uId ? { ...u, isBlocked: !currentlyBlocked } : u))
    } catch {
      showToast('Failed to update user status', 'error')
    }
  }

  const reloadUsers = async () => {
    const data = await getUsers().catch(() => getAdminUsers().catch(() => []))
    setUsers(Array.isArray(data) ? data.map(normalizeUser) : [])
  }

  const handleCreateUser = async (form) => {
    try {
      await createUser(form)
      showToast('User created', 'success')
      await reloadUsers()
    } catch (err) {
      showToast(err.message || 'Failed to create user', 'error')
      throw err
    }
  }

  function renderStats() {
    if (loading) return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
       {[1,2,3,4].map(i=><LoadingSkeleton key={i} height="120px" borderRadius="12px" />)}
      </div>
    )
    const st = stats || { totalEnrolled:0, pendingReservations:0, totalRevenue:0, activeToday:0 }
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Enrolled</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-purple-light)' }}>{st.totalEnrolled}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pending Reservations</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-orange)' }}>{st.pendingReservations}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Revenue</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)' }}>{formatRevenue(st.totalRevenue)}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active Today</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>{st.activeToday}</div>
        </div>
      </div>
    )
  }

  function renderReservations() {
    if (loading) return <LoadingSkeleton height="300px" borderRadius="12px" />
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Parent</th><th>Child</th><th>Grade</th><th>Phone</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r._id}>
                <td>{r.parentName}</td>
                <td>{r.childName}</td>
                <td>{r.grade}</td>
                <td>{r.phone}</td>
                <td>
                  <span className={r.status === 'approved' || r.status === 'paid' ? 'badge-green' : 'badge-orange'}>{r.status}</span>
                </td>
                <td>
                  {r.status === 'pending' && (
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleApprove(r._id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:20 }}>No reservations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  function renderPayments() {
    if (loading) return <LoadingSkeleton height="300px" borderRadius="12px" />
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>User</th><th>Base</th><th>GST</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td style={{fontFamily:'monospace'}}>{p.orderId || '-'}</td>
                <td>{p.userEmail}</td>
                <td>₹{p.amount ? Math.round(p.amount/1.18) : 0}</td>
                <td>₹{p.amount ? Math.round(p.amount - p.amount/1.18) : 0}</td>
                <td>₹{p.amount || 0}</td>
                <td><span className={p.status === 'paid' ? 'badge-green' : 'badge-orange'}>{p.status}</span></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:20 }}>No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  function renderUsers() {
    if (loading) return <LoadingSkeleton height="300px" borderRadius="12px" />
    const filtered = users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      }
      return true
    })
    return (
      <div>
        <CreateUserForm onCreate={handleCreateUser} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input 
            type="text" className="input-field" placeholder="Search users by name or email..." 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <select className="input-field" style={{ maxWidth: 150 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td><span className={u.isBlocked ? 'badge-red' : 'badge-green'}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td>
                    {u.role !== 'admin' && (
                      <button 
                        className={u.isBlocked ? 'btn-primary' : 'btn-danger'} 
                        style={{ padding: '6px 12px', fontSize: 12 }} 
                        onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:20 }}>No users match your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      
      {activeTab === 'overview' && renderStats()}
      {activeTab === 'reservations' && renderReservations()}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'users' && renderUsers()}
    </>
  )
}

function CreateUserForm({ onCreate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'student',
    parentId: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onCreate(form)
      setForm({ name: '', email: '', role: 'student', parentId: '' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        marginBottom: 18,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        alignItems: 'end',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>Create User</h3>
        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          required
        />
      </div>

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        required
      />

      <select className="input-field" value={form.role} onChange={(e) => update('role', e.target.value)}>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
        <option value="admin">Admin</option>
      </select>

      {form.role === 'student' && (
        <input
          className="input-field"
          placeholder="Parent ID"
          value={form.parentId}
          onChange={(e) => update('parentId', e.target.value)}
          required
        />
      )}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
