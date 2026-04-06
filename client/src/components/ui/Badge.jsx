const colors = {
  orange: 'bg-orange/20 text-orange border-orange/30',
  purple: 'bg-purple/20 text-purple border-purple/30',
  pink:   'bg-pink/20   text-pink   border-pink/30',
  green:  'bg-green-500/20 text-green-400 border-green-500/30',
  gray:   'bg-white/10  text-[var(--text2)] border-white/10',
};

const Badge = ({ children, color = 'purple', className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[color]} ${className}`}>
    {children}
  </span>
);

export default Badge;
