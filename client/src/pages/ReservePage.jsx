export default function ReservePage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-primary)',
      flexDirection: 'column',
      gap: 12,
    }}>
      <span style={{ fontSize: 40 }}>📋</span>
      <div style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700 }}>Reserve a Spot</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Coming Soon</div>
    </div>
  )
}
