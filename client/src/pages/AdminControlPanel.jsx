import React, { useState, useEffect, useRef } from 'react';
import { useConfigState } from '../hooks/useConfigValue';
import { getConfigByKey, uploadMedia } from '../services/api';
import { useToast } from '../components/ui/Toast';

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    id: 'mascot',
    label: '🌿 Mascot',
    fields: [
      { path: 'bloom.main_image', label: 'Bloom Main Image URL', type: 'url', placeholder: 'https://...' },
      { path: 'bloom.avatar',     label: 'Bloom Avatar URL',     type: 'url', placeholder: 'https://...' },
    ],
  },
  {
    id: 'ui',
    label: '🎨 UI & Design',
    fields: [
      { path: 'hero.title',       label: 'Hero Title Override',    type: 'text',     placeholder: 'Leave empty to use default' },
      { path: 'hero.subtitle',    label: 'Hero Subtitle Override', type: 'textarea', placeholder: 'Leave empty to use default' },
      { path: 'hero.cta_primary', label: 'Primary CTA Text',       type: 'text',     placeholder: 'Book Free Demo' },
    ],
  },
  { id: 'website',    label: '🌐 Website',    json: true },
  { id: 'curriculum', label: '📚 Curriculum',  json: true },
  { id: 'pricing',    label: '💰 Pricing',     json: true },
  { id: 'bloom',      label: '🤖 Bloom AI',    json: true },
  { id: 'media',      label: '🖼️ Media',       media: true },
];

// ── Utilities ─────────────────────────────────────────────────────────────────
function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? '' : o[k]), obj) ?? ''
}

function setNested(obj, path, value) {
  const keys = path.split('.')
  const out  = { ...obj }
  let cur    = out
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return out
}

function safeJsonParse(str) {
  try { return { data: JSON.parse(str), error: null } }
  catch (e) { return { data: null, error: e.message } }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminControlPanel() {
  const [activeTab, setActiveTab]       = useState('mascot')
  const [formData, setFormData]         = useState({})
  const [jsonText, setJsonText]         = useState('')
  const [jsonError, setJsonError]       = useState(null)
  const [loading, setLoading]           = useState(false)
  const [saving, setSaving]             = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadedUrl, setUploadedUrl]   = useState(null)

  const { updateConfig } = useConfigState()
  const { showToast }    = useToast()
  const fileInputRef     = useRef(null)

  const tab = TABS.find(t => t.id === activeTab)

  // Load config when switching tabs
  useEffect(() => {
    if (tab?.media) return
    setLoading(true)
    setJsonError(null)
    getConfigByKey(activeTab)
      .then(data => {
        const d = data || {}
        setFormData(d)
        setJsonText(JSON.stringify(d, null, 2))
      })
      .catch(() => {
        setFormData({})
        setJsonText('{}')
      })
      .finally(() => setLoading(false))
  }, [activeTab])

  // Sync JSON textarea → formData
  const handleJsonChange = (text) => {
    setJsonText(text)
    const { data, error } = safeJsonParse(text)
    setJsonError(error)
    if (data) setFormData(data)
  }

  const handleFieldChange = (path, value) => {
    setFormData(prev => {
      const next = setNested(prev, path, value)
      setJsonText(JSON.stringify(next, null, 2))
      return next
    })
  }

  const handleSave = async () => {
    if (jsonError) {
      showToast('Fix JSON errors before saving', 'error')
      return
    }
    setSaving(true)
    try {
      await updateConfig(activeTab, formData)
      showToast(`${tab?.label} saved successfully`, 'success')
    } catch {
      showToast('Save failed — please try again', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadProgress(0)
    setUploadedUrl(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await uploadMedia(form, (pct) => setUploadProgress(pct))
      setUploadedUrl(res.url)
      showToast('File uploaded', 'success')
    } catch {
      showToast('Upload failed', 'error')
    } finally {
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const copyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl)
      showToast('URL copied to clipboard', 'success')
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A1F12', color: '#F0FFF4', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'rgba(22,43,31,0.95)',
        borderRight: '1px solid rgba(110,220,95,0.14)',
        padding: '24px 16px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '0 8px' }}>
          <span style={{ fontSize: 24 }}>🌿</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#A8F5A2' }}>CMS Control</span>
        </div>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 14px',
              borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === t.id ? 'rgba(110,220,95,0.18)' : 'transparent',
              color: activeTab === t.id ? '#A8F5A2' : 'rgba(168,245,162,0.55)',
              borderLeft: activeTab === t.id ? '3px solid #6EDC5F' : '3px solid transparent',
              transition: 'all 0.18s',
            }}
          >
            {t.label}
          </button>
        ))}
      </aside>

      {/* Main panel */}
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: 880 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#F0FFF4' }}>{tab?.label}</h1>
            <p style={{ color: 'rgba(168,245,162,0.5)', fontSize: 13, margin: '4px 0 0' }}>
              {tab?.json ? 'Edit raw JSON — changes are live after save.'
                : tab?.media ? 'Upload static assets for use across the platform.'
                : 'Update individual fields — leave blank to use built-in defaults.'}
            </p>
          </div>
          {!tab?.media && (
            <button
              onClick={handleSave}
              disabled={saving || !!jsonError}
              style={{
                padding: '10px 24px', borderRadius: 50, border: 'none',
                background: saving || jsonError ? 'rgba(110,220,95,0.2)' : 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
                color: saving || jsonError ? 'rgba(168,245,162,0.4)' : '#0A1F12',
                fontWeight: 800, fontSize: 14, cursor: saving || jsonError ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: saving || jsonError ? 'none' : '0 4px 16px rgba(110,220,95,0.3)',
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : tab?.media ? (
          <MediaTab
            fileInputRef={fileInputRef}
            uploadProgress={uploadProgress}
            uploadedUrl={uploadedUrl}
            onUpload={handleUpload}
            onCopy={copyUrl}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Structured fields for mascot / ui tabs */}
            {tab?.fields && (
              <div style={{
                background: 'rgba(22,43,31,0.7)', border: '1px solid rgba(110,220,95,0.12)',
                borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                {tab.fields.map(field => (
                  <FieldInput
                    key={field.path}
                    field={field}
                    value={getNested(formData, field.path)}
                    onChange={v => handleFieldChange(field.path, v)}
                  />
                ))}
              </div>
            )}

            {/* JSON editor for complex tabs */}
            {tab?.json && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(168,245,162,0.7)' }}>
                    JSON Config
                  </label>
                  {jsonError && (
                    <span style={{ fontSize: 12, color: '#FF8A65', fontWeight: 600 }}>
                      ⚠ {jsonError}
                    </span>
                  )}
                </div>
                <textarea
                  value={jsonText}
                  onChange={e => handleJsonChange(e.target.value)}
                  spellCheck={false}
                  style={{
                    width: '100%', height: 420, padding: 18,
                    background: 'rgba(10,26,16,0.9)',
                    border: `1px solid ${jsonError ? '#FF8A65' : 'rgba(110,220,95,0.2)'}`,
                    color: jsonError ? '#FFBDA0' : '#A8F5A2',
                    borderRadius: 12, fontSize: 13, fontFamily: '"Fira Code", monospace',
                    lineHeight: 1.7, resize: 'vertical', outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Also show JSON view for structured tabs as reference */}
            {tab?.fields && (
              <details style={{ marginTop: -4 }}>
                <summary style={{ cursor: 'pointer', fontSize: 12, color: 'rgba(168,245,162,0.4)', userSelect: 'none' }}>
                  View raw JSON
                </summary>
                <pre style={{
                  marginTop: 10, padding: 16, borderRadius: 10,
                  background: 'rgba(10,26,16,0.8)', border: '1px solid rgba(110,220,95,0.10)',
                  fontSize: 12, color: 'rgba(168,245,162,0.55)', overflowX: 'auto',
                }}>
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FieldInput({ field, value, onChange }) {
  const base = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'rgba(110,220,95,0.06)', border: '1px solid rgba(110,220,95,0.18)',
    color: '#F0FFF4', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }
  const onFocus = e => { e.target.style.borderColor = 'rgba(110,220,95,0.5)' }
  const onBlur  = e => { e.target.style.borderColor = 'rgba(110,220,95,0.18)' }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(168,245,162,0.75)', marginBottom: 6 }}>
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          onFocus={onFocus} onBlur={onBlur}
          rows={3}
          style={{ ...base, resize: 'vertical', lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          onFocus={onFocus} onBlur={onBlur}
          style={base}
        />
      )}
    </div>
  )
}

function MediaTab({ fileInputRef, uploadProgress, uploadedUrl, onUpload, onCopy }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
      <div style={{
        background: 'rgba(22,43,31,0.7)', border: '2px dashed rgba(110,220,95,0.25)',
        borderRadius: 16, padding: '40px 32px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
        <p style={{ color: 'rgba(168,245,162,0.65)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          Upload images, icons, or other assets.<br />
          The URL will be available to paste into any image field.
        </p>
        <label style={{
          display: 'inline-block', padding: '11px 28px', borderRadius: 50,
          background: 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
          color: '#0A1F12', fontWeight: 800, fontSize: 14, cursor: 'pointer',
        }}>
          {uploadProgress !== null ? `Uploading ${uploadProgress}%…` : 'Choose File'}
          <input
            ref={fileInputRef}
            type="file"
            onChange={onUpload}
            disabled={uploadProgress !== null}
            style={{ display: 'none' }}
            accept="image/*,video/*,.pdf"
          />
        </label>
      </div>

      {uploadProgress !== null && (
        <div style={{ background: 'rgba(22,43,31,0.7)', border: '1px solid rgba(110,220,95,0.15)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'rgba(168,245,162,0.7)' }}>
            <span>Uploading…</span><span>{uploadProgress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(110,220,95,0.15)' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #6EDC5F, #A8F5A2)', transition: 'width 0.3s' }} />
          </div>
        </div>
      )}

      {uploadedUrl && (
        <div style={{ background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.28)', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6EDC5F', marginBottom: 10 }}>✅ UPLOADED</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <code style={{
              flex: 1, padding: '9px 14px', borderRadius: 8,
              background: 'rgba(10,26,16,0.8)', border: '1px solid rgba(110,220,95,0.15)',
              color: '#A8F5A2', fontSize: 13, wordBreak: 'break-all',
            }}>
              {uploadedUrl}
            </code>
            <button
              onClick={onCopy}
              style={{
                padding: '9px 16px', borderRadius: 8, border: 'none',
                background: 'rgba(110,220,95,0.15)', color: '#6EDC5F',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0,
              }}
            >
              Copy
            </button>
          </div>
          {uploadedUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) && (
            <img src={uploadedUrl} alt="preview" style={{ marginTop: 14, maxWidth: '100%', maxHeight: 160, borderRadius: 8, objectFit: 'contain' }} />
          )}
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 56, borderRadius: 10,
          background: 'rgba(110,220,95,0.06)',
          animation: 'bloom-shimmer 1.5s linear infinite',
        }} />
      ))}
    </div>
  )
}
