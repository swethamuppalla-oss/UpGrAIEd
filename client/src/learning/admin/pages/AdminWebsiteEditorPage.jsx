import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCmsAllSections,
  updateCmsSection,
  toggleCmsSection,
  reorderCmsSections,
} from '../../../services/index.js'

// ── Shared inline styles ───────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#08060F',
    color: '#F0EEF8',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  topBar: {
    height: 60, borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', background: 'rgba(8,6,15,0.95)', backdropFilter: 'blur(16px)',
    position: 'sticky', top: 0, zIndex: 50,
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 32px' },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: '24px 28px',
    marginBottom: 16,
  },
  label: {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: 'rgba(240,238,248,0.45)', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 8,
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 14px',
    color: '#F0EEF8', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 14px',
    color: '#F0EEF8', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    resize: 'vertical', minHeight: 80,
    transition: 'border-color 0.2s',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3DAA3A, #6EDC5F)',
    border: 'none', color: '#06040F',
    fontSize: 13, fontWeight: 700,
    padding: '10px 22px', borderRadius: 8,
    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
  },
  btnGhost: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(240,238,248,0.7)',
    fontSize: 13, fontWeight: 500,
    padding: '10px 18px', borderRadius: 8,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  btnDanger: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#EF4444',
    fontSize: 12, fontWeight: 600,
    padding: '6px 12px', borderRadius: 6,
    cursor: 'pointer', transition: 'all 0.15s',
  },
}

const SECTION_LABELS = {
  hero:         'Hero',
  bloom:        'Bloom Showcase',
  learningFlow: 'Learning Flow',
  ecosystem:    'Ecosystem',
  parentTrust:  'Parent Trust',
  cta:          'Call to Action',
}

const FIELD_LABEL = {
  title:           'Headline',
  subtitle:        'Subtitle / Description',
  primaryCTA:      'Primary Button Label',
  secondaryCTA:    'Secondary Button Label',
  primaryCTALink:  'Primary Button Link',
  secondaryCTALink:'Secondary Button Link',
  backgroundImage: 'Background Image URL',
}

// ── Toast helper ────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([])
  const show = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  return { toasts, show }
}

function ToastStack({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(61,170,58,0.9)',
          color: '#fff', fontSize: 13, fontWeight: 500,
          padding: '12px 20px', borderRadius: 10,
          backdropFilter: 'blur(8px)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {t.type === 'error' ? '⚠ ' : '✓ '}{t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Single section editor ───────────────────────────────────────────────────────
function SectionEditor({ section, page, onSaved, onToggle, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [form, setForm] = useState(() => ({ ...section }))
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { toasts, show } = useToast()

  useEffect(() => { setForm({ ...section }) }, [section])

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCmsSection(page, section.section, form)
      show('Section saved')
      onSaved()
    } catch {
      show('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async () => {
    try {
      await toggleCmsSection(page, section.section, !section.enabled)
      onToggle()
    } catch {
      show('Toggle failed', 'error')
    }
  }

  const TEXT_FIELDS = ['title', 'subtitle', 'primaryCTA', 'secondaryCTA', 'primaryCTALink', 'secondaryCTALink', 'backgroundImage']

  return (
    <>
      <ToastStack toasts={toasts} />
      <div style={{
        ...S.card,
        opacity: section.enabled ? 1 : 0.5,
        borderColor: section.enabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: expanded ? 24 : 0 }}>
          {/* Reorder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              style={{ ...S.btnGhost, padding: '4px 8px', opacity: isFirst ? 0.3 : 1, fontSize: 12 }}
            >▲</button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              style={{ ...S.btnGhost, padding: '4px 8px', opacity: isLast ? 0.3 : 1, fontSize: 12 }}
            >▼</button>
          </div>

          {/* Order badge */}
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#6EDC5F',
            flexShrink: 0,
          }}>
            {section.order || '—'}
          </div>

          {/* Label */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F0EEF8' }}>
              {SECTION_LABELS[section.section] || section.section}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.35)', marginTop: 2 }}>
              /{section.section}
            </div>
          </div>

          {/* Enabled toggle */}
          <button
            onClick={handleToggle}
            style={{
              ...S.btnGhost,
              fontSize: 12,
              borderColor: section.enabled ? 'rgba(110,220,95,0.3)' : 'rgba(255,255,255,0.1)',
              color: section.enabled ? '#6EDC5F' : 'rgba(240,238,248,0.4)',
            }}
          >
            {section.enabled ? '● Visible' : '○ Hidden'}
          </button>

          {/* Expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ ...S.btnGhost, padding: '8px 14px' }}
          >
            {expanded ? 'Collapse ↑' : 'Edit ↓'}
          </button>
        </div>

        {/* Editable fields */}
        {expanded && (
          <div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
              {TEXT_FIELDS.map(key => {
                const isLong = key === 'subtitle'
                return (
                  <div key={key} style={{ gridColumn: isLong ? '1/-1' : 'auto' }}>
                    <label style={S.label}>{FIELD_LABEL[key] || key}</label>
                    {isLong ? (
                      <textarea
                        style={S.textarea}
                        value={form[key] || ''}
                        onChange={e => setField(key, e.target.value)}
                        onFocus={e => { e.target.style.borderColor = 'rgba(110,220,95,0.4)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      />
                    ) : (
                      <input
                        style={S.input}
                        value={form[key] || ''}
                        onChange={e => setField(key, e.target.value)}
                        onFocus={e => { e.target.style.borderColor = 'rgba(110,220,95,0.4)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Metadata editor */}
            {section.metadata && Object.keys(section.metadata).length > 0 && (
              <MetadataEditor
                metadata={form.metadata || {}}
                onChange={md => setField('metadata', md)}
              />
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Save Section'}
              </button>
              <button
                onClick={() => setForm({ ...section })}
                style={S.btnGhost}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ── Metadata editor (features, steps, products, stats, testimonials) ───────────
function MetadataEditor({ metadata, onChange }) {
  const keys = Object.keys(metadata)

  const updateArray = (arrayKey, idx, field, value) => {
    const arr = [...(metadata[arrayKey] || [])]
    arr[idx] = { ...arr[idx], [field]: value }
    onChange({ ...metadata, [arrayKey]: arr })
  }

  const addItem = (arrayKey, template) => {
    const arr = [...(metadata[arrayKey] || []), template]
    onChange({ ...metadata, [arrayKey]: arr })
  }

  const removeItem = (arrayKey, idx) => {
    const arr = (metadata[arrayKey] || []).filter((_, i) => i !== idx)
    onChange({ ...metadata, [arrayKey]: arr })
  }

  const TEMPLATES = {
    features: { icon: '🔹', title: '', description: '' },
    steps: { number: '05', title: '', description: '' },
    products: { name: '', tagline: '', description: '', status: 'Coming Soon', statusColor: '#7B3FE4', link: '/', accent: '#7B3FE4' },
    stats: { value: '', label: '' },
    testimonials: { quote: '', name: '', role: '' },
  }

  return (
    <div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />
      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,238,248,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        Content Arrays
      </div>

      {keys.map(arrayKey => {
        const items = metadata[arrayKey]
        if (!Array.isArray(items)) return null
        return (
          <div key={arrayKey} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F0EEF8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              {arrayKey}
              <button
                onClick={() => addItem(arrayKey, TEMPLATES[arrayKey] || {})}
                style={{ ...S.btnGhost, padding: '4px 10px', fontSize: 11 }}
              >
                + Add
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '16px 18px',
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(240,238,248,0.3)' }}>#{idx + 1}</span>
                  <button onClick={() => removeItem(arrayKey, idx)} style={S.btnDanger}>✕ Remove</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {Object.keys(item).map(field => (
                    <div key={field} style={{ gridColumn: field === 'description' || field === 'quote' ? '1/-1' : 'auto' }}>
                      <label style={S.label}>{field}</label>
                      {field === 'description' || field === 'quote' ? (
                        <textarea
                          style={{ ...S.textarea, minHeight: 60 }}
                          value={item[field] || ''}
                          onChange={e => updateArray(arrayKey, idx, field, e.target.value)}
                        />
                      ) : (
                        <input
                          style={S.input}
                          value={item[field] || ''}
                          onChange={e => updateArray(arrayKey, idx, field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
const PAGES = [
  { key: 'home', label: 'Brand Home' },
]

export default function AdminWebsiteEditorPage() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('home')
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const { toasts, show } = useToast()

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCmsAllSections(activePage)
      setSections(data)
    } catch {
      show('Failed to load sections', 'error')
    } finally {
      setLoading(false)
    }
  }, [activePage])

  useEffect(() => { fetchSections() }, [fetchSections])

  const moveSection = async (idx, direction) => {
    const next = [...sections]
    const target = idx + direction
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    const reordered = next.map((s, i) => ({ ...s, order: i + 1 }))
    setSections(reordered)
    try {
      await reorderCmsSections(activePage, reordered)
      show('Order saved')
    } catch {
      show('Reorder failed', 'error')
      fetchSections()
    }
  }

  return (
    <div style={S.page}>
      <ToastStack toasts={toasts} />

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/dashboard/admin')}
            style={{ ...S.btnGhost, padding: '6px 12px', fontSize: 12 }}
          >
            ← Admin
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#F0EEF8' }}>
            Website Editor
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.open('/brand', '_blank')}
            style={S.btnGhost}
          >
            Preview Site ↗
          </button>
        </div>
      </div>

      <div style={S.container}>
        {/* Page selector */}
        <div style={{ marginBottom: 32, display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 24 }}>
          {PAGES.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              style={{
                ...S.btnGhost,
                borderColor: activePage === p.key ? 'rgba(110,220,95,0.3)' : 'rgba(255,255,255,0.1)',
                color: activePage === p.key ? '#6EDC5F' : 'rgba(240,238,248,0.6)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F0EEF8', marginBottom: 6 }}>
            {PAGES.find(p => p.key === activePage)?.label} Sections
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(240,238,248,0.4)' }}>
            Edit content, toggle visibility, and reorder sections. Changes go live immediately.
          </p>
        </div>

        {/* Sections list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(240,238,248,0.3)' }}>
            Loading sections…
          </div>
        ) : sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(240,238,248,0.3)' }}>
            No sections found for this page.
          </div>
        ) : (
          sections.map((section, idx) => (
            <SectionEditor
              key={section.section || idx}
              section={section}
              page={activePage}
              onSaved={fetchSections}
              onToggle={fetchSections}
              onMoveUp={() => moveSection(idx, -1)}
              onMoveDown={() => moveSection(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === sections.length - 1}
            />
          ))
        )}
      </div>
    </div>
  )
}
