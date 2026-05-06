import { useState } from 'react'
import MediaUploader from '../components/common/MediaUploader'
import { getContent, updateContent } from '../services'

const SECTIONS = ['hero', 'faq', 'trust', 'pricing', 'whyUpgraied']

export default function AdminContentEditor() {
  const [section, setSection] = useState('hero')
  const [jsonData, setJsonData] = useState('')
  const [status, setStatus] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const handleLoad = async () => {
    setStatus(null)
    try {
      const data = await getContent(section)
      setJsonData(JSON.stringify(data, null, 2))
      setStatus({ msg: 'Loaded.', ok: true })
    } catch (err) {
      setStatus({ msg: `Failed to load: ${err.message}`, ok: false })
    }
  }

  const handleUpdate = async () => {
    setStatus(null)
    let parsed
    try {
      parsed = JSON.parse(jsonData)
    } catch {
      setStatus({ msg: 'Invalid JSON. Fix syntax errors before saving.', ok: false })
      return
    }

    try {
      const data = await updateContent(section, parsed)
      setStatus({ msg: data?.message || 'Saved successfully.', ok: true })
    } catch (err) {
      setStatus({ msg: err.message || 'Save failed.', ok: false })
    }
  }

  return (
    <div className="admin-surface" style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Content Editor</h1>
        <p style={{ fontSize: 14 }}>
          Edit page content by section. Changes go live immediately once saved.
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        marginBottom: 16,
        padding: '16px 20px',
        background: 'var(--color-surface)',
        borderRadius: 12,
        border: '1px solid rgba(13,35,24,0.08)',
      }}>
        <select
          className="admin-select"
          value={section}
          onChange={e => {
            setSection(e.target.value)
            setStatus(null)
            setJsonData('')
            setUploadStatus(null)
            setUploadedUrl('')
          }}
        >
          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button className="admin-btn admin-btn-ghost" onClick={handleLoad}>Load</button>
        <button className="admin-btn admin-btn-primary" onClick={handleUpdate}>Save</button>

        {status && (
          <span className={`admin-status ${status.ok ? 'admin-status-ok' : 'admin-status-err'}`}>
            {status.msg}
          </span>
        )}
      </div>

      <textarea
        className="admin-input"
        value={jsonData}
        onChange={e => setJsonData(e.target.value)}
        rows={22}
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 1.65,
          resize: 'vertical',
        }}
        placeholder={`Click "Load" to fetch the current "${section}" content, then edit and click "Save"`}
      />

      <div style={{
        marginTop: 40,
        padding: '24px 28px',
        background: 'var(--color-surface)',
        borderRadius: 16,
        border: '1px solid rgba(13,35,24,0.08)',
      }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Upload Image</h2>
        <p style={{ fontSize: 13, marginBottom: 20 }}>
          Upload an image and paste the returned URL into your content JSON.
        </p>

        <MediaUploader
          section={section}
          accept="image/jpeg,image/png,image/webp,image/gif"
          onUpload={(data) => {
            setUploadedUrl(data.url)
            setUploadStatus({ msg: 'Uploaded successfully.', ok: true })
          }}
        />

        {uploadStatus && (
          <span className={`admin-status ${uploadStatus.ok ? 'admin-status-ok' : 'admin-status-err'}`} style={{ marginTop: 14 }}>
            {uploadStatus.msg}
          </span>
        )}

        {uploadedUrl && (
          <div style={{ marginTop: 20 }}>
            <input
              className="admin-input"
              readOnly
              value={uploadedUrl}
              onClick={e => {
                e.target.select()
                navigator.clipboard?.writeText(uploadedUrl)
              }}
              title="Click to copy"
              style={{ fontFamily: 'monospace', fontSize: 12, cursor: 'pointer' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
