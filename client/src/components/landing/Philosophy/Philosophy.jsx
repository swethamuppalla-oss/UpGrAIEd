import './Philosophy.scss';

const PILLARS = [
  {
    number: '01',
    title: 'Learn Deeply',
    body: 'Mastery over speed. We build real understanding — not the kind that fades the week after the test.',
  },
  {
    number: '02',
    title: 'Think Clearly',
    body: 'AI scaffolds the structure. The student navigates it. Critical thinking is the skill we're training.',
  },
  {
    number: '03',
    title: 'Grow Boldly',
    body: 'Progress feels earned because it is. Every level unlocked, every streak kept — genuinely won.',
  },
];

export default function Philosophy({ onCtaClick }) {
  return (
    <section className="philosophy">
      <div className="philosophy__inner">

        <p className="philosophy__eyebrow anim-fade-up">Our Philosophy</p>

        <h2 className="philosophy__headline anim-fade-up anim-delay-1">
          Learning isn't about memorising.<br />
          It's about understanding.
        </h2>

        <p className="philosophy__subtext anim-fade-up anim-delay-2">
          We built UpgrAIed because the best students aren't the ones
          who remember the most — they're the ones who think the clearest.
        </p>

        <div className="philosophy__divider" />

        <div className="philosophy__pillars">
          {PILLARS.map(({ number, title, body }, i) => (
            <div key={number} className={`philosophy__pillar anim-fade-up anim-delay-${i + 1}`}>
              <span className="philosophy__pillar-number">{number}</span>
              <h3 className="philosophy__pillar-title">{title}</h3>
              <p className="philosophy__pillar-body">{body}</p>
            </div>
          ))}
        </div>

        <div className="philosophy__cta-wrap anim-fade-up anim-delay-4">
          <span className="philosophy__cta-label">Ready to see it in action?</span>
          <button className="philosophy__cta" onClick={onCtaClick}>
            Start for Free →
          </button>
        </div>

      </div>
    </section>
  );
}
