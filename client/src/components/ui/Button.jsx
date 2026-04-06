const variants = {
  primary:   'grad-bg text-white font-semibold hover:opacity-90',
  secondary: 'surface text-[var(--text)] hover:bg-white/10',
  ghost:     'text-[var(--text2)] hover:text-[var(--text)] hover:bg-white/5',
  danger:    'bg-red-600 text-white hover:bg-red-700',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5
      text-sm transition-all duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : null}
    {children}
  </button>
);

export default Button;
