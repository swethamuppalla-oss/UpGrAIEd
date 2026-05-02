export default function Error({ message = 'Something went wrong.' }) {
  return (
    <div style={{
      padding: '16px 20px', borderRadius: 10,
      background: 'rgba(255,138,101,0.1)', border: '1px solid rgba(255,138,101,0.3)',
      color: '#FF8A65', fontSize: 14,
    }}>
      {message}
    </div>
  )
}
