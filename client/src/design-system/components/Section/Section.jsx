import './Section.scss';

export default function Section({ variant = 'light', width = 'default', spacing = 'md', as: Tag = 'section', className = '', id, children, ...rest }) {
  const classes = [
    'section',
    variant,
    `spacing-${spacing}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const innerClass = width === 'default' ? 'section__inner' : `section__inner--${width}`;

  return (
    <Tag id={id} className={classes} {...rest}>
      <div className={innerClass}>
        {children}
      </div>
    </Tag>
  );
}
