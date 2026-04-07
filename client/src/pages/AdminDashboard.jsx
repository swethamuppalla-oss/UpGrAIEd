import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  getAdminAnalytics,
  getAdminUsers,
  getAdminReservations,
  approveReservation,
} from '../services/api';

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV = [
  { icon: '📊', label: 'Dashboard',    to: '/dashboard/admin' },
  { icon: '👥', label: 'Users',        to: '/dashboard/admin' },
  { icon: '📋', label: 'Enrollments',  to: '/dashboard/admin' },
];

// ── Mock fallback ─────────────────────────────────────────────────────────────
const MOCK_ANALYTICS = {
  users:       { total: 124, byRole: { parent: 58, student: 52, creator: 8, admin: 6 } },
  enrollments: { byStatus: { RESERVED: 12, APPROVED: 5, ACTIVE: 48, REJECTED: 3 } },
  revenue:     { total: 485000, successfulTransactions: 48 },
};

const MOCK_USERS = {
  items: [
    { _id: '1', name: 'Priya Sharma',   role: 'parent',  isActive: true,  createdAt: '2026-03-10T10:00:00Z' },
    { _id: '2', name: 'Arjun Kumar',    role: 'student', isActive: true,  createdAt: '2026-03-10T10:02:00Z' },
    { _id: '3', name: 'Rahul Mehta',    role: 'creator', isActive: true,  createdAt: '2026-02-28T08:30:00Z' },
    { _id: '4', name: 'Anita Nair',     role: 'parent',  isActive: true,  createdAt: '2026-03-15T14:00:00Z' },
    { _id: '5', name: 'Karan Verma',    role: 'student', isActive: false, createdAt: '2026-03-01T09:00:00Z' },
  ],
  total: 124,
};

const MOCK_RESERVATIONS = {
  items: [
    {
      _id: 'r1', status: 'RESERVED', createdAt: '2026-04-06T10:00:00Z',
      student: { name: 'Aarav Shah',    grade: '8' },
      parent:  { name: 'Neha Shah',     phone: '+91 98765 43210' },
    },
    {
      _id: 'r2', status: 'RESERVED', createdAt: '2026-04-05T15:30:00Z',
      student: { name: 'Diya Patel',    grade: '7' },
      parent:  { name: 'Raj Patel',     phone: '+91 87654 32109' },
    },
    {
      _id: 'r3', status: 'RESERVED', createdAt: '2026-04-04T11:00:00Z',
      student: { name: 'Vihaan Gupta',  grade: '9' },
      parent:  { name: 'Sunita Gupta',  phone: '+91 76543 21098' },
    },
  ],
  total: 3,
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skel = ({ w = 'w-full', h = 'h-5', rounded = 'rounded-lg' }) => (
  <div className={`${w} ${h} ${rounded} bg-white/10 animate-pulse`} />
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const BADGE_COLORS = {
  orange: { bg: 'rgba(255,92,40,0.15)',  text: '#FF5C28' },
  purple: { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4' },
  green:  { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964' },
  pink:   { bg: 'rgba(228,57,138,0.15)', text: '#E4398A' },
};

const StatCard = ({ label, value, badge, badgeColor, sub, loading }) => {
  const bc = BADGE_COLORS[badgeColor] || BADGE_COLORS.purple;
  return (
    <div
      className="rounded-2xl flex flex-col gap-2"
      style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}
    >
      {loading ? (
        <><Skel w="w-16" h="h-5" /><Skel w="w-24" h="h-8" /><Skel w="w-20" h="h-4" /></>
      ) : (
        <>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider self-start rounded-full px-2.5 py-0.5"
            style={{ background: bc.bg, color: bc.text }}
          >
            {badge}
          </span>
          <p className="font-clash font-bold" style={{ fontSize: 32, lineHeight: 1, color: 'var(--text)' }}>
            {value}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</p>
          {sub && <p style={{ fontSize: 11, color: 'var(--text2)' }}>{sub}</p>}
        </>
      )}
    </div>
  );
};

// ── Role badge ────────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  parent:  { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4' },
  student: { bg: 'rgba(255,92,40,0.15)',  text: '#FF5C28' },
  creator: { bg: 'rgba(228,57,138,0.15)', text: '#E4398A' },
  admin:   { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964' },
};

const RoleBadge = ({ role }) => {
  const c = ROLE_COLORS[role] || ROLE_COLORS.admin;
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
      style={{ background: c.bg, color: c.text }}
    >
      {role}
    </span>
  );
};

// ── Enrollment status badge ───────────────────────────────────────────────────
const ENROLL_COLORS = {
  RESERVED: { bg: 'rgba(255,149,0,0.15)',  text: '#FF9500' },
  APPROVED: { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4' },
  ACTIVE:   { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964' },
  REJECTED: { bg: 'rgba(228,57,138,0.15)', text: '#E4398A' },
};

const EnrollBadge = ({ status }) => {
  const c = ENROLL_COLORS[status] || ENROLL_COLORS.RESERVED;
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
};

// ── Date formatter ────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();

  const [analytics,     setAnalytics]     = useState(null);
  const [users,         setUsers]         = useState(null);
  const [reservations,  setReservations]  = useState(null);
  const [loadingStats,  setLoadingStats]  = useState(true);
  const [loadingUsers,  setLoadingUsers]  = useState(true);
  const [loadingRes,    setLoadingRes]    = useState(true);
  const [roleFilter,    setRoleFilter]    = useState('all');
  const [approvingId,   setApprovingId]   = useState(null);

  useEffect(() => {
    getAdminAnalytics()
      .then((r) => setAnalytics(r.data))
      .catch(() => setAnalytics(MOCK_ANALYTICS))
      .finally(() => setLoadingStats(false));

    getAdminUsers({ limit: 10 })
      .then((r) => setUsers(r.data))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoadingUsers(false));

    getAdminReservations({ status: 'RESERVED', limit: 10 })
      .then((r) => setReservations(r.data))
      .catch(() => setReservations(MOCK_RESERVATIONS))
      .finally(() => setLoadingRes(false));
  }, []);

  const handleApprove = useCallback(async (enrollmentId) => {
    setApprovingId(enrollmentId);
    try {
      await approveReservation(enrollmentId);
      toast.success('Reservation approved!');
      // Remove from list optimistically
      setReservations((prev) => ({
        ...prev,
        items: prev.items.filter((r) => r._id !== enrollmentId),
        total: (prev.total || 1) - 1,
      }));
      // Update analytics pending count
      setAnalytics((prev) => prev ? {
        ...prev,
        enrollments: {
          byStatus: {
            ...prev.enrollments.byStatus,
            RESERVED: Math.max(0, (prev.enrollments.byStatus.RESERVED || 0) - 1),
            APPROVED: (prev.enrollments.byStatus.APPROVED || 0) + 1,
          },
        },
      } : prev);
    } catch {
      toast.error('Failed to approve. Try again.');
    } finally {
      setApprovingId(null);
    }
  }, []);

  // Derived analytics values
  const totalUsers     = analytics?.users?.total ?? 0;
  const activeStudents = analytics?.enrollments?.byStatus?.ACTIVE ?? 0;
  const pendingApprove = analytics?.enrollments?.byStatus?.RESERVED ?? 0;
  const revenue        = analytics?.revenue?.total ?? 0;

  // Filtered users
  const filteredUsers = (users?.items || []).filter(
    (u) => roleFilter === 'all' || u.role === roleFilter
  );

  const ROLE_TABS = ['all', 'parent', 'student', 'creator', 'admin'];

  return (
    <div style={{ background: '#08060F', minHeight: '100vh' }}>
      <Sidebar items={NAV} />

      <main style={{ marginLeft: 240, padding: '40px 40px 60px', minHeight: '100vh' }}>
        <Navbar title="Admin Panel" />

        {/* ── Section 1: Welcome ────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h1 className="font-clash font-bold" style={{ fontSize: 32, color: 'var(--text)', margin: 0 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p style={{ marginTop: 8, color: 'var(--text2)', fontSize: 15 }}>
            Platform overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ── Section 2: Platform Stats ─────────────────────────────────── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 40 }}>
          <StatCard
            badge="Users" badgeColor="orange" loading={loadingStats}
            value={totalUsers}
            label="Total registered users"
            sub={`Parents: ${analytics?.users?.byRole?.parent ?? 0} · Creators: ${analytics?.users?.byRole?.creator ?? 0}`}
          />
          <StatCard
            badge="Active" badgeColor="green" loading={loadingStats}
            value={activeStudents}
            label="Active students"
          />
          <StatCard
            badge="Pending" badgeColor="purple" loading={loadingStats}
            value={pendingApprove}
            label="Pending approvals"
          />
          <StatCard
            badge="Revenue" badgeColor="pink" loading={loadingStats}
            value={`₹${(revenue / 100).toLocaleString('en-IN')}`}
            label="Total revenue"
            sub={`${analytics?.revenue?.successfulTransactions ?? 0} transactions`}
          />
        </div>

        {/* ── Section 3: Pending Reservations ──────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 className="font-clash font-semibold" style={{ fontSize: 20, color: 'var(--text)' }}>
              Pending Reservations
              {!loadingRes && (
                <span
                  className="ml-2 text-[12px] font-semibold rounded-full px-2.5 py-0.5"
                  style={{ background: 'rgba(255,149,0,0.15)', color: '#FF9500' }}
                >
                  {reservations?.total ?? 0}
                </span>
              )}
            </h2>
          </div>

          <div
            style={{
              background:   'var(--surface)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow:     'hidden',
            }}
          >
            {/* Table header */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1fr 1fr 120px 130px 120px',
                padding:   '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize:  11,
                color:     'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>Student</span>
              <span>Parent</span>
              <span>Grade</span>
              <span>Reserved</span>
              <span>Action</span>
            </div>

            {/* Rows */}
            {loadingRes ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr 120px 130px 120px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Skel w="w-32" h="h-4" />
                  <Skel w="w-28" h="h-4" />
                  <Skel w="w-12" h="h-4" />
                  <Skel w="w-20" h="h-4" />
                  <Skel w="w-20" h="h-8" rounded="rounded-xl" />
                </div>
              ))
            ) : reservations?.items?.length === 0 ? (
              <div className="flex items-center justify-center" style={{ padding: '40px 20px' }}>
                <p style={{ color: 'var(--text2)', fontSize: 14 }}>No pending reservations ✓</p>
              </div>
            ) : (
              (reservations?.items || []).map((row, idx) => (
                <div
                  key={row._id}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '1fr 1fr 120px 130px 120px',
                    padding:      '16px 20px',
                    borderBottom: idx < (reservations.items.length - 1) ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{row.student?.name || '—'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--text)' }}>{row.parent?.name || '—'}</p>
                    <p style={{ fontSize: 12, color: 'var(--text2)' }}>{row.parent?.phone || ''}</p>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text2)' }}>
                    {row.student?.grade ? `Grade ${row.student.grade}` : '—'}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text2)' }}>{fmtDate(row.createdAt)}</p>
                  <button
                    onClick={() => handleApprove(row._id)}
                    disabled={approvingId === row._id}
                    className="font-semibold text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg,#7B3FE4,#E4398A)',
                      padding:    '8px 16px',
                      fontSize:   13,
                      cursor:     approvingId === row._id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {approvingId === row._id ? 'Approving…' : 'Approve'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Section 4: Users Table ────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 className="font-clash font-semibold" style={{ fontSize: 20, color: 'var(--text)' }}>
              Recent Users
            </h2>

            {/* Role filter tabs */}
            <div className="flex gap-2">
              {ROLE_TABS.map((tab) => {
                const active = roleFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setRoleFilter(tab)}
                    className="capitalize text-[12px] font-semibold rounded-full px-3 py-1 transition-all"
                    style={{
                      background: active ? 'rgba(123,63,228,0.2)' : 'rgba(255,255,255,0.05)',
                      color:      active ? '#7B3FE4' : 'var(--text2)',
                      border:     `1px solid ${active ? 'rgba(123,63,228,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background:   'var(--surface)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow:     'hidden',
            }}
          >
            {/* Table header */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: '1fr 100px 80px 130px',
                padding:      '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize:     11,
                color:        'var(--text2)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>Name</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
            </div>

            {/* Rows */}
            {loadingUsers ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="grid items-center" style={{ gridTemplateColumns: '1fr 100px 80px 130px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Skel w="w-36" h="h-4" />
                  <Skel w="w-16" h="h-5" rounded="rounded-full" />
                  <Skel w="w-12" h="h-4" />
                  <Skel w="w-24" h="h-4" />
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center" style={{ padding: '40px 20px' }}>
                <p style={{ color: 'var(--text2)', fontSize: 14 }}>No users found</p>
              </div>
            ) : (
              filteredUsers.map((u, idx) => (
                <div
                  key={u._id}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '1fr 100px 80px 130px',
                    padding:      '14px 20px',
                    borderBottom: idx < filteredUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="grad-bg flex items-center justify-center shrink-0 font-clash font-bold text-white"
                      style={{ width: 32, height: 32, borderRadius: 9, fontSize: 13 }}
                    >
                      {(u.name || 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{u.name || '—'}</p>
                  </div>
                  <RoleBadge role={u.role} />
                  <span style={{ fontSize: 12, color: u.isActive ? '#4CD964' : '#E4398A' }}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text2)' }}>{fmtDate(u.createdAt)}</p>
                </div>
              ))
            )}
          </div>

          {users && users.total > (users.items?.length || 0) && (
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>
              Showing {users.items?.length ?? 0} of {users.total} users
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
