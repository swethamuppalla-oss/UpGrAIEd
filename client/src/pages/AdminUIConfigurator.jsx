import React, { useState, useEffect, useRef } from 'react'
import { getConfigByKey, uploadMedia } from '../services'
import { useConfigState } from '../hooks/useConfigValue'
import { useToast } from '../components/ui/Toast'
import { DEFAULT_THEME } from '../config/defaults'
import { trackEvent } from '../utils/analytics'
import { PAGES_DEFAULT } from '../utils/uiValidation'
import { PALETTE_META, themeConfig } from '../theme/themeConfig'
import { setPalette } from '../theme/themeUtils'

// ── Utilities ─────────────────────────────────────────────────────────────────
const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function setNested(obj, path, value) {
  const keys = path.split('.')
  const out = { ...obj }
  let cur = out
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return out
}

// ── Shared style tokens ───────────────────────────────────────────────────────
const panel = {
  background: 'rgba(22,43,31,0.7)',
  border: '1px solid rgba(110,220,95,0.12)',
  borderRadius: 16,
  padding: 28,
  marginBottom: 24,
}

const inputBase = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(110,220,95,0.06)',
  border: '1px solid rgba(110,220,95,0.18)',
  color: '#F0FFF4',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const fieldLabel = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: 'rgba(168,245,162,0.65)',
  marginBottom: 6,
}

const sectionTitle = {
  fontSize: 14,
  fontWeight: 800,
  color: '#A8F5A2',
  marginBottom: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const fieldGroup = { marginBottom: 18 }

const hint = {
  fontSize: 11,
  color: 'rgba(168,245,162,0.35)',
  margin: '6px 0 0',
  lineHeight: 1.5,
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminUIConfigurator() {
  const [activeTab, setActiveTab] = useState('ui')
  const [uiConfig, setUiConfig] = useState({ hero: {}, brandName: 'UpGrAIEd', logo: '' })
  const [themeConfig, setThemeConfig] = useState({ ...DEFAULT_THEME })
  const [pagesConfig, setPagesConfig] = useState({ ...PAGES_DEFAULT })
  const [activePalette, setActivePalette] = useState(
    () => localStorage.getItem('upgraied_palette') || 'sage'
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [heroImgUploading, setHeroImgUploading] = useState(false)

  const { updateConfig } = useConfigState()
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([
      getConfigByKey('ui').catch(() => null),
      getConfigByKey('theme').catch(() => null),
      getConfigByKey('pages').catch(() => null),
    ]).then(([ui, theme, pages]) => {
      if (ui)    setUiConfig(prev => ({ ...prev, ...ui, hero: { ...(prev.hero || {}), ...(ui.hero || {}) } }))
      if (theme) setThemeConfig(prev => ({ ...prev, ...theme }))
      if (pages) setPagesConfig(prev => ({ ...prev, ...pages }))
      setLoading(false)
    })
  }, [])

  // Apply brand colors to CSS variables in real-time as admin adjusts pickers
  useEffect(() => {
    const root = document.documentElement
    if (themeConfig.primaryColor)   root.style.setProperty('--brand-primary',   themeConfig.primaryColor)
    if (themeConfig.accentColor)    root.style.setProperty('--brand-accent',     themeConfig.accentColor)
    if (themeConfig.highlightColor) root.style.setProperty('--brand-highlight',  themeConfig.highlightColor)
  }, [themeConfig.primaryColor, themeConfig.accentColor, themeConfig.highlightColor])

  // ── Pages helpers ──────────────────────────────────────────────────────────────
  const updatePageField = (page, path, value) => {
    setPagesConfig(prev => ({
      ...prev,
      [page]: setNested(prev[page] || {}, path, value),
    }))
  }

  const updatePageArray = (page, arrayKey, updater) => {
    setPagesConfig(prev => ({
      ...prev,
      [page]: { ...prev[page], [arrayKey]: updater(prev[page]?.[arrayKey] || []) },
    }))
  }

  const handleUiField = (path, value) => {
    setUiConfig(prev => setNested(prev, path, value))
  }

  const handleLogoUpload = async (file) => {
    setLogoUploading(true)
    try {
      const res = await uploadMedia(file)
      setUiConfig(prev => ({ ...prev, logo: res.url }))
      showToast('Logo uploaded', 'success')
    } catch {
      showToast('Logo upload failed', 'error')
    } finally {
      setLogoUploading(false)
    }
  }

  const handleHeroImageUpload = async (file) => {
    setHeroImgUploading(true)
    try {
      const res = await uploadMedia(file)
      handleUiField('hero.image', res.url)
      showToast('Hero image uploaded', 'success')
    } catch {
      showToast('Hero image upload failed', 'error')
    } finally {
      setHeroImgUploading(false)
    }
  }

  const handlePaletteApply = (paletteId) => {
    setActivePalette(paletteId)
    setPalette(paletteId)  // applies immediately to the live page
    // Also fold into themeConfig so it's persisted on Save
    setThemeConfig(prev => ({ ...prev, palette: paletteId }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Send everything as one merged document — matches the server's deepMerge
      // which stores the entire config under the 'ui' key in SiteConfig.
      const payload = {
        ...uiConfig,
        theme: { ...themeConfig, palette: activePalette },
        pages: pagesConfig,
      }
      const { updateUIConfig } = await import('../services/uiConfigService')
      await updateUIConfig(payload)

      // Also update the local config cache so the rest of the app sees the changes
      await updateConfig('ui', payload)

      trackEvent('admin_update', { tab: activeTab })
      showToast('✅ Saved to database!', 'success')
    } catch (err) {
      console.error('[AdminUIConfigurator] Save failed:', err)
      showToast(`Save failed — ${err?.response?.data?.message || err?.message || 'try again'}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A1F12',
      color: '#F0FFF4',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 48px',
    }}>
      {/* Back link */}
      <a
        href="/admin-control"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'rgba(168,245,162,0.4)',
          textDecoration: 'none', marginBottom: 28,
        }}
      >
        ← Back to Full CMS
      </a>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#F0FFF4' }}>
            Visual UI Configurator
          </h1>
          <p style={{ color: 'rgba(168,245,162,0.5)', fontSize: 13, margin: '4px 0 0' }}>
            Edit logos, text, and colors — preview updates live before saving
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '11px 28px', borderRadius: 50, border: 'none',
            background: saving ? 'rgba(110,220,95,0.2)' : 'linear-gradient(135deg, #6EDC5F, #3DAA3A)',
            color: saving ? 'rgba(168,245,162,0.4)' : '#0A1F12',
            fontWeight: 800, fontSize: 14,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 16px rgba(110,220,95,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Tab bar */}
      <ConfigTabBar active={activeTab} onChange={setActiveTab} />

      {/* UI & Brand tab — existing two-column layout */}
      {activeTab === 'ui' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          <div>
            <ThemePaletteSection activePalette={activePalette} onApply={handlePaletteApply} />
            <LogoSection
              logo={uiConfig.logo}
              mascot={uiConfig.mascot}
              brandName={uiConfig.brandName}
              uploading={logoUploading}
              onUpload={handleLogoUpload}
              onUploadMascot={async (file) => {
                try {
                  const res = await uploadMedia(file)
                  handleUiField('mascot', res.url)
                  showToast('Bloom image uploaded ✅', 'success')
                } catch {
                  showToast('Upload failed', 'error')
                }
              }}
              onBrandNameChange={v => setUiConfig(prev => ({ ...prev, brandName: v }))}
            />
            <HeroTextSection
              hero={uiConfig.hero || {}}
              onChange={handleUiField}
            />
            <HeroImageSection
              image={uiConfig.hero?.image}
              uploading={heroImgUploading}
              onUpload={handleHeroImageUpload}
              onClear={() => handleUiField('hero.image', '')}
            />
            <ThemeColorsSection
              theme={themeConfig}
              onChange={setThemeConfig}
            />
          </div>
          <div style={{ position: 'sticky', top: 40 }}>
            <LivePreview uiConfig={uiConfig} theme={themeConfig} />
          </div>
        </div>
      )}

      {/* Page editor tabs — single column */}
      {activeTab === 'home' && (
        <HomePageEditor
          page={pagesConfig.home || {}}
          onField={(path, val) => updatePageField('home', path, val)}
          onArray={(key, fn) => updatePageArray('home', key, fn)}
        />
      )}
      {activeTab === 'why' && (
        <WhyPageEditor
          page={pagesConfig.whyUpgraied || {}}
          onField={(path, val) => updatePageField('whyUpgraied', path, val)}
          onArray={(key, fn) => updatePageArray('whyUpgraied', key, fn)}
        />
      )}
      {activeTab === 'pricing' && (
        <PricingEditor
          page={pagesConfig.pricing || {}}
          onArray={(key, fn) => updatePageArray('pricing', key, fn)}
        />
      )}
      {activeTab === 'login' && (
        <LoginPageEditor
          page={pagesConfig.login || {}}
          onField={(path, val) => updatePageField('login', path, val)}
        />
      )}
    </div>
  )
}

// ── Logo & Brand section ────────────────────────────────────────────────
function LogoSection({ logo, mascot, brandName, uploading, onUpload, onUploadMascot, onBrandNameChange }) {
  const fileRef   = useRef(null)
  const mascotRef = useRef(null)

  return (
    <>
      {/* Brand panel */}
      <div style={panel}>
        <div style={sectionTitle}>🖌️ Logo & Brand Identity</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'start' }}>
          {/* Logo upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 88, height: 88, borderRadius: 12,
              background: 'rgba(110,220,95,0.06)',
              border: '2px dashed rgba(110,220,95,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {logo
                ? <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: 28 }}>🌿</span>
              }
            </div>
            <label style={{
              padding: '6px 14px', borderRadius: 50, cursor: uploading ? 'not-allowed' : 'pointer',
              background: 'rgba(110,220,95,0.10)', border: '1px solid rgba(110,220,95,0.22)',
              color: '#A8F5A2', fontSize: 11, fontWeight: 700, opacity: uploading ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}>
              {uploading ? 'Uploading…' : 'Upload Logo'}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Brand name */}
          <div>
            <label style={fieldLabel}>Brand Name</label>
            <input
              value={brandName || ''}
              onChange={e => onBrandNameChange(e.target.value)}
              placeholder="UpGrAIEd"
              style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(110,220,95,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(110,220,95,0.18)')}
            />
            <p style={hint}>Used in nav, browser tab, and footers</p>
          </div>
        </div>
      </div>

      {/* 🌸 Bloom Mascot panel — most prominent section */}
      <div style={{ ...panel, border: '1.5px solid rgba(110,220,95,0.35)', background: 'rgba(110,220,95,0.04)' }}>
        <div style={sectionTitle}>🌸 Bloom Mascot Image</div>
        <p style={{ ...hint, fontSize: 12, marginBottom: 16, color: 'rgba(168,245,162,0.7)' }}>
          Upload your <strong style={{ color: '#A8F5A2' }}>actual Bloom photo</strong>. It will be placed
          exactly as-is across the landing page, hero, and all dashboards —
          <em> no AI recreation, no alteration</em>.
        </p>

        {mascot ? (
          /* Preview of uploaded image */
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 120, height: 120, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
              border: '2px solid rgba(110,220,95,0.4)',
              background: 'rgba(110,220,95,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img
                src={mascot}
                alt="Bloom"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A8F5A2', marginBottom: 4 }}>
                ✅ Bloom image uploaded
              </div>
              <div style={{ fontSize: 11, color: 'rgba(168,245,162,0.5)', marginBottom: 14, lineHeight: 1.5 }}>
                Your image is being used as-is across the platform.
              </div>
              <label style={{
                display: 'inline-block', padding: '8px 18px', borderRadius: 50,
                background: '#6EDC5F', color: '#0A1F12',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                Replace Image
                <input
                  ref={mascotRef}
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files?.[0] && onUploadMascot(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        ) : (
          /* Upload zone */
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: '36px 20px', borderRadius: 16,
            border: '2px dashed rgba(110,220,95,0.3)',
            background: 'rgba(110,220,95,0.03)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(110,220,95,0.6)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(110,220,95,0.3)'}
          >
            <div style={{ fontSize: 48 }}>🌸</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#A8F5A2', marginBottom: 6 }}>
                Click to upload your Bloom photo
              </div>
              <div style={{ fontSize: 12, color: 'rgba(168,245,162,0.45)', lineHeight: 1.6 }}>
                PNG, JPG, WebP · up to 10 MB<br />
                Your image will appear exactly as uploaded — no changes made.
              </div>
            </div>
            <input
              ref={mascotRef}
              type="file"
              accept="image/*"
              onChange={e => e.target.files?.[0] && onUploadMascot(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
      </div>
    </>
  )
}


// ── Hero text section ─────────────────────────────────────────────────────────
function HeroTextSection({ hero, onChange }) {
  const fields = [
    {
      key: 'title',
      path: 'hero.title',
      label: 'Hero Title',
      type: 'text',
      placeholder: 'Learn Your Subjects. Master How to Think with AI',
    },
    {
      key: 'subtitle',
      path: 'hero.subtitle',
      label: 'Subtitle',
      type: 'textarea',
      placeholder: 'Upload your school pages. We turn them into a structured 7-day learning journey…',
    },
    {
      key: 'cta_primary',
      path: 'hero.cta_primary',
      label: 'Primary Button Text',
      type: 'text',
      placeholder: 'Book Free Demo',
    },
  ]

  return (
    <div style={panel}>
      <div style={sectionTitle}>✏️ Hero Section Text</div>
      {fields.map(f => (
        <div key={f.path} style={fieldGroup}>
          <label style={fieldLabel}>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={hero[f.key] || ''}
              onChange={e => onChange(f.path, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = 'rgba(110,220,95,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(110,220,95,0.18)')}
            />
          ) : (
            <input
              value={hero[f.key] || ''}
              onChange={e => onChange(f.path, e.target.value)}
              placeholder={f.placeholder}
              style={inputBase}
              onFocus={e => (e.target.style.borderColor = 'rgba(110,220,95,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(110,220,95,0.18)')}
            />
          )}
        </div>
      ))}
      <p style={{ ...hint, marginTop: -4 }}>Leave empty to use default content. HTML is supported in title.</p>
    </div>
  )
}

// ── Hero image section ────────────────────────────────────────────────────────
function HeroImageSection({ image, uploading, onUpload, onClear }) {
  const fileRef = useRef(null)

  return (
    <div style={panel}>
      <div style={sectionTitle}>📸 Hero Section Image</div>
      {image ? (
        <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
          <img
            src={image}
            alt="Hero"
            style={{
              width: 116, height: 76, borderRadius: 10, objectFit: 'cover', flexShrink: 0,
              border: '1px solid rgba(110,220,95,0.2)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={image}
              readOnly
              style={{ ...inputBase, fontSize: 11, color: 'rgba(168,245,162,0.45)', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <label style={{
                padding: '7px 16px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                background: 'rgba(110,220,95,0.10)', border: '1px solid rgba(110,220,95,0.22)',
                color: '#A8F5A2', cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
              }}>
                {uploading ? 'Uploading…' : 'Replace'}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                onClick={onClear}
                style={{
                  padding: '7px 16px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                  background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)',
                  color: '#FF9090', cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '28px 20px', borderRadius: 12,
          border: '2px dashed rgba(110,220,95,0.18)',
          background: 'rgba(110,220,95,0.03)',
          cursor: uploading ? 'not-allowed' : 'pointer',
        }}>
          <span style={{ fontSize: 28 }}>{uploading ? '⏳' : '📸'}</span>
          <span style={{ fontSize: 12, color: 'rgba(168,245,162,0.55)', fontWeight: 600 }}>
            {uploading ? 'Uploading…' : 'Click to upload hero image'}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(168,245,162,0.3)' }}>
            PNG, JPG, WebP · max 5 MB
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
      )}
      <p style={hint}>Replaces the Bloom mascot illustration in the hero section when set.</p>
    </div>
  )
}

// ── Theme Palette Picker ──────────────────────────────────────────────────────
function ThemePaletteSection({ activePalette, onApply }) {
  return (
    <div style={{ ...panel, border: '1px solid rgba(110,220,95,0.25)' }}>
      <div style={sectionTitle}>🎨 Brand Theme Palette</div>
      <p style={{ ...hint, marginBottom: 18 }}>
        Pick a one-click preset palette. This updates all colours across every screen instantly.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        {PALETTE_META.map(p => {
          const isActive = activePalette === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onApply(p.id)}
              style={{
                padding: '14px 12px',
                borderRadius: 14,
                background: p.bg,
                border: isActive ? `2px solid ${p.swatch}` : '2px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 4px 16px ${p.swatch}44` : '0 2px 8px rgba(0,0,0,0.2)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: p.swatch,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{p.emoji}</div>
                {isActive && (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: p.swatch, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, color: '#fff',
                  }}>✓</div>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{p.label}</div>
              <div style={{ fontSize: 10, color: '#666', lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Theme colors section ──────────────────────────────────────────────────────
const COLOR_FIELDS = [
  { key: 'primaryColor',   label: 'Primary',   hint: 'Buttons, highlights, glow effects' },
  { key: 'accentColor',    label: 'Accent',     hint: 'Secondary elements, skill chips' },
  { key: 'highlightColor', label: 'Highlight',  hint: 'Stars, achievements, badges' },
]

function ThemeColorsSection({ theme, onChange }) {
  const update = (key, value) => onChange(prev => ({ ...prev, [key]: value }))

  return (
    <div style={panel}>
      <div style={sectionTitle}>🖌️ Fine-Tune Colors</div>
      <p style={{ ...hint, marginBottom: 16 }}>Manually override individual brand colours after picking a palette.</p>
      {COLOR_FIELDS.map(({ key, label, hint: h }) => (
        <ColorField
          key={key}
          label={label}
          hint={h}
          value={theme[key] || DEFAULT_THEME[key]}
          onChange={v => update(key, v)}
        />
      ))}
      <p style={{ ...hint, marginTop: 4 }}>Colors update the live preview instantly. Save to persist.</p>
    </div>
  )
}

function ColorField({ label, hint: h, value, onChange }) {
  const [hex, setHex] = useState(value)

  // Sync when parent loads config from server
  useEffect(() => { setHex(value) }, [value])

  const handlePickerChange = (v) => {
    setHex(v)
    onChange(v)
  }

  const handleHexInput = (v) => {
    setHex(v)
    if (HEX_RE.test(v)) onChange(v)
  }

  const displayColor = HEX_RE.test(hex) ? hex : value

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14, alignItems: 'center', marginBottom: 18 }}>
      {/* Color swatch — clicking opens the native color picker */}
      <label style={{ cursor: 'pointer', position: 'relative', display: 'block', width: 44, height: 44 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: displayColor,
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow: `0 0 12px ${displayColor}55`,
          transition: 'box-shadow 0.2s',
        }} />
        <input
          type="color"
          value={displayColor}
          onChange={e => handlePickerChange(e.target.value)}
          style={{
            position: 'absolute', inset: 0, opacity: 0,
            cursor: 'pointer', width: '100%', height: '100%',
          }}
        />
      </label>

      {/* Label + hex text input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F0FFF4' }}>{label}</span>
          <input
            value={hex}
            onChange={e => handleHexInput(e.target.value)}
            maxLength={7}
            spellCheck={false}
            style={{
              width: 82, padding: '4px 8px', borderRadius: 6, fontSize: 12,
              fontFamily: '"Fira Code", "Courier New", monospace',
              background: 'rgba(10,26,16,0.8)',
              border: `1px solid ${HEX_RE.test(hex) ? 'rgba(110,220,95,0.25)' : '#FF8A65'}`,
              color: HEX_RE.test(hex) ? '#A8F5A2' : '#FF8A65',
              outline: 'none',
            }}
          />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(168,245,162,0.35)', margin: 0 }}>{h}</p>
      </div>
    </div>
  )
}

// ── Live preview panel ────────────────────────────────────────────────────────
function LivePreview({ uiConfig, theme }) {
  const hero     = uiConfig.hero || {}
  const title    = hero.title       || 'Learn Your Subjects.'
  const subtitle = hero.subtitle    || 'AI-powered learning journeys built for kids 8–14.'
  const ctaText  = hero.cta_primary || 'Book Free Demo'
  const logo     = uiConfig.logo
  const brand    = uiConfig.brandName || 'UpGrAIEd'
  const heroImg  = hero.image

  const primary   = (HEX_RE.test(theme.primaryColor)   ? theme.primaryColor   : DEFAULT_THEME.primaryColor)
  const accent    = (HEX_RE.test(theme.accentColor)     ? theme.accentColor    : DEFAULT_THEME.accentColor)
  const highlight = (HEX_RE.test(theme.highlightColor)  ? theme.highlightColor : DEFAULT_THEME.highlightColor)

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        color: 'rgba(168,245,162,0.4)', marginBottom: 12,
      }}>
        LIVE PREVIEW
      </div>

      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(110,220,95,0.14)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Mini nav bar */}
        <div style={{
          padding: '10px 16px',
          background: 'rgba(10,26,16,0.97)',
          borderBottom: '1px solid rgba(110,220,95,0.08)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {logo
            ? <img src={logo} alt="Logo" style={{ height: 22, objectFit: 'contain' }} />
            : <span style={{ fontSize: 16 }}>🌿</span>
          }
          <span style={{ fontSize: 13, fontWeight: 800, color: '#F0FFF4' }}>{brand}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['Why', 'Pricing', 'Demo'].map(l => (
              <span key={l} style={{ fontSize: 10, color: 'rgba(168,245,162,0.35)', fontWeight: 600 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Mini hero */}
        <div style={{
          padding: '24px 20px 28px',
          background: 'linear-gradient(160deg, #0A1F12, #10231A)',
          position: 'relative', overflow: 'hidden', minHeight: 200,
        }}>
          {/* Ambient glow from primary color */}
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%',
            width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}28 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Hero image as faded backdrop */}
          {heroImg && (
            <img
              src={heroImg}
              alt=""
              style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: '45%', height: '100%', objectFit: 'cover', opacity: 0.25,
                pointerEvents: 'none',
              }}
            />
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 50,
              background: `${primary}18`, border: `1px solid ${primary}40`,
              marginBottom: 12,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: primary }} />
              <span style={{ color: primary, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' }}>
                AI LEARNING · AGES 8–14
              </span>
            </div>

            {/* Title — supports dangerouslySetInnerHTML like HeroSection */}
            <h2
              style={{
                fontSize: 15, fontWeight: 800, lineHeight: 1.25, color: '#F0FFF4',
                marginBottom: 10, maxWidth: 210,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <p style={{
              fontSize: 11, lineHeight: 1.6, color: 'rgba(168,245,162,0.65)',
              marginBottom: 16, maxWidth: 210,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {subtitle}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                padding: '6px 14px', borderRadius: 50, border: 'none',
                background: `linear-gradient(135deg, ${primary}, ${accent})`,
                color: '#0A1F12', fontWeight: 800, fontSize: 10,
              }}>
                {ctaText}
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 50,
                border: `1px solid ${primary}44`,
                color: primary, fontWeight: 700, fontSize: 10,
              }}>
                See How It Works
              </div>
            </div>
          </div>
        </div>

        {/* Color palette strip */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(10,26,16,0.85)',
          borderTop: '1px solid rgba(110,220,95,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 9, color: 'rgba(168,245,162,0.35)', fontWeight: 700, letterSpacing: '0.08em' }}>
            BRAND
          </span>
          {[
            { color: primary,   label: 'Primary' },
            { color: accent,    label: 'Accent' },
            { color: highlight, label: 'Highlight' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 9, color: 'rgba(168,245,162,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* JSON fallback link */}
      <div style={{
        marginTop: 16, padding: '14px 16px', borderRadius: 12,
        background: 'rgba(22,43,31,0.5)',
        border: '1px solid rgba(110,220,95,0.1)',
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(168,245,162,0.45)', margin: '0 0 6px' }}>
          JSON Fallback
        </p>
        <p style={{ fontSize: 11, color: 'rgba(168,245,162,0.3)', margin: '0 0 10px', lineHeight: 1.5 }}>
          Advanced config, curriculum, pricing, and feature flags are in the full CMS.
        </p>
        <a
          href="/admin-control"
          style={{
            display: 'inline-block', padding: '6px 14px', borderRadius: 8,
            background: 'rgba(110,220,95,0.08)',
            border: '1px solid rgba(110,220,95,0.18)',
            color: '#6EDC5F', fontSize: 11, fontWeight: 700, textDecoration: 'none',
          }}
        >
          Open Full CMS →
        </a>
      </div>
    </div>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'ui',      label: '🎨 UI & Brand' },
  { id: 'home',    label: '🏠 Home Page' },
  { id: 'why',     label: '✨ Why Page' },
  { id: 'pricing', label: '💰 Pricing' },
  { id: 'login',   label: '🔐 Login Page' },
]

function ConfigTabBar({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4, marginBottom: 32,
      background: 'rgba(10,26,16,0.6)',
      border: '1px solid rgba(110,220,95,0.12)',
      borderRadius: 12, padding: 4,
    }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, padding: '9px 12px', borderRadius: 9, border: 'none',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            background: active === t.id ? 'rgba(110,220,95,0.18)' : 'transparent',
            color: active === t.id ? '#A8F5A2' : 'rgba(168,245,162,0.4)',
            boxShadow: active === t.id ? 'inset 0 0 0 1px rgba(110,220,95,0.3)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Shared array editor primitives ─────────────────────────────────────────��───
function AddItemButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 8,
        background: 'rgba(110,220,95,0.10)',
        border: '1px dashed rgba(110,220,95,0.3)',
        color: '#6EDC5F', fontSize: 12, fontWeight: 700,
        cursor: 'pointer', width: '100%', justifyContent: 'center',
        marginTop: 8,
      }}
    >
      + {label}
    </button>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.25)',
        color: '#FF9090', borderRadius: 6, width: 26, height: 26,
        cursor: 'pointer', fontSize: 13, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      ✕
    </button>
  )
}

// ── Home page editor ──────────────────────────────────────────────────────────
function HomePageEditor({ page, onField, onArray }) {
  const features = page.features || []
  const cta = page.cta || {}

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Hero text */}
      <div style={panel}>
        <div style={sectionTitle}>🦸 Hero Section</div>
        {[
          { path: 'hero.title',    label: 'Hero Title',    type: 'text',     placeholder: 'Learn Your Subjects. Master How to Think with AI' },
          { path: 'hero.subtitle', label: 'Subtitle',      type: 'textarea', placeholder: 'Upload your school pages...' },
          { path: 'hero.ctaText',  label: 'CTA Button Text', type: 'text',   placeholder: 'Start Learning Free' },
        ].map(f => (
          <div key={f.path} style={fieldGroup}>
            <label style={fieldLabel}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={(page.hero || {})[f.path.split('.')[1]] || ''}
                onChange={e => onField(f.path, e.target.value)}
                placeholder={f.placeholder} rows={3}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            ) : (
              <input
                value={(page.hero || {})[f.path.split('.')[1]] || ''}
                onChange={e => onField(f.path, e.target.value)}
                placeholder={f.placeholder} style={inputBase}
              />
            )}
          </div>
        ))}
        <p style={hint}>Leave empty to use default content.</p>
      </div>

      {/* Features */}
      <div style={panel}>
        <div style={sectionTitle}>✨ Feature Cards</div>
        {features.map((item, i) => (
          <div key={i} style={{ position: 'relative', background: 'rgba(10,26,16,0.5)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <RemoveButton onClick={() => onArray('features', arr => arr.filter((_, j) => j !== i))} />
            {[
              { key: 'icon',        label: 'Icon (emoji)', placeholder: '⚡' },
              { key: 'title',       label: 'Title',        placeholder: 'Feature name' },
              { key: 'description', label: 'Description',  placeholder: 'What this enables...' },
            ].map(f => (
              <div key={f.key} style={fieldGroup}>
                <label style={fieldLabel}>{f.label}</label>
                <input
                  value={item[f.key] || ''}
                  onChange={e => onArray('features', arr => arr.map((x, j) => j === i ? { ...x, [f.key]: e.target.value } : x))}
                  placeholder={f.placeholder} style={inputBase}
                />
              </div>
            ))}
          </div>
        ))}
        <AddItemButton label="Add Feature" onClick={() => onArray('features', arr => [...arr, { icon: '⚡', title: '', description: '' }])} />
      </div>

      {/* Bottom CTA */}
      <div style={panel}>
        <div style={sectionTitle}>📢 Bottom CTA Block</div>
        {[
          { key: 'title',  label: 'Heading',     placeholder: 'Ready to start?' },
          { key: 'button', label: 'Button Text',  placeholder: 'Book Free Demo' },
        ].map(f => (
          <div key={f.key} style={fieldGroup}>
            <label style={fieldLabel}>{f.label}</label>
            <input
              value={cta[f.key] || ''}
              onChange={e => onField(`cta.${f.key}`, e.target.value)}
              placeholder={f.placeholder} style={inputBase}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Why page editor ───────────────────────────────────────────────────────────
function WhyPageEditor({ page, onField, onArray }) {
  const benefits = page.benefits || []
  const intro = page.intro || {}

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={panel}>
        <div style={sectionTitle}>📖 Intro Section</div>
        {[
          { path: 'intro.title',       label: 'Title',       type: 'text',     placeholder: 'Why UpgrAIed?' },
          { path: 'intro.description', label: 'Description', type: 'textarea', placeholder: 'A short intro paragraph...' },
        ].map(f => (
          <div key={f.path} style={fieldGroup}>
            <label style={fieldLabel}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={intro[f.path.split('.')[1]] || ''}
                onChange={e => onField(f.path, e.target.value)}
                placeholder={f.placeholder} rows={3}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            ) : (
              <input
                value={intro[f.path.split('.')[1]] || ''}
                onChange={e => onField(f.path, e.target.value)}
                placeholder={f.placeholder} style={inputBase}
              />
            )}
          </div>
        ))}
      </div>

      <div style={panel}>
        <div style={sectionTitle}>🏆 Benefits</div>
        {benefits.map((item, i) => (
          <div key={i} style={{ position: 'relative', background: 'rgba(10,26,16,0.5)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
            <RemoveButton onClick={() => onArray('benefits', arr => arr.filter((_, j) => j !== i))} />
            {[
              { key: 'title',       label: 'Title',       placeholder: 'Benefit name' },
              { key: 'description', label: 'Description', placeholder: 'Why this matters...' },
            ].map(f => (
              <div key={f.key} style={fieldGroup}>
                <label style={fieldLabel}>{f.label}</label>
                <input
                  value={item[f.key] || ''}
                  onChange={e => onArray('benefits', arr => arr.map((x, j) => j === i ? { ...x, [f.key]: e.target.value } : x))}
                  placeholder={f.placeholder} style={inputBase}
                />
              </div>
            ))}
          </div>
        ))}
        <AddItemButton label="Add Benefit" onClick={() => onArray('benefits', arr => [...arr, { title: '', description: '' }])} />
      </div>
    </div>
  )
}

// ── Pricing editor ────────────────────────────────────────────────────────────
function PricingEditor({ page, onArray }) {
  const plans = page.plans || []

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={panel}>
        <div style={sectionTitle}>💳 Pricing Plans</div>
        {plans.map((plan, i) => (
          <div key={i} style={{ position: 'relative', background: 'rgba(10,26,16,0.5)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <RemoveButton onClick={() => onArray('plans', arr => arr.filter((_, j) => j !== i))} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'name',  label: 'Plan Name', placeholder: 'Pro' },
                { key: 'price', label: 'Price',      placeholder: '₹999/month' },
              ].map(f => (
                <div key={f.key} style={fieldGroup}>
                  <label style={fieldLabel}>{f.label}</label>
                  <input
                    value={plan[f.key] || ''}
                    onChange={e => onArray('plans', arr => arr.map((x, j) => j === i ? { ...x, [f.key]: e.target.value } : x))}
                    placeholder={f.placeholder} style={inputBase}
                  />
                </div>
              ))}
            </div>

            <div style={fieldGroup}>
              <label style={fieldLabel}>Features (one per line)</label>
              <textarea
                value={Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || '')}
                onChange={e => onArray('plans', arr => arr.map((x, j) => j === i ? { ...x, features: e.target.value.split('\n').filter(Boolean) } : x))}
                placeholder={'All modules\nAI tutor sessions\nParent dashboard'}
                rows={4}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input
                type="checkbox"
                id={`plan-highlight-${i}`}
                checked={!!plan.highlight}
                onChange={e => onArray('plans', arr => arr.map((x, j) => j === i ? { ...x, highlight: e.target.checked } : x))}
                style={{ accentColor: '#6EDC5F', width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor={`plan-highlight-${i}`} style={{ ...fieldLabel, margin: 0, cursor: 'pointer' }}>
                Mark as highlighted / recommended plan
              </label>
            </div>
          </div>
        ))}
        <AddItemButton label="Add Plan" onClick={() => onArray('plans', arr => [...arr, { name: '', price: '', features: [], highlight: false }])} />
        <p style={hint}>Highlighted plan displays with an accent border on the pricing page.</p>
      </div>
    </div>
  )
}

// ── Login page editor ──────────────────────────────────────────────────────��──
function LoginPageEditor({ page, onField }) {
  return (
    <div style={{ maxWidth: 700 }}>
      <div style={panel}>
        <div style={sectionTitle}>🔐 Login Page Copy</div>
        {[
          { key: 'title',      label: 'Page Title',    type: 'text',     placeholder: 'Welcome Back 👋' },
          { key: 'subtitle',   label: 'Subtitle',      type: 'textarea', placeholder: 'Choose your role for instant demo access...' },
          { key: 'buttonText', label: 'Submit Button', type: 'text',     placeholder: 'Secure Login →' },
        ].map(f => (
          <div key={f.key} style={fieldGroup}>
            <label style={fieldLabel}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={page[f.key] || ''}
                onChange={e => onField(f.key, e.target.value)}
                placeholder={f.placeholder} rows={3}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            ) : (
              <input
                value={page[f.key] || ''}
                onChange={e => onField(f.key, e.target.value)}
                placeholder={f.placeholder} style={inputBase}
              />
            )}
          </div>
        ))}
        <p style={hint}>Leave empty to use default copy. Demo role cards are always shown.</p>
      </div>
    </div>
  )
}

// ── Loading state ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0A1F12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(110,220,95,0.15)',
          borderTop: '3px solid #6EDC5F',
          animation: 'bloom-spin-slow 0.9s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ color: 'rgba(168,245,162,0.5)', fontSize: 14 }}>Loading config…</p>
      </div>
    </div>
  )
}
