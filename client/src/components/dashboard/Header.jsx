import { BloomCharacter } from '../Bloom'

const MOCK = {
  firstName: 'Alex',
  streak: 3,
  emotion: 'happy',
}

export default function Header({
  firstName = MOCK.firstName,
  greeting,
  streak = MOCK.streak,
  emotion = MOCK.emotion,
  grade,
}) {
  const hour = new Date().getHours()
  const resolvedGreeting = greeting ?? (hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')

  return (
    <div className="sd-header">
      <div className="sd-header__left">
        <p className="sd-header__greeting">{resolvedGreeting}</p>
        <h1 className="sd-header__name">{firstName} 👋</h1>
        {grade && <p className="sd-header__meta">Grade {grade}</p>}
      </div>

      <div className="sd-header__right">
        {streak > 0 && (
          <div className="sd-header__streak">
            <span>🔥</span>
            <span>{streak} day streak</span>
          </div>
        )}
        <BloomCharacter emotion={emotion} size="small" />
      </div>
    </div>
  )
}
