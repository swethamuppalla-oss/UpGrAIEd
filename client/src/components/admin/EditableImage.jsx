import { useRef, useState } from 'react'
import { useEditMode } from '../../context/EditModeContext'
import { uploadMedia } from '../../services'

const PLACEHOLDER = '/placeholder.png'

function SafeImg({ src, alt, style, className }) {
  return (
    <img
      src={src || PLACEHOLDER}
      alt={alt}
      style={style}
      className={className}
      onError={(e) => { e.target.src = PLACEHOLDER }}
    />
  )
}

export default function EditableImage({ src, alt, onChange, style, className, children }) {
  const { editMode, isAdmin } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadMedia(file)
      onChange(result?.url || result?.fileUrl || result)
    } catch (err) {
      console.error('[EditableImage] upload failed:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (!editMode || !isAdmin) {
    if (children) return <>{children}</>
    return <SafeImg src={src} alt={alt} style={style} className={className} />
  }

  return (
    <div
      style={{
        position: 'relative', display: 'inline-block',
        cursor: uploading ? 'not-allowed' : 'pointer',
        ...style,
      }}
      className={className}
      onClick={() => !uploading && inputRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children || <SafeImg src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: hovered ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
        outline: `2px dashed ${hovered ? '#A8F5A2' : '#6EDC5F'}`,
        borderRadius: style?.borderRadius || '8px',
        gap: '6px',
        pointerEvents: 'none',
        transition: 'background 0.15s, outline-color 0.15s',
      }}>
        <span style={{ fontSize: '22px' }}>📷</span>
        <span style={{ color: hovered ? '#A8F5A2' : '#6EDC5F', fontSize: '13px', fontWeight: 600, transition: 'color 0.15s' }}>
          {uploading ? 'Uploading…' : 'Click to replace'}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
