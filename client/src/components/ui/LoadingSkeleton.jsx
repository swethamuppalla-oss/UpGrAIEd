export default function LoadingSkeleton({ width = '100%', height = 20, borderRadius = 8 }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.5s ease-in-out infinite',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}

export function SkeletonText({ lines = 3, gap = 8 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ height = 120 }) {
  return (
    <div className="glass-card" style={{ padding: 20, height }}>
      <LoadingSkeleton height={height - 40} />
    </div>
  )
}

export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 16,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={100} />
      ))}
    </div>
  )
}
