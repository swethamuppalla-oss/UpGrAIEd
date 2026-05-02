import { useState } from 'react'
import api, { uploadMedia } from '../services/api'

const API = import.meta.env.VITE_API_URL || ''

const SECTIONS = ['whyUpgraied', 'faq', 'trust']

export default function AdminContentEditor() {
  const [section, setSection]     = useState('whyUpgraied')
  const [jsonData, setJsonData]   = useState('')
  const [status, setStatus]       = useState('')
  const [uploading, setUploading]       = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadedUrl, setUploadedUrl]   = useState('')

  const handleLoad = async () => {
    setStatus('')
    try {
      const res = await fetch(`${API}/api/content/${section}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setJsonData(JSON.stringify(data, null, 2))
      setStatus('Loaded.')
    } catch (err) {
      setStatus(`Failed to load: ${err.message}`)
    }
  }

  const handleUpdate = async () => {
    setStatus('')
    let parsed
    try {
      parsed = JSON.parse(jsonData)
    } catch {
      setStatus('Invalid JSON — fix syntax errors before saving.')
      return
    }
    try {
      const res = await api.put(`/api/content/${section}`, parsed)
      setStatus(res.data?.message || 'Updated.')
    } catch (err) {
      setStatus(err?.response?.data?.error || err?.response?.data?.message || 'Update failed.')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadStatus('')
    setUploadedUrl('')
    try {
      const data = await uploadMedia(file)
      setUploadedUrl(data.url)
      setUploadStatus('Uploaded.')
    } catch (err) {
      const msg = err?.response?.data?.error || 'Upload failed.'
      setUploadStatus(msg)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A1F12', color: '#F0FFF4',
      fontFamily: "'Inter', sans-serif", padding: '40px 32px',
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Content Editor</h1>
      <p style={{ color: 'rgba(168,245,162,0.55)', marginBottom: 32, fontSize: 14 }}>
        Edit growth page content. Changes are live immediately (in-memory until DB is wired).
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <select
          value={section}
          onChange={e => setSection(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(110,220,95,0.25)',
            color: '#F0FFF4', borderRadius: 8, padding: '8px 12px', fontSize: 14,
          }}
        >
          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={handleLoad} style={btnStyle('#1C3726')}>Load</button>
        <button onClick={handleUpdate} style={btnStyle('#6EDC5F', '#0A1F12')}>Update</button>
        {status && <span style={{ fontSize: 13, color: 'rgba(168,245,162,0.7)' }}>{status}</span>}
      </div>

      <textarea
        value={jsonData}
        onChange={e => setJsonData(e.target.value)}
        rows={20}
        style={{
          width: '100%', maxWidth: 720, display: 'block',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,220,95,0.2)',
          color: '#F0FFF4', borderRadius: 10, padding: 16,
          fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, resize: 'vertical',
        }}
        placeholder='Click "Load" to fetch current content, then edit and click "Update"'
      />

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Upload Image</h2>
        <p style={{ color: 'rgba(168,245,162,0.55)', fontSize: 13, marginBottom: 16 }}>
          Upload an image to Firebase Storage and copy the URL into your content JSON.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={handleImageUpload}
          style={{ color: '#F0FFF4', opacity: uploading ? 0.5 : 1 }}
        />
        {uploading && (
          <span style={{ marginLeft: 12, fontSize: 13, color: 'rgba(168,245,162,0.7)' }}>Uploading...</span>
        )}
        {!uploading && uploadStatus && (
          <span style={{
            marginLeft: 12, fontSize: 13,
            color: uploadStatus.startsWith('Upload') && uploadStatus !== 'Uploaded.'
              ? '#FF8A65' : 'rgba(168,245,162,0.7)',
          }}>{uploadStatus}</span>
        )}
        {uploadedUrl && (
          <div style={{ marginTop: 12 }}>
            <input
              readOnly
              value={uploadedUrl}
              onClick={e => e.target.select()}
              style={{
                width: '100%', maxWidth: 720, display: 'block',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(110,220,95,0.3)',
                color: '#A8F5A2', borderRadius: 8, padding: '8px 12px',
                fontFamily: 'monospace', fontSize: 12,
              }}
            />
            <img
              src={uploadedUrl}
              alt="uploaded"
              style={{ marginTop: 12, maxWidth: 320, borderRadius: 8, border: '1px solid rgba(110,220,95,0.2)' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function btnStyle(bg, color = '#F0FFF4') {
  return {
    background: bg, color, border: '1px solid rgba(110,220,95,0.3)',
    borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
  }
}
