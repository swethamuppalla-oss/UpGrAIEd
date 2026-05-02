export default function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid rgba(110,220,95,0.15)',
        borderTop: '3px solid #6EDC5F',
        animation: 'bloom-spin-slow 0.9s linear infinite',
      }} />
    </div>
  )
}
