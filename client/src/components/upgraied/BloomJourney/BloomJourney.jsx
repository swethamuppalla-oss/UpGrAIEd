import './BloomJourney.scss';

const CARDS = [
  {
    icon: '🤖',
    color: 'amber',
    title: 'Your Daily Buddy',
    desc: `ROB checks in every day, explains tough concepts, and keeps you on track.`,
    tag: 'AI-Powered',
  },
  {
    icon: '🧠',
    color: 'green',
    title: 'Adaptive Quizzes',
    desc: `Questions that adjust to what you know — no wasted time on what you've mastered.`,
    tag: 'Smart Scoring',
  },
  {
    icon: '🔥',
    color: 'blue',
    title: 'Streak System',
    desc: `Daily streaks keep momentum alive. Missing a day? ROB finds you a shortcut back.`,
    tag: '7-Day Cadence',
  },
  {
    icon: '🏆',
    color: 'purple',
    title: 'XP & Rewards',
    desc: `Every lesson, quiz, and streak earns real XP. Levels feel earned because they are.`,
    tag: 'Gamified Growth',
  },
];

const STATS = [
  { value: '7×',   label: 'More engaging than revision notes' },
  { value: '94%',  label: 'Average comprehension score' },
  { value: '3min', label: 'Daily minimum to maintain a streak' },
  { value: '100+', label: 'Subject chapters supported' },
];

export default function BloomJourney() {
  return (
    <section className="bloom">
      <div className="bloom__inner">

        {/* Copy */}
        <div className="bloom__copy">
          <p className="bloom__eyebrow anim-fade-up">Meet ROB</p>

          <h2 className="bloom__headline anim-fade-up anim-delay-1">
            An AI buddy that<br />
            actually <em>shows up</em><br />
            every day
          </h2>

          <p className="bloom__body anim-fade-up anim-delay-2">
            ROB isn't a chatbot. It's a structured learning companion
            that knows your chapter, your pace, and where you're stuck.
          </p>

          <div className="bloom__stats anim-fade-up anim-delay-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bloom__stat">
                <span className="bloom__stat-value">{value}</span>
                <span className="bloom__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="bloom__grid">
          {CARDS.map(({ icon, color, title, desc, tag }, i) => (
            <div key={title} className={`bloom__card anim-fade-up anim-delay-${i + 1}`}>
              <div className={`bloom__card-icon bloom__card-icon--${color}`}>{icon}</div>
              <div className="bloom__card-body">
                <p className="bloom__card-title">{title}</p>
                <p className="bloom__card-desc">{desc}</p>
              </div>
              <span className={`bloom__card-tag bloom__card-tag--${color}`}>{tag}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
