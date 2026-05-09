import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import GrippingPointOverlay from '../components/learning/GrippingPointOverlay'
import { getCurriculum, getStreamUrl, postProgress } from '../services'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function fetchGrippingPoints(videoId) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API}/api/gripping-points/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.points || []
}

export default function VideoPlayer() {
  const { moduleId }    = useParams()
  const navigate        = useNavigate()
  const { showToast }   = useToast()

  const [curriculum, setCurriculum]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeModule, setActiveModule] = useState(null)
  const [streamUrl, setStreamUrl]     = useState(null)
  const [expandedLevels, setExpandedLevels] = useState({})

  // Gripping points state
  const [grippingPoints, setGrippingPoints] = useState([])
  const [answeredIds, setAnsweredIds]        = useState(new Set())
  const [activePoint, setActivePoint]        = useState(null)     // currently shown point
  const [elapsedSeconds, setElapsedSeconds]  = useState(0)
  const [isBlocked, setIsBlocked]            = useState(false)    // overlay visible

  const progressInterval = useRef(null)
  const timerRef         = useRef(null)

  // ── Init curriculum ─────────────────────────────────────────
  useEffect(() => {
    async function init() {
      try {
        const tree = await getCurriculum().catch(() => [])
        const levels = Array.isArray(tree) ? tree : []
        setCurriculum(levels)
        let target = null
        if (moduleId) levels.forEach(l => l.modules?.forEach(m => { if (m._id === moduleId) target = m }))
        if (!target)  levels.forEach(l => { if (!target && l.status === 'active') target = l.modules?.[0] })
        if (target) handleSelectModule(target, levels)
      } catch {
        showToast('Failed to load curriculum', 'error')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Load gripping points when module changes ─────────────────
  useEffect(() => {
    if (!activeModule?._id) return
    setGrippingPoints([])
    setAnsweredIds(new Set())
    setElapsedSeconds(0)
    setActivePoint(null)
    setIsBlocked(false)
    // Fetch points using moduleId as fallback (video-level lookup TBD when video model linked)
    fetchGrippingPoints(activeModule._id).then(pts => {
      setGrippingPoints(pts.sort((a, b) => a.timestampSeconds - b.timestampSeconds))
    }).catch(() => {})
  }, [activeModule?._id])

  // ── Client-side elapsed timer (500ms tick) ───────────────────
  useEffect(() => {
    if (isBlocked || !activeModule) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 0.5)
    }, 500)
    return () => clearInterval(timerRef.current)
  }, [isBlocked, activeModule])

  // ── Check for upcoming gripping points ──────────────────────
  useEffect(() => {
    if (isBlocked || grippingPoints.length === 0) return
    const next = grippingPoints.find(p => !answeredIds.has(p._id) && elapsedSeconds >= p.timestampSeconds)
    if (next) {
      clearInterval(timerRef.current)
      setActivePoint(next)
      setIsBlocked(true)
    }
  }, [elapsedSeconds, grippingPoints, answeredIds, isBlocked])

  // ── Checkpoint complete ──────────────────────────────────────
  const handleCheckpointDone = useCallback(() => {
    if (!activePoint) return
    setAnsweredIds(prev => new Set([...prev, activePoint._id]))
    setActivePoint(null)
    setIsBlocked(false)
  }, [activePoint])

  const handleSelectModule = async (mod, currTree = curriculum) => {
    if (mod.status === 'locked') return showToast('This module is locked. Complete previous ones first!', 'error')
    setActiveModule(mod)
    const parentLevel = currTree.find(l => l.modules?.some(m => m._id === mod._id))
    if (parentLevel) setExpandedLevels(prev => ({ ...prev, [parentLevel._id]: true }))
    try {
      const res = await getStreamUrl(mod._id).catch(() => ({ streamUrl: '' }))
      setStreamUrl(res.streamUrl)
    } catch {
      showToast('Error loading video', 'error')
    }
  }

  useEffect(() => {
    if (!activeModule) return
    progressInterval.current = setInterval(() => {
      postProgress(activeModule._id, 1).catch(console.error)
    }, 30000)
    return () => clearInterval(progressInterval.current)
  }, [activeModule])

  const markComplete = async () => {
    try {
      await postProgress(activeModule._id, 100)
      showToast('Module marked as complete! 🎉', 'success')
      setCurriculum(prev => prev.map(lvl => ({
        ...lvl,
        modules: lvl.modules.map(m => m._id === activeModule._id ? { ...m, status: 'completed', percent: 100 } : m)
      })))
      setActiveModule({ ...activeModule, status: 'completed', percent: 100 })
    } catch {
      showToast('Error marking complete', 'error')
    }
  }

  const navigateMod = (dir) => {
    const all = curriculum.flatMap(l => l.modules)
    const idx = all.findIndex(m => m._id === activeModule?._id)
    if (dir === 'prev' && idx > 0) handleSelectModule(all[idx - 1])
    if (dir === 'next' && idx < all.length - 1) handleSelectModule(all[idx + 1])
  }

  // Progress bar overlay (shows time-based position of checkpoints)
  const unanswered = grippingPoints.filter(p => !answeredIds.has(p._id))

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── Left Sidebar ─────────────────────────────────────── */}
      <div style={{ width: 300, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: 13 }}
            onClick={() => navigate('/dashboard/student')}
          >← Dashboard</button>
          {unanswered.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#6EDC5F', background: 'rgba(110,220,95,0.12)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(110,220,95,0.25)' }}>
              {unanswered.length} checkpoint{unanswered.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {loading ? <LoadingSkeleton height="400px" /> : curriculum.map(lvl => (
            <div key={lvl._id} style={{ marginBottom: 10 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: lvl.status === 'active' ? '1px solid var(--accent-purple-light)' : '1px solid var(--border-color)' }}
                onClick={() => setExpandedLevels({ ...expandedLevels, [lvl._id]: !expandedLevels[lvl._id] })}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>{lvl.name}</div>
                <div style={{ opacity: 0.5 }}>{expandedLevels[lvl._id] ? '▼' : '▶'}</div>
              </div>
              {expandedLevels[lvl._id] && (
                <div style={{ paddingLeft: 12, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {lvl.modules.map(mod => (
                    <div
                      key={mod._id}
                      onClick={() => handleSelectModule(mod)}
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: activeModule?._id === mod._id ? 'rgba(123,63,228,0.15)' : 'transparent', border: activeModule?._id === mod._id ? '1px solid var(--accent-purple)' : '1px solid transparent', cursor: mod.status === 'locked' ? 'not-allowed' : 'pointer', opacity: mod.status === 'locked' ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span style={{ fontSize: 13 }}>{mod.status === 'completed' ? '✅' : mod.status === 'locked' ? '🔒' : '▶'}</span>
                      <div style={{ fontSize: 12, color: activeModule?._id === mod._id ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mod.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activeModule ? (
          <>
            {/* Video + Gripping Point Overlay container */}
            <div
              style={{ flex: 1, background: '#000', position: 'relative', overflow: 'hidden' }}
              onContextMenu={e => e.preventDefault()}
            >
              {streamUrl ? (
                <iframe
                  src={streamUrl}
                  style={{ width: '100%', height: '100%', border: 'none', pointerEvents: isBlocked ? 'none' : 'auto' }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                <LoadingSkeleton width="100%" height="100%" />
              )}

              {/* Checkpoint overlay */}
              {isBlocked && activePoint && (
                <GrippingPointOverlay
                  point={activePoint}
                  onComplete={handleCheckpointDone}
                />
              )}

              {/* Checkpoint progress dots (top-right of video) */}
              {grippingPoints.length > 0 && (
                <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', gap: 5, zIndex: 10 }}>
                  {grippingPoints.map(p => (
                    <div key={p._id} style={{ width: 8, height: 8, borderRadius: '50%', background: answeredIds.has(p._id) ? '#6EDC5F' : 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.3s' }} title={`Checkpoint at ${Math.floor(p.timestampSeconds/60)}:${String(p.timestampSeconds%60).padStart(2,'0')}`} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Info bar ──────────────────────────────────── */}
            <div style={{ height: 220, background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{activeModule.title}</h2>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {activeModule.status === 'completed' ? '100% completed' : `${activeModule.percent || 0}% completed`}
                    {grippingPoints.length > 0 && ` · ${answeredIds.size}/${grippingPoints.length} checkpoints done`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" onClick={() => navigateMod('prev')} style={{ fontSize: 13, padding: '8px 16px' }}>← Prev</button>
                  <button className="btn-primary" onClick={markComplete} style={{ fontSize: 13, padding: '8px 20px' }}>Mark Complete</button>
                  <button className="btn-ghost" onClick={() => navigateMod('next')} style={{ fontSize: 13, padding: '8px 16px' }}>Next →</button>
                </div>
              </div>
              <div style={{ flex: 1, padding: '16px 28px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Task Description</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {activeModule.taskDescription || 'Watch the video carefully and answer Bloom\'s checkpoints as they appear.'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a module from the left to start learning.
          </div>
        )}
      </div>
    </div>
  )
}
