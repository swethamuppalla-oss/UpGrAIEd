import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getReservations,
  approveReservation,
  getAdminPayments,
  getAdminUsers,
  blockUser,
  unblockUser,
} from '../services/api';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK FALLBACK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalEnrolled:      84,
  pendingReservations: 7,
  totalRevenue:       520000,
  activeToday:        61,
  enrolledThisWeek:   12,
  revenueThisMonth:   48000,
};

const MOCK_RESERVATIONS = [
  { _id: '1', parentName: 'Meera Nair',   childName: 'Aryan Nair',   grade: 'Grade 9',  phone: '+91 98765 11111', createdAt: '2h ago',  status: 'reserved' },
  { _id: '2', parentName: 'Karan Mehta',  childName: 'Riya Mehta',   grade: 'Grade 7',  phone: '+91 98765 22222', createdAt: '5h ago',  status: 'reserved' },
  { _id: '3', parentName: 'Sita Reddy',   childName: 'Vikram Reddy', grade: 'Grade 11', phone: '+91 98765 33333', createdAt: '1d ago',  status: 'reserved' },
  { _id: '4', parentName: 'Amit Shah',    childName: 'Pooja Shah',   grade: 'Grade 6',  phone: '+91 98765 44444', createdAt: '2d ago',  status: 'approved' },
  { _id: '5', parentName: 'Neha Joshi',   childName: 'Rohan Joshi',  grade: 'Grade 8',  phone: '+91 98765 55555', createdAt: '3d ago',  status: 'paid'     },
];

const MOCK_PAYMENTS = [
  { _id: 't1', parentName: 'Priya Sharma', studentName: 'Arjun Kumar', grade: 'Grade 8',  amount: 6999, date: '2 Apr 2025' },
  { _id: 't2', parentName: 'Divya Pillai', studentName: 'Rahul Pillai', grade: 'Grade 10', amount: 4999, date: '1 Apr 2025' },
  { _id: 't3', parentName: 'Rohan Seth',   studentName: 'Anika Seth',   grade: 'Grade 6',  amount: 7999, date: '31 Mar 2025' },
];

const MOCK_USERS = [
  { _id: 'u1', name: 'Arjun Kumar',  email: 'arjun@example.com',  role: 'student', grade: 'Grade 8', isBlocked: false, createdAt: '1 Apr 2025' },
  { _id: 'u2', name: 'Priya Sharma', email: 'priya@example.com',  role: 'parent',  grade: '—',       isBlocked: false, createdAt: '1 Apr 2025' },
  { _id: 'u3', name: 'Rahul Mehta',  email: 'rahul@example.com',  role: 'creator', grade: '—',       isBlocked: false, createdAt: '15 Mar 2025' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      icon: '📊', label: 'Overview'     },
  { id: 'users',         icon: '👥', label: 'Users'        },
  { id: 'reservations',  icon: '📋', label: 'Reservations' },
  { id: 'revenue',       icon: '💰', label: 'Revenue'      },
  { id: 'content',       icon: '🎬', label: 'Content'      },
  { id: 'settings',      icon: '⚙️', label: 'Settings'     },
];

const RES_PAGE_SIZE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// SMALL UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const Skel = ({ w = 'w-full', h = 'h-5', r = 'rounded-lg' }) => (
  <div className={`${w} ${h} ${r} bg-white/10 animate-pulse`} />
);

const fmtRevenue = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const fmtCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const gst = (amount) => Math.round(amount * 0.18);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Stat Card ─────────────────────────────────────────────────────────────────
const BADGE_COLORS = {
  orange: { bg: 'rgba(255,92,40,0.15)',  text: '#FF5C28' },
  purple: { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4' },
  green:  { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964' },
  pink:   { bg: 'rgba(228,57,138,0.15)', text: '#E4398A' },
};

function StatCard({ badge, badgeColor, value, valueColor, label, delta, deltaColor = '#4CD964', loading }) {
  const bc = BADGE_COLORS[badgeColor] || BADGE_COLORS.purple;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
      {loading ? (
        <div className="flex flex-col gap-2">
          <Skel w="w-16" h="h-5" />
          <Skel w="w-24" h="h-9" />
          <Skel w="w-32" h="h-4" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider self-start rounded-full px-2.5 py-0.5"
            style={{ background: bc.bg, color: bc.text }}>{badge}</span>
          <p className="font-clash font-bold" style={{ fontSize: 34, lineHeight: 1, color: valueColor || 'var(--text)' }}>{value}</p>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</p>
          {delta && <p style={{ fontSize: 12, color: deltaColor }}>{delta}</p>}
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  reserved: { bg: 'rgba(255,149,0,0.15)',  text: '#FF9500', label: 'Reserved' },
  approved: { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4', label: 'Approved' },
  paid:     { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964', label: 'Paid'     },
  rejected: { bg: 'rgba(228,57,138,0.15)', text: '#E4398A', label: 'Rejected' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.reserved;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
      style={{ background: s.bg, color: s.text }}>{s.label}</span>
  );
}

// ── Role Badge ────────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  student: { bg: 'rgba(255,92,40,0.15)',  text: '#FF5C28' },
  parent:  { bg: 'rgba(123,63,228,0.15)', text: '#7B3FE4' },
  creator: { bg: 'rgba(228,57,138,0.15)', text: '#E4398A' },
  admin:   { bg: 'rgba(52,199,89,0.15)',  text: '#4CD964' },
};

function RoleBadge({ role }) {
  const s = ROLE_STYLES[role] || ROLE_STYLES.parent;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
      style={{ background: s.bg, color: s.text }}>{role}</span>
  );
}

// ── Table Shell ───────────────────────────────────────────────────────────────
function TableCard({ title, badge, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-3" style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="font-clash font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>{title}</p>
        {badge != null && (
          <span className="text-[11px] font-semibold rounded-full px-2 py-0.5"
            style={{ background: 'rgba(255,149,0,0.15)', color: '#FF9500' }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Table Header Row ──────────────────────────────────────────────────────────
function THead({ cols }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: cols.join(' '), padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {cols.map((_, i) => <span key={i} />)}
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background:   'rgba(255,255,255,0.05)',
        border:       '1px solid rgba(255,255,255,0.10)',
        borderRadius: 10,
        padding:      '8px 14px',
        fontSize:     13,
        color:        'var(--text)',
        width:        260,
        outline:      'none',
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── Overview: Stats Row ───────────────────────────────────────────────────────
function StatsRow({ stats, loading }) {
  const pending = stats?.pendingReservations ?? 0;
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 32 }}>
      <StatCard
        badge="Users" badgeColor="orange" loading={loading}
        value={stats?.totalEnrolled ?? 0}
        label="Total enrolled"
        delta={stats?.enrolledThisWeek ? `+${stats.enrolledThisWeek} this week` : null}
      />
      <StatCard
        badge="Pending" badgeColor="purple" loading={loading}
        value={pending}
        valueColor={pending > 0 ? '#FF5C28' : undefined}
        label="Awaiting approval"
        delta={pending > 0 ? 'Needs your action' : null}
        deltaColor="#FF5C28"
      />
      <StatCard
        badge="Revenue" badgeColor="green" loading={loading}
        value={fmtRevenue(stats?.totalRevenue ?? 0)}
        label="Total collected"
        delta={stats?.revenueThisMonth ? `+${fmtCurrency(stats.revenueThisMonth)} this month` : null}
      />
      <StatCard
        badge="Active" badgeColor="pink" loading={loading}
        value={stats?.activeToday ?? 0}
        label="Active today"
      />
    </div>
  );
}

// ── Reservations Section ──────────────────────────────────────────────────────
function ReservationsSection({ reservations, setReservations, loading }) {
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const [approvingId,  setApprovingId]  = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (reservations || []).filter(
      (r) => !q || r.parentName?.toLowerCase().includes(q) || r.phone?.includes(q)
    );
  }, [reservations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / RES_PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * RES_PAGE_SIZE, page * RES_PAGE_SIZE);

  const handleApprove = useCallback(async (id) => {
    setApprovingId(id);
    try {
      await approveReservation(id);
      toast.success('Reservation approved — payment unlocked');
      setReservations((prev) =>
        prev.map((r) => r._id === id ? { ...r, status: 'approved' } : r)
      );
    } catch {
      toast.error('Failed to approve reservation');
    } finally {
      setApprovingId(null);
    }
  }, [setReservations]);

  const pendingCount = (reservations || []).filter((r) => r.status === 'reserved').length;

  const COLS = '1fr 1fr 100px 150px 120px 110px 130px';
  const HEADERS = ['Parent', 'Child', 'Grade', 'Phone', 'Reserved', 'Status', 'Action'];

  return (
    <TableCard title="Pending Reservations" badge={pendingCount}>
      {/* Search */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by parent name or phone…" />
      </div>

      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: COLS, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {HEADERS.map((h) => <span key={h}>{h}</span>)}
      </div>

      {/* Rows */}
      {loading ? (
        [...Array(4)].map((_, i) => (
          <div key={i} className="grid items-center gap-3" style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Skel w="w-28" h="h-4" /><Skel w="w-24" h="h-4" /><Skel w="w-16" h="h-4" />
            <Skel w="w-28" h="h-4" /><Skel w="w-16" h="h-4" /><Skel w="w-16" h="h-5" r="rounded-full" />
            <Skel w="w-20" h="h-8" r="rounded-xl" />
          </div>
        ))
      ) : pageItems.length === 0 ? (
        <div className="flex items-center justify-center" style={{ padding: '48px 20px' }}>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>No reservations found ✓</p>
        </div>
      ) : (
        pageItems.map((row, idx) => (
          <div key={row._id} className="grid items-center gap-3"
            style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: idx < pageItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{row.parentName}</p>
            <p style={{ fontSize: 14, color: 'var(--text)' }}>{row.childName}</p>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{row.grade}</p>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{row.phone}</p>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>{row.createdAt}</p>
            <StatusBadge status={row.status} />
            <div>
              {row.status === 'reserved' && (
                <button
                  onClick={() => handleApprove(row._id)}
                  disabled={approvingId === row._id}
                  className="font-semibold text-white rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#7B3FE4,#E4398A)', padding: '7px 14px', fontSize: 12, cursor: approvingId === row._id ? 'not-allowed' : 'pointer' }}>
                  {approvingId === row._id ? 'Approving…' : 'Approve'}
                </button>
              )}
              {row.status === 'approved' && (
                <button disabled style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text2)', borderRadius: 12, padding: '7px 14px', fontSize: 12 }}>
                  Payment Pending
                </button>
              )}
              {row.status === 'paid' && (
                <button disabled style={{ background: 'rgba(52,199,89,0.12)', color: '#4CD964', borderRadius: 12, padding: '7px 14px', fontSize: 12 }}>
                  ✓ Enrolled
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>
            Page {page} of {totalPages} · {filtered.length} results
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.07)', color: 'var(--text2)', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.07)', color: 'var(--text2)', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        </div>
      )}
    </TableCard>
  );
}

// ── Payments Section ──────────────────────────────────────────────────────────
function PaymentsSection({ payments, loading }) {
  const totalBase  = (payments || []).reduce((s, p) => s + (p.amount || 0), 0);
  const totalGst   = gst(totalBase);
  const totalRec   = totalBase + totalGst;
  const razorpayFee = Math.round(totalRec * 0.02);

  const COLS = '1fr 1fr 100px 100px 100px 100px 120px 100px';
  const HEADERS = ['Parent', 'Student', 'Grade', 'Amount', 'GST', 'Total', 'Date', 'Invoice'];

  return (
    <TableCard title="Recent Payments">
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: COLS, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {HEADERS.map((h) => <span key={h}>{h}</span>)}
      </div>

      {/* Rows */}
      {loading ? (
        [...Array(3)].map((_, i) => (
          <div key={i} className="grid items-center gap-3" style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {Array(8).fill(null).map((__, j) => <Skel key={j} w="w-full" h="h-4" />)}
          </div>
        ))
      ) : !payments?.length ? (
        <div className="flex items-center justify-center" style={{ padding: '40px 20px' }}>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>No payments yet</p>
        </div>
      ) : (
        (payments || []).map((p, idx) => {
          const g = gst(p.amount);
          return (
            <div key={p._id} className="grid items-center gap-3"
              style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: idx < payments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{p.parentName}</p>
              <p style={{ fontSize: 14, color: 'var(--text)' }}>{p.studentName}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{p.grade}</p>
              <p style={{ fontSize: 13, color: 'var(--text)' }}>{fmtCurrency(p.amount)}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{fmtCurrency(g)}</p>
              <p style={{ fontSize: 13, color: '#4CD964', fontWeight: 600 }}>{fmtCurrency(p.amount + g)}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{p.date}</p>
              <a
                href={`/api/payments/invoice/${p._id}`}
                style={{ fontSize: 12, color: '#7B3FE4', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Download
              </a>
            </div>
          );
        })
      )}

      {/* Revenue Summary */}
      {!loading && payments?.length > 0 && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}>
          <div className="flex flex-wrap gap-x-8 gap-y-1" style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--text2)' }}>Base total: <b style={{ color: 'var(--text)' }}>{fmtCurrency(totalBase)}</b></span>
            <span style={{ color: 'var(--text2)' }}>GST (18%): <b style={{ color: 'var(--text)' }}>{fmtCurrency(totalGst)}</b></span>
            <span style={{ color: 'var(--text2)' }}>Total received: <b style={{ color: '#4CD964' }}>{fmtCurrency(totalRec)}</b></span>
            <span style={{ color: 'var(--text2)' }}>Razorpay fees (~2%): <b style={{ color: '#FF5C28' }}>−{fmtCurrency(razorpayFee)}</b></span>
            <span style={{ color: 'var(--text2)' }}>Net: <b style={{ color: '#7B3FE4', fontSize: 15 }}>{fmtCurrency(totalRec - razorpayFee)}</b></span>
          </div>
        </div>
      )}
    </TableCard>
  );
}

// ── Users Section ─────────────────────────────────────────────────────────────
function UsersSection({ users, setUsers, loading }) {
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [blockingId, setBlockingId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (users || []).filter((u) => {
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchQ    = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchRole && matchQ;
    });
  }, [users, search, roleFilter]);

  const handleBlock = useCallback(async (id, shouldBlock) => {
    setBlockingId(id);
    try {
      if (shouldBlock) {
        await blockUser(id);
        toast.success('User blocked');
      } else {
        await unblockUser(id);
        toast.success('User unblocked');
      }
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: shouldBlock } : u));
    } catch {
      toast.error(`Failed to ${shouldBlock ? 'block' : 'unblock'} user`);
    } finally {
      setBlockingId(null);
    }
  }, [setUsers]);

  const ROLE_TABS = ['all', 'student', 'parent', 'creator'];
  const COLS = '1fr 1fr 100px 110px 90px 130px 120px';
  const HEADERS = ['Name', 'Email', 'Role', 'Grade', 'Status', 'Joined', 'Actions'];

  return (
    <TableCard title="All Users">
      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap" style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" />
        <div className="flex gap-2">
          {ROLE_TABS.map((tab) => {
            const active = roleFilter === tab;
            return (
              <button key={tab} onClick={() => setRoleFilter(tab)}
                className="capitalize text-[12px] font-semibold rounded-full px-3 py-1 transition-all"
                style={{ background: active ? 'rgba(123,63,228,0.2)' : 'rgba(255,255,255,0.05)', color: active ? '#7B3FE4' : 'var(--text2)', border: `1px solid ${active ? 'rgba(123,63,228,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: COLS, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {HEADERS.map((h) => <span key={h}>{h}</span>)}
      </div>

      {/* Rows */}
      {loading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="grid items-center gap-3" style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2"><Skel w="w-8" h="h-8" r="rounded-lg" /><Skel w="w-28" h="h-4" /></div>
            <Skel w="w-36" h="h-4" /><Skel w="w-16" h="h-5" r="rounded-full" /><Skel w="w-16" h="h-4" />
            <Skel w="w-14" h="h-5" r="rounded-full" /><Skel w="w-20" h="h-4" /><Skel w="w-16" h="h-8" r="rounded-xl" />
          </div>
        ))
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center" style={{ padding: '48px 20px' }}>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>No users found</p>
        </div>
      ) : (
        filtered.map((u, idx) => {
          const initials = (u.name || 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <div key={u._id} className="grid items-center gap-3"
              style={{ gridTemplateColumns: COLS, padding: '14px 20px', borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              {/* Name + avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="grad-bg flex items-center justify-center shrink-0 font-clash font-bold text-white"
                  style={{ width: 32, height: 32, borderRadius: 9, fontSize: 12 }}>{initials}</div>
                <p className="truncate" style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{u.name}</p>
              </div>
              <p className="truncate" style={{ fontSize: 13, color: 'var(--text2)' }}>{u.email}</p>
              <RoleBadge role={u.role} />
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{u.grade || '—'}</p>
              {/* Status */}
              <span className="text-[11px] font-semibold rounded-full px-2 py-0.5"
                style={{
                  background: u.isBlocked ? 'rgba(228,57,138,0.12)' : 'rgba(52,199,89,0.12)',
                  color:      u.isBlocked ? '#E4398A' : '#4CD964',
                }}>
                {u.isBlocked ? 'Blocked' : 'Active'}
              </span>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{u.createdAt}</p>
              {/* Block / Unblock */}
              <button
                onClick={() => handleBlock(u._id, !u.isBlocked)}
                disabled={blockingId === u._id}
                className="text-[12px] font-semibold rounded-xl transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{
                  padding:    '6px 14px',
                  background: 'transparent',
                  border:     `1px solid ${u.isBlocked ? 'rgba(52,199,89,0.4)' : 'rgba(228,57,138,0.4)'}`,
                  color:      u.isBlocked ? '#4CD964' : '#E4398A',
                  cursor:     blockingId === u._id ? 'not-allowed' : 'pointer',
                }}>
                {blockingId === u._id ? '…' : u.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          );
        })
      )}
    </TableCard>
  );
}

// ── Placeholder Section ───────────────────────────────────────────────────────
function PlaceholderSection({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 320 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p className="font-clash font-semibold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 14, color: 'var(--text2)' }}>{desc}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SIDEBAR (custom — uses state for section switching, not routing)
// ─────────────────────────────────────────────────────────────────────────────
function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate    = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      const { logoutApi } = await import('../services/auth');
      await logoutApi();
    } catch { /* server may be unreachable */ }
    logout();
    navigate('/login', { replace: true });
  };

  const initials = (user?.name || 'AD')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 240, background: '#0F0B1C', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <span className="font-clash font-bold text-xl grad-text" style={{ letterSpacing: '-0.02em' }}>UpgrAIed</span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {TABS.map(({ id, icon, label }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ width: '100%', textAlign: 'left' }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1 text-sm font-medium transition-all duration-150 cursor-pointer ${active ? 'bg-white/10 text-[var(--text)]' : 'text-[var(--text2)] hover:bg-white/5 hover:text-[var(--text)]'}`}>
              <span style={{ width: 3, height: 18, borderRadius: 2, background: active ? 'linear-gradient(180deg,#FF5C28,#7B3FE4)' : 'transparent', flexShrink: 0, marginLeft: -4 }} />
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="grad-bg flex items-center justify-center shrink-0 font-clash font-bold text-white text-sm"
            style={{ width: 36, height: 36, borderRadius: 10 }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs" style={{ color: 'var(--text2)' }}>Platform Admin</p>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[var(--text2)] hover:bg-white/5 hover:text-[var(--text)] transition-all duration-150 cursor-pointer">
          <span style={{ fontSize: 16 }}>🚪</span>Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [stats,        setStats]        = useState(null);
  const [reservations, setReservations] = useState(null);
  const [payments,     setPayments]     = useState(null);
  const [users,        setUsers]        = useState(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRes,   setLoadingRes]   = useState(true);
  const [loadingPay,   setLoadingPay]   = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch all on mount
  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoadingStats(false));

    getReservations()
      .then(setReservations)
      .catch(() => setReservations(MOCK_RESERVATIONS))
      .finally(() => setLoadingRes(false));

    getAdminPayments()
      .then(setPayments)
      .catch(() => setPayments(MOCK_PAYMENTS))
      .finally(() => setLoadingPay(false));

    getAdminUsers()
      .then((data) => setUsers(data?.items || data))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoadingUsers(false));
  }, []);

  const showStats    = activeTab === 'overview' || activeTab === 'users' || activeTab === 'reservations' || activeTab === 'revenue';
  const showRes      = activeTab === 'overview' || activeTab === 'reservations';
  const showPayments = activeTab === 'overview' || activeTab === 'revenue';
  const showUsers    = activeTab === 'users';

  return (
    <div style={{ background: '#08060F', minHeight: '100vh' }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ marginLeft: 240, padding: '32px 40px 60px', minHeight: '100vh' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between" style={{ marginBottom: 36, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h1 className="font-clash font-bold" style={{ fontSize: 32, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>
              Platform Overview
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text2)' }}>
              UpgrAIed Admin · Live dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="font-semibold rounded-xl transition-all hover:bg-white/10"
              style={{ padding: '10px 20px', fontSize: 13, color: 'var(--text)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' }}>
              Export Report
            </button>
            <button
              className="font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
              style={{ padding: '10px 20px', fontSize: 13, background: 'linear-gradient(135deg,#FF5C28,#7B3FE4)' }}>
              + Add Content
            </button>
          </div>
        </div>

        {/* ── Stats row (always shown in data tabs) ───────────────────── */}
        {showStats && <StatsRow stats={stats} loading={loadingStats} />}

        {/* ── Reservations ─────────────────────────────────────────────── */}
        {showRes && (
          <div style={{ marginBottom: 32 }}>
            <ReservationsSection
              reservations={reservations}
              setReservations={setReservations}
              loading={loadingRes}
            />
          </div>
        )}

        {/* ── Payments ─────────────────────────────────────────────────── */}
        {showPayments && (
          <div style={{ marginBottom: 32 }}>
            <PaymentsSection payments={payments} loading={loadingPay} />
          </div>
        )}

        {/* ── Users ────────────────────────────────────────────────────── */}
        {showUsers && (
          <UsersSection users={users} setUsers={setUsers} loading={loadingUsers} />
        )}

        {/* ── Placeholders ─────────────────────────────────────────────── */}
        {activeTab === 'content' && (
          <PlaceholderSection icon="🎬" title="Content Management" desc="Video and curriculum management — coming soon." />
        )}
        {activeTab === 'settings' && (
          <PlaceholderSection icon="⚙️" title="Platform Settings" desc="Configuration and admin settings — coming soon." />
        )}

      </main>
    </div>
  );
}
