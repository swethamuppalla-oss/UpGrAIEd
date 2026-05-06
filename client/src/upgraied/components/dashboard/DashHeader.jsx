import './DashHeader.scss';
import Bloom from '../Bloom/Bloom';
import { getBloomVariant } from '../../utils/bloomUtils';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashHeader({ name, grade = 7, streak = 5 }) {
  const variant = getBloomVariant(grade);

  return (
    <header className="dh">
      <div className="dh__left">
        <p className="dh__greeting">{getGreeting()},</p>
        <h1 className="dh__name">{name} 👋</h1>
        <p className="dh__sub">You're on a roll — keep the streak alive.</p>
      </div>
      <div className="dh__right">
        <div className="dh__mascot">
          <Bloom variant={variant} size={64} />
          <p className="dh__mascot-label">{variant}</p>
        </div>
        <div className="dh__streak">
          <span className="dh__streak-icon">🔥</span>
          <span className="dh__streak-count">{streak}</span>
          <span className="dh__streak-label">day streak</span>
        </div>
      </div>
    </header>
  );
}
