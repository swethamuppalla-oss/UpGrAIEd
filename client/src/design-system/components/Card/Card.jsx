import './Card.scss';

export default function Card({ variant = 'default', padding = 'md', interactive = false, as: Tag = 'div', className = '', children, ...rest }) {
  const classes = [
    'card',
    variant,
    padding,
    interactive && 'interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      role={interactive && Tag === 'div' ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
