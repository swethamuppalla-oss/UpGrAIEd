import './BloomStatus.scss';

const STAGES = [
  { label: 'Seed',       emoji: '🌱' },
  { label: 'Sprout',     emoji: '🌿' },
  { label: 'Bud',        emoji: '🌸' },
  { label: 'Bloom',      emoji: '🌺' },
  { label: 'Full Bloom', emoji: '✨' },
];

export default function BloomStatus({ bloom }) {
  const { stage, xp, xpToNext } = bloom;
  const pct = Math.min(100, Math.round((xp / xpToNext) * 100));

  return (
    <div className="bs">
      <div className="bs__header">
        <p className="bs__title">Bloom Status</p>
        <span className="bs__xp-count">{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
      </div>

      <div className="bs__track">
        {STAGES.map(({ label, emoji }, i) => {
          const n = i + 1;
          return (
            <div key={label} className="bs__stage-wrap">
              <div className={`bs__node${n < stage ? ' bs__node--done' : ''}${n === stage ? ' bs__node--active' : ''}`}>
                <span className="bs__emoji">{emoji}</span>
              </div>
              <p className={`bs__label${n === stage ? ' bs__label--active' : ''}`}>{label}</p>
              {i < STAGES.length - 1 && (
                <div className={`bs__line${n < stage ? ' bs__line--done' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="bs__bar-wrap">
        <div className="bs__bar">
          <div className="bs__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="bs__bar-label">{pct}% to next stage</span>
      </div>
    </div>
  );
}
