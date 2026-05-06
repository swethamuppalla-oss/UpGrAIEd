import { useState } from 'react'
import { useEditMode } from '../../context/EditModeContext'

const baseEditStyle = {
  background: 'rgba(110,220,95,0.08)',
  border: '2px dashed #6EDC5F',
  borderRadius: '6px',
  color: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  fontFamily: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  padding: '4px 8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'background 0.15s, border-color 0.15s',
}

const hoverStyle = {
  background: 'rgba(110,220,95,0.14)',
  borderColor: '#A8F5A2',
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  maxLength,
  style,
  className,
}) {
  const { editMode, isAdmin } = useEditMode()
  const [hovered, setHovered] = useState(false)

  if (!editMode || !isAdmin) {
    return <span style={style} className={className}>{value}</span>
  }

  const resolvedMax = maxLength ?? (multiline ? 500 : 120)
  const combined = {
    ...baseEditStyle,
    ...(hovered ? hoverStyle : {}),
    ...style,
  }

  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (multiline) {
    return (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        maxLength={resolvedMax}
        rows={3}
        style={{ ...combined, resize: 'vertical', display: 'block', cursor: 'text' }}
        className={className}
        {...hoverProps}
      />
    )
  }

  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      maxLength={resolvedMax}
      style={{ ...combined, cursor: 'text' }}
      className={className}
      {...hoverProps}
    />
  )
}
