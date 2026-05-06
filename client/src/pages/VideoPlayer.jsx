import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useToast } from '../context/ToastContext'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { getCurriculum, getStreamUrl, postProgress } from '../services'

export default function VideoPlayer() {
  const { moduleId }     = useParams()
  const navigate         = useNavigate()
  const { showToast }    = useToast()
  
  const [curriculum, setCurriculum] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeModule, setActiveModule] = useState(null)
  const [streamUrl, setStreamUrl]   = useState(null)
  
  const [expandedLevels, setExpandedLevels] = useState({})
  
  // Progress tracking
  const progressInterval = useRef(null)

  useEffect(() => {
    async function init() {
      try {
        const tree = await getCurriculum().catch(() => [])
        const levels = Array.isArray(tree) ? tree : []
        setCurriculum(levels)

        let targetModule = null
        if (moduleId) {
           levels.forEach(lvl => lvl.modules?.forEach(m => { if (m._id === moduleId) targetModule = m }))
        }
        if (!targetModule) {
           levels.forEach(lvl => {
             if (!targetModule && lvl.status === 'active') {
               targetModule = lvl.modules?.[0]
             }
           })
        }
        if (targetModule) handleSelectModule(targetModule, levels)
      } catch {
        showToast('Failed to load curriculum', 'error')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleSelectModule = async (mod, currTree = curriculum) => {
    if (mod.status === 'locked') {
      return showToast('This module is locked. Complete previous ones first!', 'error')
    }
    setActiveModule(mod)
    // auto-expand its level
    const parentLevel = currTree.find(l => l.modules?.some(m => m._id === mod._id))
    if (parentLevel) {
      setExpandedLevels(prev => ({ ...prev, [parentLevel._id]: true }))
    }
    
    // fetch stream URL
    try {
      const res = await getStreamUrl(mod._id).catch(() => ({ streamUrl: '' }))
      setStreamUrl(res.streamUrl)
    } catch {
      showToast('Error loading video', 'error')
    }
  }

  // Progress Ping
  useEffect(() => {
    if (!activeModule) return
    progressInterval.current = setInterval(() => {
      // simulate 1% per 30s ping
      postProgress(activeModule._id, 1).catch(console.error)
    }, 30000)

    return () => clearInterval(progressInterval.current)
  }, [activeModule])
  
  const markComplete = async () => {
    try {
      await postProgress(activeModule._id, 100)
      showToast('Module marked as complete! 🎉', 'success')
      
      // Update local state without refetching
      setCurriculum(prev => prev.map(lvl => ({
        ...lvl,
        modules: lvl.modules.map(m => m._id === activeModule._id ? { ...m, status: 'completed', percent: 100 } : m)
      })))
      setActiveModule({ ...activeModule, status: 'completed', percent: 100 })
      
      // Optionally show toast for unlocked level if any
    } catch {
      showToast('Error marking complete', 'error')
    }
  }

  const navigateMod = (direction) => {
    // Flatten modules
    const allMods = curriculum.flatMap(l => l.modules)
    const idx = allMods.findIndex(m => m._id === activeModule?._id)
    if (direction === 'prev' && idx > 0) handleSelectModule(allMods[idx - 1])
    if (direction === 'next' && idx < allMods.length - 1) handleSelectModule(allMods[idx + 1])
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Left Sidebar */}
      <div style={{ width: 320, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px' }} onClick={() => navigate('/dashboard/student')}>
            ← Dashboard
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {loading ? <LoadingSkeleton height="400px" /> : curriculum.map(lvl => (
            <div key={lvl._id} style={{ marginBottom: 12 }}>
              <div 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '10px 12px', background: 'rgba(255,255,255,0.02)', 
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: lvl.status === 'active' ? '1px solid var(--accent-purple-light)' : '1px solid var(--border-color)'
                }}
                onClick={() => setExpandedLevels({ ...expandedLevels, [lvl._id]: !expandedLevels[lvl._id] })}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>{lvl.name}</div>
                <div>{expandedLevels[lvl._id] ? '▼' : '▶'}</div>
              </div>
              
              {expandedLevels[lvl._id] && (
                <div style={{ paddingLeft: 12, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {lvl.modules.map(mod => (
                    <div 
                      key={mod._id} 
                      onClick={() => handleSelectModule(mod)}
                      style={{
                        padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                        background: activeModule?._id === mod._id ? 'rgba(123,63,228,0.15)' : 'transparent',
                        border: activeModule?._id === mod._id ? '1px solid var(--accent-purple)' : '1px solid transparent',
                        cursor: mod.status === 'locked' ? 'not-allowed' : 'pointer',
                        opacity: mod.status === 'locked' ? 0.5 : 1,
                        display: 'flex', alignItems: 'center', gap: 8
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{mod.status === 'completed' ? '✅' : mod.status === 'locked' ? '🔒' : '▶'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: activeModule?._id === mod._id ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mod.title}
                        </div>
                      </div>
                      {mod.isMustDo && mod.status !== 'completed' && <span style={{ fontSize: 10, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>MUST DO</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeModule ? (
          <>
            <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onContextMenu={e => e.preventDefault()}>
              {streamUrl ? (
                <iframe 
                  src={streamUrl} style={{ width: '100%', height: '100%', border: 'none' }} 
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen
                />
              ) : (
                <LoadingSkeleton width="100%" height="100%" />
              )}
            </div>
            
            <div style={{ height: 260, background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{activeModule.title}</h2>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Level Module • {activeModule.status === 'completed' ? '100% completed' : activeModule.percent + '% completed'}</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-ghost" onClick={() => navigateMod('prev')}>Prev</button>
                  <button className="btn-primary" onClick={markComplete}>Mark Complete</button>
                  <button className="btn-ghost" onClick={() => navigateMod('next')}>Next</button>
                </div>
              </div>
              <div style={{ flex: 1, padding: '20px 32px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Task Description</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeModule.taskDescription || 'Watch the video carefully and practice the concepts demonstrated.'}
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
