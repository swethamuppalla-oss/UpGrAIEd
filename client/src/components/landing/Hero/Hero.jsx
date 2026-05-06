import './Hero.scss';

export default function Hero({ onCtaClick }) {
  return (
    <section className="hero">
      <div className="hero__orb hero__orb--amber" />
      <div className="hero__orb hero__orb--navy" />
      <div className="hero__orb hero__orb--accent" />

      <div className="hero__inner">
        {/* ── Copy ─────────────────────────────────────── */}
        <div className="hero__copy">

          <div className="hero__badge anim-fade-up">
            <span />
            <span>AI Learning · Ages 8–14</span>
          </div>

          <h1 className="hero__headline anim-fade-up anim-delay-1">
            Where Curious Kids<br />
            Become <em>Deep Thinkers</em>
          </h1>

          <p className="hero__subtext anim-fade-up anim-delay-2">
            Upload your school chapters. We turn them into a structured
            7-day learning journey — powered by AI, built for real understanding.
          </p>

          <div className="hero__actions anim-fade-up anim-delay-3">
            <button className="hero__cta-primary" onClick={onCtaClick}>
              Start Learning Free
            </button>
            <button className="hero__cta-ghost">
              See How It Works
            </button>
          </div>

          <div className="hero__social-proof anim-fade-up anim-delay-4">
            <div className="hero__avatars">
              {['👩', '👨', '👩', '👦', '👧'].map((emoji, i) => (
                <div key={i} className="hero__avatar">{emoji}</div>
              ))}
            </div>
            <div className="hero__proof-text">
              <div className="hero__stars">{'★★★★★'}</div>
              <p className="hero__proof-label">1,000+ learners in early access</p>
            </div>
          </div>
        </div>

        {/* ── Visual ───────────────────────────────────── */}
        <div className="hero__visual anim-fade-up anim-delay-2">
          <div className="hero__card-stack">

            <div className="hero__card hero__card--main">
              <div>
                <p className="hero__card-label">This Week's Lesson</p>
                <h3 className="hero__card-title">The Water Cycle &amp; Climate Patterns</h3>
                <div className="hero__card-chips">
                  {['Chapter 4', 'Geography', '7 Days', 'Quiz Ready'].map(tag => (
                    <span key={tag} className="hero__chip">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="hero__card-label">Progress</p>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: '#F59E0B', borderRadius: 2 }} />
                </div>
                <p className="hero__card-sub" style={{ marginTop: 6 }}>Day 4 of 7 · 62% complete</p>
              </div>
            </div>

            <div className="hero__card hero__card--float-a">
              <p className="hero__card-stat">
                <strong>94%</strong>
                Comprehension score
              </p>
            </div>

            <div className="hero__card hero__card--float-b">
              <p className="hero__card-tag">🔥 3-day streak</p>
              <p className="hero__card-sub">Keep it going!</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
