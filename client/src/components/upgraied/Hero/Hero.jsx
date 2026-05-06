import './Hero.scss';
import { EditableText, EditableImage, cmsKey } from '../../cms';

const LESSONS = [
  { name: 'The Water Cycle',       progress: 62,  badge: 'Day 4', active: true  },
  { name: 'Forces & Motion',       progress: 100, badge: 'Done',  active: false },
  { name: 'Ancient Civilisations', progress: 18,  badge: 'Day 2', active: false },
];

export default function Hero({ data, onUpdate, onCtaClick }) {
  return (
    <section className="u-hero">
      <div className="u-hero__orb u-hero__orb--a" />
      <div className="u-hero__orb u-hero__orb--b" />
      <div className="u-hero__orb u-hero__orb--c" />

      <div className="u-hero__inner">

        {/* ── Copy ─────────────────────────────────────── */}
        <div className="u-hero__copy">

          <div className="u-hero__badge anim-fade-up">
            <span className="u-hero__badge-dot" />
            <span className="u-hero__badge-text">
              <EditableText
                value={data.badge}
                onSave={(v) => onUpdate('badge', v)}
              />
            </span>
          </div>

          <h1 className="u-hero__headline anim-fade-up anim-delay-1">
            <EditableText
              value={data.title}
              onSave={(v) => onUpdate('title', v)}
            />
          </h1>

          <p className="u-hero__subtext anim-fade-up anim-delay-2">
            <EditableText
              value={data.subtitle}
              onSave={(v) => onUpdate('subtitle', v)}
              multiline
            />
          </p>

          <div className="u-hero__actions anim-fade-up anim-delay-3">
            <button className="u-hero__btn u-hero__btn--primary" onClick={onCtaClick}>
              <EditableText
                value={data.ctaPrimary}
                onSave={(v) => onUpdate('ctaPrimary', v)}
              />
            </button>
            <button className="u-hero__btn u-hero__btn--ghost">
              <EditableText
                value={data.ctaGhost}
                onSave={(v) => onUpdate('ctaGhost', v)}
              />
            </button>
          </div>

          <div className="u-hero__meta anim-fade-up anim-delay-4">
            <div className="u-hero__stat">
              <strong>1,200+</strong>
              <span>Active learners</span>
            </div>
            <div className="u-hero__meta-divider" />
            <div className="u-hero__stat">
              <strong>94%</strong>
              <span>Avg. comprehension</span>
            </div>
            <div className="u-hero__meta-divider" />
            <div className="u-hero__stat">
              <strong>7 Days</strong>
              <span>Per chapter</span>
            </div>
          </div>
        </div>

        {/* ── Visual ───────────────────────────────────── */}
        <div className="u-hero__visual anim-fade-up anim-delay-2">
          {data.image ? (
            <EditableImage
              src={data.image}
              alt="Hero visual"
              onSave={(file, url) => onUpdate('image', url)}
              storageKey={cmsKey('hero_image')}
              className="u-hero__hero-img"
            />
          ) : (
            <div className="u-hero__screen">
              <div className="u-hero__screen-bar">
                <span /><span /><span />
              </div>

              <p className="u-hero__screen-title">Your Lessons</p>

              {LESSONS.map(({ name, progress, badge, active }) => (
                <div key={name} className={`u-hero__lesson-card${active ? ' u-hero__lesson-card--active' : ''}`}>
                  <div className="u-hero__lesson-top">
                    <span className="u-hero__lesson-name">{name}</span>
                    <span className="u-hero__lesson-badge">{badge}</span>
                  </div>
                  <div className="u-hero__progress-bar">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ))}

              <div className="u-hero__screen-footer">
                <span className="u-hero__xp">⚡ 840 XP earned</span>
                <span className="u-hero__streak">🔥 5-day streak</span>
              </div>
            </div>
          )}

          <div className="u-hero__chip u-hero__chip--a">
            <p className="u-hero__chip-label">✓ Quiz passed</p>
            <p className="u-hero__chip-sub">Forces &amp; Motion · 96%</p>
          </div>

          <div className="u-hero__chip u-hero__chip--b">
            <p className="u-hero__chip-label">🏆 Level 3 unlocked</p>
            <p className="u-hero__chip-sub">+200 XP</p>
          </div>
        </div>

      </div>
    </section>
  );
}
