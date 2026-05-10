import { useState } from 'react'
import { useCMS } from '../hooks/useCMS'
import EditOutline from './EditOutline'

/**
 * Wraps any element with admin edit affordances (purple hover outline).
 * Renders children as-is in view mode; adds overlay in edit mode.
 */
export default function EditableWrapper({
  children,
  label,
  onEdit,
  style,
  className,
  as: Tag = 'div',
}) {
  const { editMode, isAdmin } = useCMS()
  const [hovered, setHovered] = useState(false)

  if (!editMode || !isAdmin) {
    return (
      <Tag style={style} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      style={{ position: 'relative', ...style }}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <EditOutline visible={hovered} label={label} onEdit={onEdit} />
    </Tag>
  )
}
