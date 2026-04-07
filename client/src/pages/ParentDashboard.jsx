import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ProgressBar from '../components/ui/ProgressBar';
import { getChildActivity, getChildInfo, getParentBilling } from '../services/api';

const NAV_ITEMS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'progress', icon: '📊', label: "Child's Progress" },
  { id: 'billing', icon: '💳', label: 'Billing' },
  { id: 'support', icon: '📞', label: 'Support' },
];

const MOCK_DATA = {
  child: {
    name: 'Arjun Kumar',
    grade: 'Grade 8',
    programme: 'Junior',
    currentLevel: 3,
    overallProgress: 27,
    progress: 27,
    status: 'active',
  },
  activity: [
    { module: 'Build a Chatbot UI', level: 'Level 3', status: 'in-progress', date: 'Today' },
    { module: 'Intro: What is an AI App?', level: 'Level 3', status: 'completed', date: 'Yesterday' },
    { module: 'Advanced Prompting', level: 'Level 2', status: 'completed', date: '3 days ago' },
  ],
  billing: {
    amount: 6999,
    date: '2 Apr 2025',
    status: 'paid',
    invoiceId: 'INV-001',
    grade: 'Grade 8',
    programme: 'Junior',
  },
};

const BADGE_STYLES = {
  purple: { background: 'rgba(123, 63, 228, 0.16)', color: 'var(--purple)' },
  orange: { background: 'rgba(255, 92, 40, 0.16)', color: 'var(--orange)' },
  green: { background: 'rgba(76, 217, 100, 0.16)', color: 'var(--green)' },
  pink: { background: 'rgba(228, 57, 138, 0.16)', color: 'var(--pink)' },
  yellow: { background: 'rgba(255, 149, 0, 0.16)', color: 'var(--yellow)' },
  red: { background: 'rgba(255, 77, 79, 0.16)', color: 'var(--red)' },
};

const getInitials = (name = 'Parent') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatActivityDate = (value) => {
  if (!value) return 'Recently';
  if (typeof value === 'string' && !value.includes('T')) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatBillingDate = (value) => {
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

const StatusBadge = ({ tone, children }) => {
  const style = BADGE_STYLES[tone] || BADGE_STYLES.purple;

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={style}
    >
      {children}
    </span>
  );
};

const StatCard = ({ tone, label, value, helper }) => (
  <div
    className="rounded-2xl p-5"
    style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    }}
  >
    <StatusBadge tone={tone}>{label}</StatusBadge>
    <p
      className="font-clash font-bold mt-4 mb-2"
      style={{ fontSize: 30, lineHeight: 1, color: 'var(--text)' }}
    >
      {value}
    </p>
    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{helper}</p>
  </div>
);

const TableShell = ({ title, right, children }) => (
  <section
    className="rounded-[24px] p-6"
    style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
    }}
  >
    <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-center md:justify-between">
      <h2 className="font-clash text-[22px] font-semibold m-0">{title}</h2>
      {right}
    </div>
    {children}
  </section>
);

const ErrorCard = ({ message }) => (
  <div
    className="rounded-2xl p-4"
    style={{
      background: 'rgba(255, 77, 79, 0.08)',
      border: '1px solid rgba(255, 77, 79, 0.24)',
      color: 'var(--text)',
    }}
  >
    {message}
  </div>
);

export default function ParentDashboard() {
  const { user } = useAuth();
  const progressRef = useRef(null);
  const billingRef = useRef(null);

  const [child, setChild] = useState(null);
  const [activity, setActivity] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      const [childResult, activityResult, billingResult] = await Promise.allSettled([
        getChildInfo(),
        getChildActivity(),
        getParentBilling(),
      ]);

      if (!mounted) return;

      const nextErrors = [];
      let fallbackUsed = false;

      if (childResult.status === 'fulfilled') {
        setChild(childResult.value);
      } else {
        setChild(MOCK_DATA.child);
        fallbackUsed = true;
        nextErrors.push('Child info could not be loaded from the server, so demo data is being shown.');
      }

      if (activityResult.status === 'fulfilled') {
        setActivity(activityResult.value);
      } else {
        setActivity(MOCK_DATA.activity);
        fallbackUsed = true;
        nextErrors.push('Recent activity is using fallback data right now.');
      }

      if (billingResult.status === 'fulfilled') {
        setBilling(billingResult.value);
      } else {
        setBilling(MOCK_DATA.billing);
        fallbackUsed = true;
        nextErrors.push('Billing is using fallback data right now.');
      }

      setUsingFallback(fallbackUsed);
      setErrors(nextErrors);
      setLoading(false);
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const childName = child?.name || 'your child';
  const childProgress = child?.overallProgress ?? child?.progress ?? 0;
  const childStatus = (child?.status || 'pending').toLowerCase() === 'active' ? 'active' : 'pending';

  const stats = useMemo(() => {
    const completedCount = activity.filter((item) => item.status === 'completed').length;
    const hours = Math.max(1, Math.round((childProgress / 100) * 24));

    return [
      {
        tone: 'purple',
        label: 'Level',
        value: `${child?.currentLevel || 1} / 11`,
        helper: 'Current learning level',
      },
      {
        tone: 'orange',
        label: 'Modules',
        value: completedCount,
        helper: 'Completed modules tracked',
      },
      {
        tone: 'green',
        label: 'Streak',
        value: `${Math.max(completedCount, 1)} 🔥`,
        helper: 'Daily learning streak',
      },
      {
        tone: 'pink',
        label: 'Time',
        value: `${hours}h`,
        helper: 'Total watch time',
      },
    ];
  }, [activity, child?.currentLevel, childProgress]);

  const sidebarItems = useMemo(
    () => [
      NAV_ITEMS[0],
      {
        ...NAV_ITEMS[1],
        onClick: () => progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      },
      {
        ...NAV_ITEMS[2],
        onClick: () => billingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      },
      {
        ...NAV_ITEMS[3],
        onClick: () => toast('Support will be added shortly.', { icon: '📞' }),
      },
    ],
    []
  );

  const handleInvoiceDownload = () => {
    if (!billing?.invoiceId) {
      toast.error('Invoice is not available yet.');
      return;
    }

    window.open(`/api/payments/invoice/${billing.invoiceId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Sidebar
        items={sidebarItems}
        activeItem="overview"
        userName={user?.name || 'Priya Sharma'}
        userRole="Parent"
        userInitials={getInitials(user?.name || 'Priya Sharma')}
      />

      <main className="md:ml-[240px]" style={{ minHeight: '100vh', padding: '84px 20px 56px' }}>
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            {loading ? (
              <>
                <LoadingSkeleton width={280} height={40} borderRadius={14} />
                <LoadingSkeleton width={360} height={20} borderRadius={10} style={{ marginTop: 12 }} />
              </>
            ) : (
              <>
                <h1
                  className="font-clash font-semibold m-0"
                  style={{ fontSize: 32, color: 'var(--text)' }}
                >
                  Parent Dashboard
                </h1>
                <p style={{ color: 'var(--text2)', fontSize: 15, marginTop: 10 }}>
                  Monitoring {childName}&apos;s learning journey
                </p>
              </>
            )}
          </header>

          {errors.length > 0 && (
            <div className="mb-6 flex flex-col gap-3">
              {errors.map((message) => (
                <ErrorCard key={message} message={message} />
              ))}
            </div>
          )}

          {usingFallback && !loading && (
            <div
              className="mb-6 rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(123, 63, 228, 0.12)',
                border: '1px solid rgba(123, 63, 228, 0.22)',
                color: 'var(--text)',
              }}
            >
              Showing fallback dashboard data until the parent endpoints return live records.
            </div>
          )}

          <section className="mb-8">
            {loading ? (
              <div
                className="rounded-[24px] p-6"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <LoadingSkeleton width={56} height={56} borderRadius={999} />
                  <div className="flex-1">
                    <LoadingSkeleton width={220} height={30} borderRadius={12} />
                    <LoadingSkeleton width={320} height={18} borderRadius={10} style={{ marginTop: 10 }} />
                    <LoadingSkeleton width="100%" height={10} borderRadius={999} style={{ marginTop: 16 }} />
                  </div>
                  <LoadingSkeleton width={120} height={36} borderRadius={999} />
                </div>
              </div>
            ) : (
              <div
                className="rounded-[24px] p-[2px]"
                style={{ background: 'linear-gradient(135deg, var(--orange), var(--purple), var(--pink))' }}
              >
                <div
                  className="rounded-[22px] p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 92, 40, 0.08), rgba(123, 63, 228, 0.12)), var(--dark2)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full font-clash text-lg font-semibold"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      {getInitials(childName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <h2 className="font-clash m-0 text-[22px] font-semibold truncate">
                            {childName}
                          </h2>
                          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>
                            {child?.grade || 'Grade pending'} · {child?.programme || 'Programme pending'} · Level {child?.currentLevel || 1} of 11
                          </p>
                        </div>

                        <StatusBadge tone={childStatus === 'active' ? 'green' : 'yellow'}>
                          {childStatus === 'active' ? 'Active' : 'Pending'}
                        </StatusBadge>
                      </div>

                      <div className="mt-4">
                        <ProgressBar percent={childProgress} />
                        <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 10 }}>
                          Overall progress: {childProgress}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section ref={progressRef} className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <LoadingSkeleton width={88} height={26} borderRadius={999} />
                    <LoadingSkeleton width={120} height={34} borderRadius={12} style={{ marginTop: 18 }} />
                    <LoadingSkeleton width={160} height={16} borderRadius={10} style={{ marginTop: 12 }} />
                  </div>
                ))
              : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.95fr]">
            <TableShell title="Recent Activity">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <LoadingSkeleton key={index} width="100%" height={54} borderRadius={14} />
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <ErrorCard message="No learning activity has been recorded for this child yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                        <th className="pb-2 text-left font-medium">Module</th>
                        <th className="pb-2 text-left font-medium">Level</th>
                        <th className="pb-2 text-left font-medium">Status</th>
                        <th className="pb-2 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.slice(0, 10).map((item, index) => (
                        <tr key={`${item.module}-${index}`}>
                          <td
                            className="rounded-l-2xl px-4 py-4"
                            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                          >
                            <span style={{ color: 'var(--text)', fontSize: 14 }}>{item.module}</span>
                          </td>
                          <td style={{ background: 'rgba(255, 255, 255, 0.03)' }} className="px-4 py-4">
                            <span style={{ color: 'var(--text2)', fontSize: 14 }}>{item.level}</span>
                          </td>
                          <td style={{ background: 'rgba(255, 255, 255, 0.03)' }} className="px-4 py-4">
                            <StatusBadge tone={item.status === 'completed' ? 'green' : 'orange'}>
                              {item.status === 'completed' ? 'Completed' : 'In Progress'}
                            </StatusBadge>
                          </td>
                          <td
                            className="rounded-r-2xl px-4 py-4"
                            style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text2)', fontSize: 14 }}
                          >
                            {formatActivityDate(item.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TableShell>

            <div ref={billingRef}>
              <TableShell title="Billing">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    <LoadingSkeleton width="100%" height={28} borderRadius={12} />
                    <LoadingSkeleton width="100%" height={18} borderRadius={10} />
                    <LoadingSkeleton width="100%" height={18} borderRadius={10} />
                    <LoadingSkeleton width={180} height={42} borderRadius={14} style={{ marginTop: 12 }} />
                  </div>
                ) : billing?.status === 'paid' ? (
                  <div
                    className="rounded-[20px] p-5"
                    style={{
                      background: 'rgba(76, 217, 100, 0.08)',
                      border: '1px solid rgba(76, 217, 100, 0.2)',
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <StatusBadge tone="green">Lifetime Access Active</StatusBadge>
                      <button
                        type="button"
                        onClick={handleInvoiceDownload}
                        className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                          background: 'var(--surface-strong)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                        }}
                      >
                        Download Invoice
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <BillingValue label="Amount Paid" value={formatCurrency(billing.amount)} />
                      <BillingValue label="Payment Date" value={formatBillingDate(billing.date)} />
                      <BillingValue label="Grade" value={billing.grade || child?.grade || 'Grade pending'} />
                      <BillingValue label="Programme" value={billing.programme || child?.programme || 'Programme pending'} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-[20px] p-5"
                    style={{
                      background: 'rgba(255, 149, 0, 0.08)',
                      border: '1px solid rgba(255, 149, 0, 0.22)',
                    }}
                  >
                    <StatusBadge tone="yellow">Pending Payment</StatusBadge>
                    <h3 className="font-clash mt-4 mb-2 text-[20px] font-semibold">
                      Payment is still pending
                    </h3>
                    <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      Once billing is completed, this section will show the paid amount, payment date,
                      invoice download, and active access status.
                    </p>
                  </div>
                )}
              </TableShell>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BillingValue({ label, value }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <p style={{ color: 'var(--text2)', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {label}
      </p>
      <p className="font-clash mt-2 mb-0 text-[18px] font-semibold" style={{ color: 'var(--text)' }}>
        {value}
      </p>
    </div>
  );
}
