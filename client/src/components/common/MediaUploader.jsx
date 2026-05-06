import { useMemo, useState } from 'react'
import { uploadMedia } from '../../services'

export default function MediaUploader({ section = 'general', accept = 'image/*,video/*', onUpload }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [media, setMedia] = useState(null)

  const isVideo = useMemo(
    () => media?.type === 'video' || /\.(mp4|webm|mov)$/i.test(media?.url || ''),
    [media]
  )

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')
    try {
      const res = await uploadMedia(file, section)
      setMedia(res)
      onUpload?.(res)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="card media-uploader">
      <label className="media-uploader__button">
        {loading ? 'Uploading...' : 'Choose media'}
        <input type="file" accept={accept} disabled={loading} onChange={handleUpload} />
      </label>

      {error && <p className="media-uploader__error">{error}</p>}

      {media?.url && (
        <div className="media-uploader__preview">
          {isVideo ? (
            <video src={media.url} controls />
          ) : (
            <img src={media.url} alt={`${section} upload preview`} />
          )}
          <input readOnly value={media.url} onClick={(e) => e.target.select()} />
        </div>
      )}
    </div>
  )
}
