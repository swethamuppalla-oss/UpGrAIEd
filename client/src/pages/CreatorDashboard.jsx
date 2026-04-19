import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { getCreatorStats, getCreatorVideos, uploadVideo } from '../services/api'

const NAV_ITEMS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'videos',   icon: '🎬', label: 'Videos' },
  { id: 'revenue',  icon: '💰', label: 'Revenue' },
  { id: 'students', icon: '👥', label: 'Students' }
]

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'C'
}

function UploadModal({ isOpen, onClose, onSuccess, showToast }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    title: '', programme: 'Junior', level: '1', moduleTitle: '', isMustDo: true, taskDescription: ''
  })
  
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return showToast('Please select a video file', 'error')
    
    setUploading(true)
    const data = new FormData()
    data.append('video', file)
    Object.keys(formData).forEach(k => data.append(k, formData[k]))

    try {
      const newVideo = await uploadVideo(data, (p) => setProgress(p))
      showToast('Video uploaded successfully!', 'success')
      setUploading(false)
      setProgress(0)
      setFile(null)
      onSuccess(newVideo)
    } catch (err) {
      setUploading(false)
      showToast('Failed to upload video', 'error')
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--bg-card)', width: 600, maxHeight: '90vh', overflowY: 'auto',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Upload New Video</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px 10px' }} disabled={uploading}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Video Title</label>
              <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Module Title</label>
              <input required className="input-field" value={formData.moduleTitle} onChange={e => setFormData({...formData, moduleTitle: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Programme</label>
              <select className="input-field" value={formData.programme} onChange={e => setFormData({...formData, programme: e.target.value})}>
                <option value="Junior">Junior (Grade 6-8)</option>
                <option value="Senior">Senior (Grade 9-12)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Level</label>
              <select className="input-field" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                {[...Array(11)].map((_, i) => <option key={i} value={i+1}>Level {i+1}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Task Description</label>
            <textarea className="input-field" rows={3} value={formData.taskDescription} onChange={e => setFormData({...formData, taskDescription: e.target.value})}></textarea>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.isMustDo} onChange={e => setFormData({...formData, isMustDo: e.target.checked})} />
            <span style={{ fontSize: 14 }}>Mark as MUST DO</span>
          </label>

          {/* Drag & Drop File */}
          <div 
            onDragOver={e => e.preventDefault()} 
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: 32,
              textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)'
            }}
          >
            {file ? (
              <div style={{ color: 'var(--accent-purple-light)' }}>📁 {file.name}</div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>Drag & Drop video file here or click to browse</div>
            )}
            <input type="file" accept="video/mp4,video/x-m4v,video/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          {uploading && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>Uploading...</span><span>{progress}%</span>
              </div>
              <div className="progress-bar-track" style={{ height: 6 }}>
                 <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
            <button type="button" className="btn-ghost" onClick={onClose} disabled={uploading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CreatorDashboard() {
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        if (activeTab === 'overview' || activeTab === 'students' || activeTab === 'revenue') {
          const data = await getCreatorStats().catch(() => ({ students: 0, videos: 0, watchTime: '0h', completion: '0%' }))
          setStats(data)
        }
        if (activeTab === 'videos') {
          const data = await getCreatorVideos().catch(() => [])
          setVideos(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        showToast('Error loading data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab, showToast])

  const handleUploadSuccess = (newVideo) => {
    setIsModalOpen(false)
    if (activeTab === 'videos') {
      setVideos(prev => [newVideo, ...prev])
    }
  }

  function renderOverview() {
    if (loading) return <LoadingSkeleton height="150px" borderRadius="12px" />
    const st = stats || { students: 0, videos: 0, watchTime: '0', completion: '0%' }
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Students Enrolled</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>{st.students}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Watch Time</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-purple-light)' }}>{st.watchTime}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Completion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)' }}>{st.completion}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total Videos</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-orange)' }}>{st.videos}</div>
        </div>
      </div>
    )
  }

  function renderVideos() {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Upload Video</button>
        </div>
        {loading ? <LoadingSkeleton height="300px" /> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Title</th><th>Module</th><th>Level</th><th>Must Do</th><th>Avg Completion</th></tr>
              </thead>
              <tbody>
                {videos.map(v => (
                  <tr key={v._id || v.id}>
                    <td>{v.title}</td>
                    <td>{v.moduleTitle}</td>
                    <td>Level {v.level}</td>
                    <td>{v.isMustDo ? <span className="badge-red">Yes</span> : <span className="badge-purple">No</span>}</td>
                    <td style={{ minWidth: 150 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar-track" style={{ flex: 1, height: 6 }}>
                          <div className="progress-bar-fill" style={{ width: `${v.completionPercent || 0}%`, background: 'var(--accent-green)' }}></div>
                        </div>
                        <span style={{ fontSize: 12 }}>{v.completionPercent || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No videos uploaded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  function renderRevenue() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="glass-card" style={{ padding: 32, border: '1px solid var(--accent-green)' }}>
          <h3 style={{ margin: 0, fontSize: 18, color: 'var(--accent-green)' }}>Monthly Retainer</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Your fixed monthly retainer is active and will be disbursed on the 5th of every month.</p>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>₹50,000 / mo</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>March 2026</td><td>₹50,000</td><td><span className="badge-green">Paid</span></td></tr>
              <tr><td>February 2026</td><td>₹50,000</td><td><span className="badge-green">Paid</span></td></tr>
              <tr><td>January 2026</td><td>₹50,000</td><td><span className="badge-green">Paid</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function renderStudents() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="table-wrapper">
          <div style={{ padding: 16, background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Students by City</div>
          <table>
            <thead><tr><th>City</th><th>Count</th></tr></thead>
            <tbody>
              <tr><td>Bangalore</td><td>124</td></tr>
              <tr><td>Delhi</td><td>89</td></tr>
              <tr><td>Mumbai</td><td>76</td></tr>
            </tbody>
          </table>
        </div>
        <div className="table-wrapper">
          <div style={{ padding: 16, background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Students by Grade</div>
          <table>
            <thead><tr><th>Grade</th><th>Count</th></tr></thead>
            <tbody>
              <tr><td>Grade 8</td><td>150</td></tr>
              <tr><td>Grade 9</td><td>80</td></tr>
              <tr><td>Grade 10</td><td>59</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userName={user?.name || 'Creator'}
        userRole="Creator"
        userInitials={getInitials(user?.name)}
        onSignOut={() => logout()}
      />
      
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Creator Dashboard</h1>
          <p className="page-subtitle">Manage your content and track student progress.</p>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'videos'   && renderVideos()}
        {activeTab === 'revenue'  && renderRevenue()}
        {activeTab === 'students' && renderStudents()}
      </main>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleUploadSuccess} 
        showToast={showToast} 
      />
    </div>
  )
}
