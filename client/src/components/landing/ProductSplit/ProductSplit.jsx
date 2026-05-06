import './ProductSplit.scss';

const FEATURES = [
  {
    icon: '📄',
    title: 'Upload Any Chapter',
    desc: 'PDF, photo, or typed text — ROB reads it all.',
  },
  {
    icon: '🗓️',
    title: 'Structured 7-Day Plan',
    desc: 'Each chapter becomes a sequenced week of micro-lessons.',
  },
  {
    icon: '🧠',
    title: 'Comprehension, Not Memorisation',
    desc: 'Quizzes that test understanding, not recall.',
  },
];

const DAYS = [
  { label: 'Day 1 — Introduction',    status: 'Done',     state: 'done' },
  { label: 'Day 2 — Core Concepts',   status: 'Done',     state: 'done' },
  { label: 'Day 3 — Deep Dive',       status: 'Done',     state: 'done' },
  { label: 'Day 4 — Application',     status: 'Today ↗',  state: 'active' },
  { label: 'Day 5 — Practice Quiz',   status: 'Upcoming', state: '' },
  { label: 'Day 6 — Review',          status: 'Upcoming', state: '' },
  { label: 'Day 7 — Final Test',      status: 'Upcoming', state: '' },
];

export default function ProductSplit() {
  return (
    <section className="split">
      <div className="split__inner">

        {/* ── Copy ─────────────────────────────────────── */}
        <div className="split__copy">
          <p className="split__eyebrow">How It Works</p>

          <h2 className="split__headline">
            Upload Once.<br />Learn for a Week.
          </h2>

          <p className="split__body">
            ROB — your AI learning buddy — takes any school chapter and
            builds a complete learning journey. No prep needed.
          </p>

          <ul className="split__features">
            {FEATURES.map(({ icon, title, desc }) => (
              <li key={title} className="split__feature">
                <div className="split__feature-icon">{icon}</div>
                <div className="split__feature-text">
                  <span className="split__feature-title">{title}</span>
                  <span className="split__feature-desc">{desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <button className="split__link">
            See a full example →
          </button>
        </div>

        {/* ── Visual ───────────────────────────────────── */}
        <div className="split__visual">
          <div className="split__mockup">
            <div className="split__mockup-header">
              <span className="split__mockup-title">The Water Cycle · Chapter 4</span>
              <span className="split__mockup-badge">Live</span>
            </div>

            <div className="split__day-list">
              {DAYS.map(({ label, status, state }) => (
                <div key={label} className={`split__day${state ? ` split__day--${state}` : ''}`}>
                  <div className="split__day-info">
                    <div className="split__day-dot" />
                    <span className="split__day-label">{label}</span>
                  </div>
                  <span className="split__day-status">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
