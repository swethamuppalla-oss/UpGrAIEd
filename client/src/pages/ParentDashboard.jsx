import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { getParentDashboard } from '../services/api';

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV = [
  { icon: '🏠', label: 'Dashboard',  to: '/dashboard/parent' },
  { icon: '💳', label: 'Payment',    to: '/payment'          },
];

// ── Enrollment status config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  RESERVED: {
    label:    'Seat Reserved',
    badge:    'Pending Review',
    color:    '#FF9500',
    bg:       'rgba(255,149,0,0.12)',
    icon:     '⏳',
    message:  'Your reservation is pending admin review. You\'ll be notified once approved.',
  },
  APPROVED: {
    label:    'Approved',
    badge:    'Ready to Pay',
    color:    '#7B3FE4',
    bg:       'rgba(123,63,228,0.12)',
    icon:     '✅',
    message:  'Your seat has been approved! Complete payment to activate your child\'s account.',
  },
  ACTIVE: {
    label:    'Active',
    badge:    'Enrolled',
    color:    '#4CD964',
    bg:       'rgba(76,217,100,0.12)',
    icon:     '🎓',
    message:  'Your child is enrolled and learning! Track their progress below.',
  },
  REJECTED: {
    label:    'Rejected',
    badge:    'Contact Support',
    color:    '#E4398A',
    bg:       'rgba(228,57,138,0.12)',
    icon:     '❌',
    message:  'Your reservation was not approved. Please contact support for assistance.',
  },
};

// ── Mock fallback ─────────────────────────────────────────────────────────────
const MOCK = {
  hasProfile:  true,
  enrollment:  { id: 'mock', status: 'ACTIVE', createdAt: new Date().toISOString() },
  child:       { name: 'Arjun Kumar', email: 'arjun@example.com' },
  childStats:  {
    currentLevel:     3,
    totalLevels:      11,
    modulesCompleted: 14,
    modulesThisWeek:  3,
    dayStreak:        7,
  },
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
  yellow: { bg: 'rgba(255,149,0,0.15)',  text: '#FF9500' },
};

const StatCard = ({ label, value, badge, badgeColor, delta, loading }) => {
  const bc = BADGE_COLORS[badgeColor] || BADGE_COLORS.purple;
  return (
    <div
      className="rounded-2xl flex flex-col gap-2"
      style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}
    >
      {loading ? (
        <>
          <Skel w="w-16" h="h-5" />
          <Skel w="w-24" h="h-8" />
          <Skel w="w-20" h="h-4" />
        </>
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
          {delta && <p style={{ fontSize: 12, color: '#4CD964' }}>{delta}</p>}
        </>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ParentDashboard() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParentDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const enroll  = data?.enrollment;
  const child   = data?.child;
  const stats   = data?.childStats;
  const statusCfg = enroll ? (STATUS_CONFIG[enroll.status] || STATUS_CONFIG.RESERVED) : null;

  return (
    <div style={{ background: '#08060F', minHeight: '100vh' }}>
      <Sidebar items={NAV} />

      <main style={{ marginLeft: 240, padding: '40px 40px 60px', minHeight: '100vh' }}>
        <Navbar title="Parent Dashboard" />

        {/* ── Section 1: Welcome ────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          {loading ? (
            <>
              <Skel w="w-72" h="h-10" rounded="rounded-xl" />
              <div className="mt-2"><Skel w="w-80" h="h-5" /></div>
            </>
          ) : (
            <>
              <h1 className="font-clash font-bold" style={{ fontSize: 32, color: 'var(--text)', margin: 0 }}>
                Welcome, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p style={{ marginTop: 8, color: 'var(--text2)', fontSize: 15 }}>
                {data?.enrollment
                  ? `Managing ${child?.name || 'your child'}'s learning journey.`
                  : 'Reserve a seat to get started.'}
              </p>
            </>
          )}
        </div>

        {/* ── Section 2: Enrollment Status Card ────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          {loading ? (
            <div style={{ borderRadius: 20, height: 120 }} className="bg-white/5 animate-pulse" />
          ) : !data?.enrollment ? (
            /* No enrollment — CTA to reserve */
            <div
              style={{
                borderRadius: 20,
                padding:      2,
                background:   'linear-gradient(135deg, #FF5C28, #7B3FE4)',
              }}
            >
              <div
                className="flex items-center gap-6"
                style={{
                  borderRadius: 18,
                  padding:      '28px 32px',
                  background:   'linear-gradient(135deg, rgba(255,92,40,0.06) 0%, rgba(123,63,228,0.10) 100%), #0F0B1C',
                }}
              >
                <div
                  className="grad-bg flex items-center justify-center shrink-0"
                  style={{ width: 56, height: 56, borderRadius: 16, fontSize: 26 }}
                >
                  🎯
                </div>
                <div className="flex-1">
                  <p className="font-clash font-bold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 6 }}>
                    Get your child started with AI education
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text2)' }}>
                    Reserve a seat today. Limited spots available for Grades 6–12.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/reserve')}
                  className="shrink-0 font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#FF5C28,#7B3FE4)', padding: '12px 28px', fontSize: 14 }}
                >
                  Reserve a Seat →
                </button>
              </div>
            </div>
          ) : (
            /* Has enrollment — show status */
            <div
              style={{
                borderRadius: 20,
                padding:      '24px 28px',
                background:   'var(--surface)',
                border:       `1px solid ${statusCfg.color}33`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{ width: 52, height: 52, borderRadius: 14, background: statusCfg.bg, fontSize: 24 }}
                >
                  {statusCfg.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-clash font-bold" style={{ fontSize: 18, color: 'var(--text)' }}>
                      {child?.name || 'Your Child'}
                    </p>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
                    {statusCfg.message}
                  </p>
                  {child?.email && (
                    <p style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {child.email}
                    </p>
                  )}
                </div>

                {/* Contextual CTA */}
                {enroll.status === 'APPROVED' && (
                  <button
                    onClick={() => navigate('/payment')}
                    className="shrink-0 font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#7B3FE4,#E4398A)', padding: '10px 22px', fontSize: 13 }}
                  >
                    Complete Payment →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Section 3: Child Stats (only when ACTIVE) ─────────────────── */}
        {!loading && enroll?.status === 'ACTIVE' && (
          <div style={{ marginBottom: 40 }}>
            <h2
              className="font-clash font-semibold"
              style={{ fontSize: 20, color: 'var(--text)', marginBottom: 20 }}
            >
              {child?.name?.split(' ')[0] || 'Child'}'s Progress
            </h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <StatCard
                badge="Level" badgeColor="orange"
                value={`${stats?.currentLevel ?? 1}/${stats?.totalLevels ?? 11}`}
                label="Current level"
              />
              <StatCard
                badge="Modules" badgeColor="purple"
                value={stats?.modulesCompleted ?? 0}
                label="Modules completed"
                delta={stats?.modulesThisWeek ? `+${stats.modulesThisWeek} this week` : null}
              />
              <StatCard
                badge="Streak" badgeColor="green"
                value={`${stats?.dayStreak ?? 0} 🔥`}
                label="Day streak"
              />
              <StatCard
                badge="Status" badgeColor="yellow"
                value="Active"
                label="Enrollment status"
              />
            </div>
          </div>
        )}

        {/* ── Section 4: Quick Actions ──────────────────────────────────── */}
        {!loading && (
          <div>
            <h2
              className="font-clash font-semibold"
              style={{ fontSize: 20, color: 'var(--text)', marginBottom: 20 }}
            >
              Quick Actions
            </h2>
            <div className="flex gap-4 flex-wrap">
              {!enroll && (
                <QuickAction
                  icon="🎯" title="Reserve a Seat" desc="Limited spots — grab one now"
                  color="#FF5C28" onClick={() => navigate('/reserve')}
                />
              )}
              {enroll?.status === 'APPROVED' && (
                <QuickAction
                  icon="💳" title="Complete Payment" desc="Activate your child's account"
                  color="#7B3FE4" onClick={() => navigate('/payment')}
                />
              )}
              <QuickAction
                icon="📞" title="Contact Support" desc="Get help with your account"
                color="#E4398A"
                onClick={() => toast('Opening support...', { icon: '📞' })}
              />
              <QuickAction
                icon="📄" title="Program Details" desc="Learn about our curriculum"
                color="#FF9500"
                onClick={() => toast('Opening program info...', { icon: '📄' })}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Quick action card ─────────────────────────────────────────────────────────
function QuickAction({ icon, title, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left transition-all hover:scale-[1.02] hover:shadow-lg"
      style={{
        background:   'var(--surface)',
        border:       `1px solid ${color}33`,
        borderRadius: 16,
        padding:      '18px 22px',
        minWidth:     200,
      }}
    >
      <div
        className="flex items-center justify-center mb-3"
        style={{
          width:        44,
          height:       44,
          borderRadius: 12,
          background:   `${color}18`,
          fontSize:     22,
        }}
      >
        {icon}
      </div>
      <p className="font-clash font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
        {title}
      </p>
      <p style={{ fontSize: 12, color: 'var(--text2)' }}>{desc}</p>
    </button>
  );
}
