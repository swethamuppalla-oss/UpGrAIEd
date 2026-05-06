import './Button.scss';

export default function Button({ label, variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled = false, as: Tag = 'button', className = '', children, ...rest }) {
  const classes = [
    'btn',
    variant,
    size,
    fullWidth && 'full-width',
    loading && 'loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {label ?? children}
    </Tag>
  );
}
