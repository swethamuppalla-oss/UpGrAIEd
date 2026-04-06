import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ProgressBar from '../components/ui/ProgressBar';
import { getStudentProgress, getStudentStats, getStudentLevels } from '../services/api';

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV = [
  { icon: '🏠', label: 'Dashboard',    to: '/dashboard/student' },
  { icon: '▶️', label: 'My Learning',  to: '/player'            },
  { icon: '📊', label: 'Progress',     to: '/progress'          },
  { icon: '🏆', label: 'Achievements', to: '/achievements'      },
  { icon: '💬', label: 'Community',    to: '/community'         },
];

// ── Mock fallback data ────────────────────────────────────────────────────────
const MOCK_PROGRESS = {
  enrolled: true,
  currentLevel: 3,
  currentLevelTitle: 'Build AI Apps',
  currentModuleId: 'mock-module-1',
  currentModuleName: 'Build a Chatbot UI',
  currentModuleProgress: 60,
  moduleNumber: 3,
};

const MOCK_STATS = {
  currentLevel: 3,
  totalLevels: 11,
  modulesCompleted: 14,
  modulesThisWeek: 3,
  dayStreak: 7,
  totalHours: 24,
};

const MOCK_LEVELS = [
  { id: '1', level: 1, title: 'AI Basics',          status: 'completed' },
  { id: '2', level: 2, title: 'Prompt Engineering', status: 'completed' },
  { id: '3', level: 3, title: 'Build AI Apps',      status: 'active'    },
  { id: '4', level: 4, title: 'AI Automation',      status: 'locked'    },
  { id: '5', level: 5, title: 'APIs & Tools',       status: 'locked'    },
];

// ── Skeleton block ────────────────────────────────────────────────────────────
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

const StatCard = ({ label, value, badge, badgeColor, delta, loading }) => {
  const bc = BADGE_COLORS[badgeColor] || BADGE_COLORS.purple;
  return (
    <div
      className="rounded-2xl flex flex-col gap-2"
      style={{
        background:   'var(--surface)',
        border:       '1px solid rgba(255,255,255,0.08)',
        padding:      20,
        borderRadius: 16,
      }}
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
          {delta && (
            <p style={{ fontSize: 12, color: '#4CD964' }}>{delta}</p>
          )}
        </>
      )}
    </div>
  );
};

// ── Level card ────────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  completed: {
    icon:        '✅',
    badge:       'Done',
    badgeStyle:  { background: 'rgba(52,199,89,0.15)',  color: '#4CD964' },
    borderColor: 'rgba(52,199,89,0.25)',
    opacity:     1,
    glow:        false,
  },
  active: {
    icon:        '▶️',
    badge:       'In Progress',
    badgeStyle:  { background: 'rgba(123,63,228,0.2)', color: '#7B3FE4' },
    borderColor: '#7B3FE4',
    opacity:     1,
    glow:        true,
  },
  locked: {
    icon:        '🔒',
    badge:       'Locked',
    badgeStyle:  { background: 'rgba(255,255,255,0.08)', color: 'rgba(240,238,248,0.4)' },
    borderColor: 'rgba(255,255,255,0.08)',
    opacity:     0.5,
    glow:        false,
  },
};

const LevelCard = ({ item, onClick }) => {
  const cfg = LEVEL_CONFIG[item.status] || LEVEL_CONFIG.locked;
  return (
    <button
      onClick={() => onClick(item)}
      style={{
        minWidth:    180,
        background:  'var(--surface)',
        border:      `1px solid ${cfg.borderColor}`,
        borderRadius: 16,
        padding:     '18px 20px',
        textAlign:   'left',
        opacity:     cfg.opacity,
        flexShrink:  0,
        cursor:      item.status === 'locked' ? 'default' : 'pointer',
        boxShadow:   cfg.glow ? '0 0 20px rgba(123,63,228,0.25)' : 'none',
        transition:  'transform 0.15s, box-shadow 0.15s',
      }}
      className={item.status !== 'locked' ? 'hover:scale-[1.02]' : ''}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 22 }}>{cfg.icon}</span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
          style={cfg.badgeStyle}
        >
          {cfg.badge}
        </span>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>
        Level {item.level}
      </p>
      <p className="font-clash font-semibold" style={{ fontSize: 15, color: 'var(--text)' }}>
        {item.title}
      </p>
    </button>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const navigate                    = useNavigate();
  const { user, token, isLoading }  = useAuth();

  // Debug — remove before production
  console.log('AUTH STATE:', { user, token: token ? token.slice(0, 20) + '…' : null, isLoading });

  const [progress,  setProgress]  = useState(null);
  const [stats,     setStats]     = useState(null);
  const [levels,    setLevels]    = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [progRes, statsRes, levelsRes] = await Promise.allSettled([
        getStudentProgress(),
        getStudentStats(),
        getStudentLevels(),
      ]);

      setProgress(progRes.status  === 'fulfilled' ? progRes.value.data  : MOCK_PROGRESS);
      setStats(   statsRes.status === 'fulfilled' ? statsRes.value.data : MOCK_STATS);
      setLevels(  levelsRes.status === 'fulfilled'
        ? levelsRes.value.data.levels
        : MOCK_LEVELS
      );
      setLoading(false);
    };

    fetchAll();
  }, []);

  const handleLevelClick = (item) => {
    if (item.status === 'locked') {
      toast.error(`Complete Level ${item.level - 1} first to unlock this level.`);
      return;
    }
    navigate('/player');
  };

  const currentLevel  = stats?.currentLevel  ?? progress?.currentLevel  ?? 3;
  const totalLevels   = stats?.totalLevels   ?? 11;
  const moduleNum     = progress?.moduleNumber ?? 1;

  return (
    <div style={{ background: '#08060F', minHeight: '100vh' }}>
      <Sidebar items={NAV} />

      {/* Main content */}
      <main style={{ marginLeft: 240, padding: '40px 40px 60px', minHeight: '100vh' }}>
        <Navbar title="Dashboard" />

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
                Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p style={{ marginTop: 8, color: 'var(--text2)', fontSize: 15 }}>
                You're on Level {currentLevel} · Module {moduleNum}. Keep going!
              </p>
            </>
          )}
        </div>

        {/* ── Section 2: Continue Learning card ────────────────────────── */}
        <div
          style={{
            borderRadius: 20,
            padding:      2,
            background:   'linear-gradient(135deg, #FF5C28, #7B3FE4)',
            marginBottom: 32,
          }}
        >
          <div
            className="flex items-center gap-6"
            style={{
              borderRadius: 18,
              padding:      '24px 28px',
              background:   'linear-gradient(135deg, rgba(255,92,40,0.08) 0%, rgba(123,63,228,0.12) 100%), #0F0B1C',
            }}
          >
            {loading ? (
              <>
                <Skel w="w-14" h="h-14" rounded="rounded-2xl" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skel w="w-36" h="h-4" />
                  <Skel w="w-56" h="h-7" />
                  <Skel w="w-full" h="h-2" rounded="rounded-full" />
                  <Skel w="w-40" h="h-4" />
                </div>
                <Skel w="w-28" h="h-11" rounded="rounded-xl" />
              </>
            ) : (
              <>
                {/* Play icon */}
                <div
                  className="grad-bg flex items-center justify-center shrink-0"
                  style={{ width: 56, height: 56, borderRadius: 16, fontSize: 22 }}
                >
                  ▶️
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-[11px] font-bold uppercase tracking-widest rounded-full px-2.5 py-0.5 mb-2"
                    style={{ background: 'rgba(255,92,40,0.2)', color: '#FF5C28' }}
                  >
                    Continue Learning
                  </span>
                  <p className="font-clash font-semibold truncate" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 10 }}>
                    {progress?.currentModuleName || 'Getting Started'}
                  </p>
                  <ProgressBar percent={progress?.currentModuleProgress ?? 0} className="mb-2" />
                  <p style={{ fontSize: 13, color: 'var(--text2)' }}>
                    Level {currentLevel} · Module {moduleNum} of 6 &nbsp;·&nbsp;{' '}
                    <span style={{ color: '#7B3FE4' }}>{progress?.currentModuleProgress ?? 0}% complete</span>
                  </p>
                </div>

                {/* Resume button */}
                <button
                  onClick={() => navigate(progress?.currentModuleId ? `/player/${progress.currentModuleId}` : '/player')}
                  className="shrink-0 font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg,#FF5C28,#7B3FE4)',
                    padding:    '12px 24px',
                    fontSize:   14,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Resume →
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Section 3: Stats row ──────────────────────────────────────── */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 40 }}
        >
          <StatCard
            badge="Level" badgeColor="orange" loading={loading}
            value={`${currentLevel}/${totalLevels}`}
            label="Current level"
          />
          <StatCard
            badge="Modules" badgeColor="purple" loading={loading}
            value={stats?.modulesCompleted ?? 0}
            label="Modules completed"
            delta={stats?.modulesThisWeek ? `+${stats.modulesThisWeek} this week` : null}
          />
          <StatCard
            badge="Streak" badgeColor="green" loading={loading}
            value={`${stats?.dayStreak ?? 0} 🔥`}
            label="Day streak"
          />
          <StatCard
            badge="Hours" badgeColor="pink" loading={loading}
            value={`${stats?.totalHours ?? 0}h`}
            label="Total watch time"
          />
        </div>

        {/* ── Section 4: Level Path ─────────────────────────────────────── */}
        <div>
          <h2
            className="font-clash font-semibold"
            style={{ fontSize: 22, color: 'var(--text)', marginBottom: 20 }}
          >
            Your Learning Path
          </h2>

          {loading ? (
            <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: 8 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ minWidth: 180, height: 110, borderRadius: 16 }}
                     className="bg-white/10 animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            <div
              className="flex gap-4"
              style={{ overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'thin' }}
            >
              {(levels || MOCK_LEVELS).map((item) => (
                <LevelCard key={item.id} item={item} onClick={handleLevelClick} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
