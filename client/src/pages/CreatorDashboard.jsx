import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import RobTrainer from '../components/ROB/RobTrainer'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { getCreatorStats, getCreatorVideos, uploadVideo } from '../services/api'

const NAV_ITEMS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'videos', icon: '🎬', label: 'Videos' },
  { id: 'rob', icon: '🤖', label: 'Train ROB' },
  { id: 'revenue', icon: '💰', label: 'Revenue' },
  { id: 'students', icon: '👥', label: 'Students' },
]

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('') || 'C'
}

function UploadModal({ isOpen, onClose, onSuccess, showToast }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    programme: 'Junior',
    level: '1',
    moduleTitle: '',
    isMustDo: true,
    taskDescription: '',
  })
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      showToast('Please select a video file', 'error')
      return
    }

    setUploading(true)
    const data = new FormData()
    data.append('video', file)
    Object.entries(formData).forEach(([key, value]) => data.append(key, value))

    try {
      const newVideo = await uploadVideo(data, setProgress)
      showToast('Video uploaded successfully!', 'success')
      setUploading(false)
      setProgress(0)
      setFile(null)
      onSuccess(newVideo)
    } catch {
      setUploading(false)
      showToast('Failed to upload video', 'error')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 'min(100%, 640px)', maxHeight: '90vh', overflowY: 'auto', borderRadius: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="clash-display" style={{ fontSize: 22 }}>Upload New Video</h2>
          <button type="button" className="btn-ghost" onClick={onClose} disabled={uploading}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Video Title</label>
              <input className="input-field" value={formData.title} onChange={(event) => setFormData(prev => ({ ...prev, title: event.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Module Title</label>
              <input className="input-field" value={formData.moduleTitle} onChange={(event) => setFormData(prev => ({ ...prev, moduleTitle: event.target.value }))} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Programme</label>
              <select className="input-field" value={formData.programme} onChange={(event) => setFormData(prev => ({ ...prev, programme: event.target.value }))}>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="form-label">Level</label>
              <select className="input-field" value={formData.level} onChange={(event) => setFormData(prev => ({ ...prev, level: event.target.value }))}>
                {Array.from({ length: 11 }, (_, index) => index + 1).map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Task Description</label>
            <textarea className="input-field" rows={4} value={formData.taskDescription} onChange={(event) => setFormData(prev => ({ ...prev, taskDescription: event.target.value }))} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={formData.isMustDo} onChange={(event) => setFormData(prev => ({ ...prev, isMustDo: event.target.checked }))} />
            <span style={{ color: 'var(--text-secondary)' }}>Mark as MUST DO</span>
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ border: '2px dashed var(--border-color)', borderRadius: 18, padding: 28, textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
          >
            {file ? `📁 ${file.name}` : 'Drag and drop a video here or click to browse'}
            <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </div>

          {uploading && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
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
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCreatorStats().catch(() => ({ students: 0, videos: 0, watchTime: '0h', completion: '0%' })),
      getCreatorVideos().catch(() => []),
    ])
      .then(([statsData, videoData]) => {
        setStats(statsData)
        setVideos(videoData)
      })
      .finally(() => setLoading(false))
  }, [])

  const renderOverview = () => {
    const currentStats = stats || { students: 0, videos: 0, watchTime: '0h', completion: '0%' }

    if (loading) {
      return <LoadingSkeleton height="180px" borderRadius="16px" />
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Students Enrolled</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)' }}>{currentStats.students}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Watch Time</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-purple-light)' }}>{currentStats.watchTime}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)' }}>{currentStats.completion}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Videos</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-orange)' }}>{currentStats.videos}</div>
        </div>
      </div>
    )
  }

  const renderVideos = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <div>
          <div className="clash-display" style={{ fontSize: 24 }}>Your Video Library</div>
          <div style={{ color: 'var(--text-secondary)' }}>These modules can also be used to train ROB.</div>
        </div>
        <button type="button" className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Upload Video
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton height="320px" borderRadius="16px" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Module</th>
                <th>Level</th>
                <th>Must Do</th>
                <th>Avg Completion</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video._id}>
                  <td>{video.title}</td>
                  <td>{video.moduleTitle}</td>
                  <td>Level {video.level}</td>
                  <td>{video.isMustDo ? <span className="badge-orange">Yes</span> : <span className="badge-purple">No</span>}</td>
                  <td style={{ minWidth: 150 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar-track" style={{ flex: 1 }}>
                        <div className="progress-bar-fill green" style={{ width: `${video.completionPercent || 0}%` }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{video.completionPercent || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        userName={user?.name || 'Creator'}
        userRole="creator"
        userInitials={getInitials(user?.name)}
        onSignOut={logout}
      />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">
            {activeTab === 'rob' ? 'Train ROB' : 'Creator Dashboard'}
          </h1>
          <p className="page-subtitle">
            {activeTab === 'rob'
              ? 'Train ROB to answer questions, generate quizzes, and guide your students.'
              : 'Manage your content and track student progress.'}
          </p>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'rob' && <RobTrainer />}
        {activeTab === 'revenue' && (
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="clash-display" style={{ fontSize: 26, marginBottom: 8 }}>Monthly Retainer</div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Your fixed monthly retainer is active and will be disbursed on the 5th of every month.
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-green)' }}>₹50,000 / mo</div>
          </div>
        )}
        {activeTab === 'students' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>City</th><th>Count</th></tr>
                </thead>
                <tbody>
                  <tr><td>Bangalore</td><td>124</td></tr>
                  <tr><td>Delhi</td><td>89</td></tr>
                  <tr><td>Mumbai</td><td>76</td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Grade</th><th>Count</th></tr>
                </thead>
                <tbody>
                  <tr><td>Grade 8</td><td>150</td></tr>
                  <tr><td>Grade 9</td><td>80</td></tr>
                  <tr><td>Grade 10</td><td>59</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newVideo) => {
          setVideos(prev => [newVideo, ...prev])
          setIsModalOpen(false)
        }}
        showToast={showToast}
      />
    </div>
  )
}
