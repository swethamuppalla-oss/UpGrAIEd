import './DashboardPreview.scss';

const NAV = [
  { icon: '📚', label: 'My Lessons',  active: true  },
  { icon: '🧠', label: 'Quizzes',     active: false },
  { icon: '🏆', label: 'Leaderboard', active: false },
  { icon: '📈', label: 'Progress',    active: false },
];

const STATS = [
  { value: '840',  label: 'XP Earned'   },
  { value: '5🔥',  label: 'Day Streak'  },
  { value: '94%',  label: 'Avg. Score'  },
];

const LESSONS = [
  { name: 'The Water Cycle',       day: 'Day 4 of 7', pct: 62, active: true  },
  { name: 'Forces & Motion',       day: 'Complete',   pct: 100, active: false },
  { name: 'Ancient Civilisations', day: 'Day 2 of 7', pct: 22, active: false },
  { name: 'Fractions & Decimals',  day: 'Not started', pct: 0,  active: false },
];

const UPCOMING = [
  { label: 'Water Cycle Quiz',    when: 'Tomorrow'   },
  { label: 'Motion — Day 5',      when: 'Day after'  },
  { label: 'Civilisations Recap', when: 'In 3 days'  },
];

export default function DashboardPreview() {
  return (
    <section className="dash-preview">
      <div className="dash-preview__inner">

        <div className="dash-preview__header">
          <p className="dash-preview__eyebrow">The Product</p>
          <h2 className="dash-preview__headline">Everything in one clean dashboard</h2>
          <p className="dash-preview__subtext">
            Track lessons, streaks, and scores — all in one place. No clutter, no confusion.
          </p>
        </div>

        <div className="dash-preview__browser">

          {/* Browser chrome */}
          <div className="dash-preview__browser-bar">
            <div className="dash-preview__browser-dots">
              <span /><span /><span />
            </div>
            <div className="dash-preview__browser-url">
              app.upgraied.com/dashboard
            </div>
          </div>

          {/* App UI */}
          <div className="dash-preview__ui">

            {/* Sidebar */}
            <aside className="dash-sidebar">
              <div className="dash-sidebar__logo">
                <span>🌱</span>
                <span>UpgrAIed</span>
              </div>

              <p className="dash-sidebar__section">Learn</p>
              {NAV.map(({ icon, label, active }) => (
                <div key={label} className={`dash-sidebar__item${active ? ' dash-sidebar__item--active' : ''}`}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}

              <p className="dash-sidebar__section">Account</p>
              <div className="dash-sidebar__item"><span>⚙️</span><span>Settings</span></div>
              <div className="dash-sidebar__item"><span>👤</span><span>Profile</span></div>
            </aside>

            {/* Main */}
            <main className="dash-main">
              <div className="dash-main__greeting">
                <div className="dash-main__greeting-text">
                  <strong>Good morning, Aanya 👋</strong>
                  <span>You have 1 lesson due today</span>
                </div>
                <button className="dash-main__upload-btn">+ Upload Chapter</button>
              </div>

              <div className="dash-main__stats">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="dash-main__stat">
                    <span className="dash-main__stat-value">{value}</span>
                    <span className="dash-main__stat-label">{label}</span>
                  </div>
                ))}
              </div>

              <p className="dash-main__section-label">Active Chapters</p>
              <div className="dash-main__lessons">
                {LESSONS.map(({ name, day, pct, active }) => (
                  <div key={name} className={`dash-main__lesson${active ? ' dash-main__lesson--active' : ''}`}>
                    <div className="dash-main__lesson-info">
                      <strong>{name}</strong>
                      <span>{day}</span>
                    </div>
                    <div className="dash-main__lesson-right">
                      <div className="dash-main__lesson-bar">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <span className="dash-main__lesson-pct">{pct ? `${pct}%` : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </main>

            {/* Right panel */}
            <aside className="dash-panel">
              <div className="dash-panel__section">
                <p className="dash-panel__label">ROB Says</p>
                <div className="dash-panel__rob-card">
                  <p>"You're 62% through the Water Cycle. Let's finish Day 4 today — it's the key one."</p>
                  <p>→ Resume lesson</p>
                </div>
              </div>

              <div className="dash-panel__section">
                <p className="dash-panel__label">Coming Up</p>
                <div className="dash-panel__upcoming">
                  {UPCOMING.map(({ label, when }) => (
                    <div key={label} className="dash-panel__up-item">
                      <span>{label}</span>
                      <span>{when}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-panel__section">
                <p className="dash-panel__label">Streak</p>
                <div className="dash-panel__streak">
                  <div className="dash-panel__streak-count">
                    <strong>5</strong>
                    <span>Days in a row</span>
                  </div>
                  <span className="dash-panel__streak-icon">🔥</span>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </section>
  );
}
