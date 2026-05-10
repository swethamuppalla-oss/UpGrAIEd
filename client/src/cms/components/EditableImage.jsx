import { useRef, useState, useEffect } from 'react'
import { useCMS } from '../hooks/useCMS'
import { parseContentKey } from '../utils/cmsHelpers'
import { uploadMedia } from '../../services'

const PLACEHOLDER = '/placeholder.png'

/**
 * Image element that loads its URL from the CMS DB and supports inline replacement.
 *
 * Usage:
 *   <EditableImage contentKey="home.hero.backgroundImage" alt="Hero" style={{ width: '100%' }} />
 */
export default function EditableImage({
  contentKey,
  fallback = PLACEHOLDER,
  alt = '',
  style,
  className,
  children,
}) {
  const { editMode, isAdmin, getValue, saveField, loadPage } = useCMS()
  const inputRef   = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved]         = useState(false)
  const [hovered, setHovered]     = useState(false)

  useEffect(() => {
    if (!contentKey) return
    try {
      const { page } = parseContentKey(contentKey)
      loadPage(page)
    } catch {}
  }, [contentKey, loadPage])

  const src = contentKey ? getValue(contentKey, fallback) : fallback

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !contentKey) return
    setUploading(true)
    try {
      const result = await uploadMedia(file)
      const url = result?.url || result?.fileUrl || result
      await saveField(contentKey, url)
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      console.error('[CMS EditableImage] upload error:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // View mode
  if (!editMode || !isAdmin) {
    if (children) return <>{children}</>
    return (
      <img
        src={src || fallback}
        alt={alt}
        style={style}
        className={className}
        onError={e => { e.target.src = PLACEHOLDER }}
      />
    )
  }

  const borderColor = saved ? '#6EDC5F' : uploading ? '#F59E0B' : 'rgba(139,92,246,0.65)'
  const glowColor   = saved
    ? 'rgba(110,220,95,0.18)'
    : uploading ? 'rgba(245,158,11,0.15)' : 'rgba(139,92,246,0.12)'

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: uploading ? 'wait' : 'pointer',
        ...style,
      }}
      className={className}
      onClick={() => !uploading && inputRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Click to replace image"
    >
      {children || (
        <img
          src={src || fallback}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
      )}

      {/* Hover / upload overlay */}
      {(hovered || uploading) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: hovered ? 'rgba(6,3,18,0.62)' : 'rgba(6,3,18,0.45)',
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 0 0 3px ${glowColor}`,
          borderRadius: style?.borderRadius || 8,
          gap: 6,
          pointerEvents: 'none',
          transition: 'background 0.15s',
        }}>
          <span style={{ fontSize: 22 }}>
            {uploading ? '⏳' : saved ? '✓' : '🖼'}
          </span>
          <span style={{
            color: saved ? '#6EDC5F' : uploading ? '#FDE68A' : '#E9D5FF',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
          }}>
            {uploading ? 'Uploading…' : saved ? 'Saved!' : 'Click to replace'}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
