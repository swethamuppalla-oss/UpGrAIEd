import './LearningFlow.scss';

const STEPS = [
  { icon: '📄', num: 1, title: 'Upload',    desc: 'Share any chapter — PDF, photo, or text.',            active: false },
  { icon: '🤖', num: 2, title: 'AI Reads',  desc: 'ROB structures it into a clear learning path.',        active: false },
  { icon: '📚', num: 3, title: 'Learn',     desc: 'Work through 7 daily micro-lessons at your pace.',     active: true  },
  { icon: '🧠', num: 4, title: 'Quiz',      desc: 'Adaptive questions that test real understanding.',     active: false },
  { icon: '⭐', num: 5, title: 'Master',    desc: 'Earn XP, unlock levels, track your growth.',           active: false },
];

export default function LearningFlow({ onCtaClick }) {
  return (
    <section className="flow">
      <div className="flow__inner">

        <div className="flow__header">
          <p className="flow__eyebrow">The Process</p>
          <h2 className="flow__headline">Five steps from chapter to mastery</h2>
          <p className="flow__subtext">
            No planning, no prep. ROB does the heavy lifting so your child
            can focus on actually learning.
          </p>
        </div>

        <div className="flow__track">
          {STEPS.map(({ icon, num, title, desc, active }) => (
            <div key={num} className={`flow__step${active ? ' flow__step--active' : ''}`}>
              <div className="flow__step-icon-wrap">
                {icon}
                <span className="flow__step-num">{num}</span>
              </div>
              <div className="flow__step-body">
                <p className="flow__step-title">{title}</p>
                <p className="flow__step-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flow__callout">
          <div className="flow__callout-text">
            <p className="flow__callout-title">Ready to try it with a real chapter?</p>
            <p className="flow__callout-sub">Takes less than 60 seconds to upload and get started.</p>
          </div>
          <button className="flow__callout-btn" onClick={onCtaClick}>
            Upload Your First Chapter →
          </button>
        </div>

      </div>
    </section>
  );
}
