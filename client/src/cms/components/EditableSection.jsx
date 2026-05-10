import { useState, useEffect } from 'react'
import { useCMS } from '../hooks/useCMS'
import * as cmsService from '../services/cmsService'

/**
 * Section-level CMS wrapper that shows visibility controls in edit mode.
 * Wraps any page section with a toggle (visible/hidden) and settings chip.
 *
 * Usage:
 *   <EditableSection page="home" section="hero" as="section" className="hero-section">
 *     ...children...
 *   </EditableSection>
 */
export default function EditableSection({
  page,
  section,
  children,
  style,
  className,
  as: Tag = 'section',
}) {
  const { editMode, isAdmin, sections, updateSectionCache, loadPage } = useCMS()
  const [hovered, setHovered] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => { if (page) loadPage(page) }, [page, loadPage])

  const sectionData = sections[page]?.[section]
  const isEnabled = sectionData?.enabled ?? true

  const handleToggle = async () => {
    if (toggling) return
    setToggling(true)
    try {
      await cmsService.toggleSection(page, section, !isEnabled)
      updateSectionCache(page, section, { enabled: !isEnabled })
    } catch (err) {
      console.error('[EditableSection] toggle failed:', err)
    } finally {
      setToggling(false)
    }
  }

  if (!editMode || !isAdmin) {
    return (
      <Tag style={style} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      style={{
        position: 'relative',
        outline: hovered ? '1.5px solid rgba(139,92,246,0.3)' : '1.5px solid transparent',
        transition: 'outline 0.2s',
        ...style,
      }}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Section controls — appear on hover */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          gap: 6,
          zIndex: 50,
        }}>
          {/* Section label chip */}
          <div style={chipSt}>
            ⬡ {section}
          </div>

          {/* Visibility toggle */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={isEnabled ? 'Hide this section' : 'Show this section'}
            style={{
              ...chipSt,
              cursor: 'pointer',
              border: 'none',
              background: isEnabled
                ? 'rgba(110,220,95,0.12)'
                : 'rgba(239,68,68,0.12)',
              color: isEnabled ? '#6EDC5F' : '#FCA5A5',
              borderRadius: 8,
            }}
          >
            {toggling ? '…' : isEnabled ? '● Visible' : '○ Hidden'}
          </button>
        </div>
      )}
    </Tag>
  )
}

const chipSt = {
  background: 'rgba(6,3,18,0.88)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(139,92,246,0.35)',
  color: '#C4B5FD',
  borderRadius: 8,
  padding: '4px 11px',
  fontSize: 11,
  fontWeight: 600,
  fontFamily: 'system-ui, sans-serif',
  letterSpacing: '0.3px',
  userSelect: 'none',
}
