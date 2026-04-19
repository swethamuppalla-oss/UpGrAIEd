export default function LoadingSkeleton({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  style = {}
}) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

export function SkeletonCard({ height = '120px', style = {} }) {
  return (
    <LoadingSkeleton
      height={height}
      borderRadius="12px"
      style={{ ...style }}
    />
  )
}
