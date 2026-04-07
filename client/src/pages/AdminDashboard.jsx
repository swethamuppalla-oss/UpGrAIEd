import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import {
  approveReservation,
  blockUser,
  getAdminPayments,
  getAdminStats,
  getAdminUsers,
  getReservations,
  unblockUser,
} from '../services/api';

const SIDEBAR_ITEMS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'reservations', icon: '📋', label: 'Reservations' },
  { id: 'revenue', icon: '💰', label: 'Revenue' },
  { id: 'content', icon: '🎬', label: 'Content' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

const MOCK_STATS = {
  totalUsers: 84,
  pendingReservations: 7,
  totalRevenue: 520000,
  activeToday: 61,
};

const MOCK_RESERVATIONS = [
  { _id: 'r1', parentName: 'Priya Sharma', grade: 'Grade 8', phone: '+91 98765 43210', createdAt: '2025-04-02T10:00:00.000Z', status: 'reserved' },
  { _id: 'r2', parentName: 'Meera Nair', grade: 'Grade 9', phone: '+91 99887 11223', createdAt: '2025-04-01T10:00:00.000Z', status: 'approved' },
  { _id: 'r3', parentName: 'Rohan Seth', grade: 'Grade 6', phone: '+91 97654 32109', createdAt: '2025-03-31T10:00:00.000Z', status: 'payment-sent' },
];

const MOCK_PAYMENTS = [
  { _id: 'p1', studentName: 'Arjun Kumar', grade: 'Grade 8', amount: 6999, date: '2025-04-02T10:00:00.000Z', status: 'paid' },
  { _id: 'p2', studentName: 'Anika Seth', grade: 'Grade 6', amount: 7999, date: '2025-04-01T10:00:00.000Z', status: 'paid' },
];

const MOCK_USERS = [
  { _id: 'u1', name: 'Arjun Kumar', email: 'arjun@example.com', role: 'student', grade: 'Grade 8', isBlocked: false, createdAt: '2 Apr 2025' },
  { _id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', role: 'parent', grade: 'N/A', isBlocked: false, createdAt: '1 Apr 2025' },
];

const badgeStyles = {
  orange: { background: 'rgba(255, 92, 40, 0.16)', color: 'var(--orange)' },
  purple: { background: 'rgba(123, 63, 228, 0.16)', color: 'var(--purple)' },
  green: { background: 'rgba(76, 217, 100, 0.16)', color: 'var(--green)' },
  pink: { background: 'rgba(228, 57, 138, 0.16)', color: 'var(--pink)' },
  yellow: { background: 'rgba(255, 149, 0, 0.16)', color: 'var(--yellow)' },
  red: { background: 'rgba(255, 77, 79, 0.16)', color: 'var(--red)' },
};

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatLakhs = (value = 0) => `₹${(value / 100000).toFixed(1)}L`;

const formatDate = (value) => {
  if (!value) return 'Pending';
  if (typeof value === 'string' && !value.includes('T')) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const InlineError = ({ message }) => (
  <div
    className="rounded-2xl px-4 py-3"
    style={{
      background: 'rgba(255, 77, 79, 0.08)',
      border: '1px solid rgba(255, 77, 79, 0.24)',
      color: 'var(--text)',
    }}
  >
    {message}
  </div>
);

const Pill = ({ tone, children }) => (
  <span
    className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
    style={badgeStyles[tone] || badgeStyles.purple}
  >
    {children}
  </span>
);

const Card = ({ title, right, children }) => (
  <section
    className="rounded-[24px] p-6"
    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
  >
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="m-0 font-clash text-[22px] font-semibold text-[var(--text)]">{title}</h2>
      {right}
    </div>
    {children}
  </section>
);

const StatCard = ({ label, tone, value, helper, valueTone }) => (
  <div
    className="rounded-2xl p-5"
    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
  >
    <Pill tone={tone}>{label}</Pill>
    <p
      className="mt-4 mb-2 font-clash text-[30px] font-bold"
      style={{ color: valueTone || 'var(--text)', lineHeight: 1 }}
    >
      {value}
    </p>
    <p className="m-0 text-[13px]" style={{ color: 'var(--text2)' }}>
      {helper}
    </p>
  </div>
);

const statusTone = (status) => {
  if (status === 'approved') return 'green';
  if (status === 'payment-sent') return 'purple';
  if (status === 'paid') return 'green';
  if (status === 'blocked') return 'red';
  return 'yellow';
};

const statusLabel = (status) => {
  if (status === 'approved') return 'Approved';
  if (status === 'payment-sent') return 'Payment Sent';
  if (status === 'paid') return 'Paid';
  if (status === 'blocked') return 'Blocked';
  if (status === 'active') return 'Active';
  return 'Reserved';
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    reservations: true,
    payments: true,
    users: true,
  });
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [statsResult, reservationsResult, paymentsResult, usersResult] = await Promise.allSettled([
        getAdminStats(),
        getReservations(),
        getAdminPayments(),
        getAdminUsers(),
      ]);

      if (!mounted) return;

      const nextErrors = [];

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        setStats(MOCK_STATS);
        nextErrors.push('Admin stats are showing fallback data.');
      }

      if (reservationsResult.status === 'fulfilled') {
        setReservations(reservationsResult.value);
      } else {
        setReservations(MOCK_RESERVATIONS);
        nextErrors.push('Reservations are showing fallback data.');
      }

      if (paymentsResult.status === 'fulfilled') {
        setPayments(paymentsResult.value);
      } else {
        setPayments(MOCK_PAYMENTS);
        nextErrors.push('Payments are showing fallback data.');
      }

      if (usersResult.status === 'fulfilled') {
        setUsers(Array.isArray(usersResult.value) ? usersResult.value : usersResult.value?.items || []);
      } else {
        setUsers(MOCK_USERS);
        nextErrors.push('Users are showing fallback data.');
      }

      setErrors(nextErrors);
      setLoading({
        stats: false,
        reservations: false,
        payments: false,
        users: false,
      });
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pendingReservations = useMemo(
    () => reservations.filter((item) => item.status === 'reserved'),
    [reservations]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((item) => {
      const haystack = `${item.name || ''} ${item.email || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, users]);

  const statCards = [
    {
      label: 'Users',
      tone: 'orange',
      value: stats?.totalUsers ?? 0,
      helper: 'Total enrolled students',
    },
    {
      label: 'Pending',
      tone: 'purple',
      value: stats?.pendingReservations ?? 0,
      helper: 'Reservations needing approval',
      valueTone: (stats?.pendingReservations ?? 0) > 0 ? 'var(--orange)' : undefined,
    },
    {
      label: 'Revenue',
      tone: 'green',
      value: formatLakhs(stats?.totalRevenue ?? 0),
      helper: 'Total collected revenue',
    },
    {
      label: 'Active',
      tone: 'pink',
      value: stats?.activeToday ?? 0,
      helper: 'Users active today',
    },
  ];

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveReservation(id);
      setReservations((current) =>
        current.map((item) => (item._id === id ? { ...item, status: 'approved' } : item))
      );
      setStats((current) =>
        current
          ? {
              ...current,
              pendingReservations: Math.max((current.pendingReservations || 1) - 1, 0),
            }
          : current
      );
      toast.success('Reservation approved');
    } catch {
      toast.error('Could not approve reservation');
    } finally {
      setApprovingId(null);
    }
  };

  const handleUserToggle = async (targetUser) => {
    setTogglingUserId(targetUser._id);
    try {
      if (targetUser.isBlocked) {
        await unblockUser(targetUser._id);
        toast.success('User unblocked');
      } else {
        await blockUser(targetUser._id);
        toast.success('User blocked');
      }

      setUsers((current) =>
        current.map((item) =>
          item._id === targetUser._id
            ? {
                ...item,
                isBlocked: !targetUser.isBlocked,
                status: targetUser.isBlocked ? 'active' : 'blocked',
              }
            : item
        )
      );
    } catch {
      toast.error('Could not update user status');
    } finally {
      setTogglingUserId(null);
    }
  };

  const content = {
    overview: (
      <>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading.stats
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-5"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <LoadingSkeleton width={90} height={26} borderRadius={999} />
                  <LoadingSkeleton width={130} height={34} borderRadius={12} style={{ marginTop: 18 }} />
                  <LoadingSkeleton width={160} height={16} borderRadius={10} style={{ marginTop: 12 }} />
                </div>
              ))
            : statCards.map((item) => <StatCard key={item.label} {...item} />)}
        </section>

        <div className="mb-8">
          <ReservationsCard
            items={pendingReservations}
            loading={loading.reservations}
            approvingId={approvingId}
            onApprove={handleApprove}
          />
        </div>

        <div className="mb-8">
          <PaymentsCard items={payments} loading={loading.payments} />
        </div>

        <UsersCard
          items={filteredUsers}
          loading={loading.users}
          search={search}
          onSearch={setSearch}
          togglingUserId={togglingUserId}
          onToggle={handleUserToggle}
        />
      </>
    ),
    reservations: (
      <ReservationsCard
        items={pendingReservations}
        loading={loading.reservations}
        approvingId={approvingId}
        onApprove={handleApprove}
      />
    ),
    revenue: <PaymentsCard items={payments} loading={loading.payments} />,
    users: (
      <UsersCard
        items={filteredUsers}
        loading={loading.users}
        search={search}
        onSearch={setSearch}
        togglingUserId={togglingUserId}
        onToggle={handleUserToggle}
      />
    ),
    content: <PlaceholderCard title="Content" description="Content management is the next admin workflow to wire up." />,
    settings: <PlaceholderCard title="Settings" description="Platform settings will live here once the admin controls are connected." />,
  };

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Sidebar
        items={SIDEBAR_ITEMS.map((item) => ({ ...item, onClick: () => setActiveSection(item.id) }))}
        activeItem={activeSection}
        userName={user?.name || 'Admin'}
        userRole="Admin"
        userInitials="AD"
      />

      <main className="md:ml-[240px]" style={{ minHeight: '100vh', padding: '84px 20px 56px' }}>
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="m-0 font-clash text-[32px] font-semibold text-[var(--text)]">
                Platform Overview
              </h1>
              <p className="mt-2 text-[15px]" style={{ color: 'var(--text2)' }}>
                Admin command center for users, reservations, revenue, and content.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => toast('Report export will be connected next.', { icon: '📤' })}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                Export Report
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSection('content');
                  toast('Opening content section.', { icon: '🎬' });
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--grad2)' }}
              >
                + Add Content
              </button>
            </div>
          </header>

          {errors.length > 0 && (
            <div className="mb-6 flex flex-col gap-3">
              {errors.map((message) => (
                <InlineError key={message} message={message} />
              ))}
            </div>
          )}

          {content[activeSection]}
        </div>
      </main>
    </div>
  );
}

function ReservationsCard({ items, loading, approvingId, onApprove }) {
  return (
    <Card
      title="Pending Reservations"
      right={<Pill tone="yellow">{items.length}</Pill>}
    >
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingSkeleton key={index} width="100%" height={54} borderRadius={14} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <InlineError message="There are no reserved requests waiting for approval right now." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                <th className="pb-2 text-left font-medium">Parent</th>
                <th className="pb-2 text-left font-medium">Grade</th>
                <th className="pb-2 text-left font-medium">Phone</th>
                <th className="pb-2 text-left font-medium">Reserved</th>
                <th className="pb-2 text-left font-medium">Status</th>
                <th className="pb-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="rounded-l-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.parentName}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.grade}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.phone}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <Pill tone={statusTone(item.status)}>{statusLabel(item.status)}</Pill>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <button
                      type="button"
                      onClick={() => onApprove(item._id)}
                      disabled={approvingId === item._id || item.status !== 'reserved'}
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ background: item.status === 'approved' ? 'var(--green)' : 'var(--grad2)' }}
                    >
                      {item.status === 'approved' ? '✓ Done' : approvingId === item._id ? 'Approving...' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function PaymentsCard({ items, loading }) {
  return (
    <Card title="Recent Payments">
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} width="100%" height={54} borderRadius={14} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <InlineError message="No successful payments have been recorded yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                <th className="pb-2 text-left font-medium">Student</th>
                <th className="pb-2 text-left font-medium">Grade</th>
                <th className="pb-2 text-left font-medium">Amount</th>
                <th className="pb-2 text-left font-medium">Date</th>
                <th className="pb-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="rounded-l-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.studentName}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.grade}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {formatDate(item.date)}
                  </td>
                  <td className="rounded-r-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <Pill tone="green">Paid</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function UsersCard({ items, loading, search, onSearch, togglingUserId, onToggle }) {
  return (
    <Card
      title="User Management"
      right={
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-xl px-4 py-2 text-sm md:w-[280px]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            outline: 'none',
          }}
        />
      }
    >
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <LoadingSkeleton key={index} width="100%" height={54} borderRadius={14} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <InlineError message="No users match the current search." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                <th className="pb-2 text-left font-medium">Name</th>
                <th className="pb-2 text-left font-medium">Role</th>
                <th className="pb-2 text-left font-medium">Grade</th>
                <th className="pb-2 text-left font-medium">Status</th>
                <th className="pb-2 text-left font-medium">Enrolled</th>
                <th className="pb-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="rounded-l-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-[13px]" style={{ color: 'var(--text2)' }}>{item.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <Pill tone={item.role === 'parent' ? 'purple' : 'orange'}>{item.role}</Pill>
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.grade}
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <Pill tone={item.isBlocked ? 'red' : 'green'}>{item.isBlocked ? 'Blocked' : 'Active'}</Pill>
                  </td>
                  <td className="px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    {item.createdAt}
                  </td>
                  <td className="rounded-r-2xl px-4 py-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    <button
                      type="button"
                      onClick={() => onToggle(item)}
                      disabled={togglingUserId === item._id}
                      className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        border: `1px solid ${item.isBlocked ? 'rgba(76, 217, 100, 0.35)' : 'rgba(255, 77, 79, 0.35)'}`,
                        color: item.isBlocked ? 'var(--green)' : 'var(--red)',
                        background: 'transparent',
                      }}
                    >
                      {togglingUserId === item._id ? 'Updating...' : item.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function PlaceholderCard({ title, description }) {
  return (
    <Card title={title}>
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
        <p className="m-0 text-[15px]" style={{ color: 'var(--text2)' }}>
          {description}
        </p>
      </div>
    </Card>
  );
}
