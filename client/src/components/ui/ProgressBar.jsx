const ProgressBar = ({ percent = 0, className = '' }) => (
  <div className={`h-2 w-full rounded-full bg-white/10 overflow-hidden ${className}`}>
    <div
      className="h-full rounded-full grad2-bg transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
    />
  </div>
);

export default ProgressBar;
