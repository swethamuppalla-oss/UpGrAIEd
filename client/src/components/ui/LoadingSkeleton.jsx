const LoadingSkeleton = ({
  width = '100%',
  height = 16,
  borderRadius = 12,
  style = {},
  className = '',
}) => (
  <div
    className={`animate-pulse ${className}`.trim()}
    style={{
      width,
      height,
      borderRadius,
      background: 'rgba(255, 255, 255, 0.08)',
      ...style,
    }}
  />
);

export default LoadingSkeleton;
