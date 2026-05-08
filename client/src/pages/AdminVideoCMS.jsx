import { useState, useEffect } from 'react'
import { getAdminVideos, createAdminVideo, updateAdminVideo, deleteAdminVideo } from '../services'

export default function AdminVideoCMS() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', url: '', thumbnail: '', order: 0 })
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const data = await getAdminVideos()
      setVideos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    try {
      if (editingId) {
        await updateAdminVideo(editingId, form)
        setStatus({ msg: 'Video updated successfully.', ok: true })
      } else {
        await createAdminVideo(form)
        setStatus({ msg: 'Video created successfully.', ok: true })
      }
      setForm({ title: '', description: '', url: '', thumbnail: '', order: 0 })
      setEditingId(null)
      fetchVideos()
    } catch (err) {
      setStatus({ msg: 'Failed to save video.', ok: false })
    }
  }

  const handleEdit = (vid) => {
    setEditingId(vid._id)
    setForm({
      title: vid.title || '',
      description: vid.description || '',
      url: vid.url || '',
      thumbnail: vid.thumbnail || '',
      order: vid.order || 0
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return
    try {
      await deleteAdminVideo(id)
      fetchVideos()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-surface" style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Video Library (CMS)</h1>
        <p style={{ fontSize: 14 }}>
          Add and manage video lessons here. Videos will automatically appear in the Student Dashboard's "My Learning" tab.
        </p>
      </div>

      <div style={{
        padding: '24px', background: 'var(--color-surface)', borderRadius: 12,
        border: '1px solid rgba(13,35,24,0.08)', marginBottom: 32
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editingId ? 'Edit Video' : 'Add New Video'}</h2>
        
        {status && (
          <div className={`admin-status ${status.ok ? 'admin-status-ok' : 'admin-status-err'}`} style={{ marginBottom: 16 }}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Title</label>
              <input className="admin-input" required value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g. Intro to Python" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Order (Level/Module)</label>
              <input className="admin-input" type="number" required value={form.order} onChange={e => updateField('order', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Video URL (Bunny.net, YouTube, Drive link)</label>
            <input className="admin-input" required value={form.url} onChange={e => updateField('url', e.target.value)} placeholder="https://iframe.mediadelivery.net/embed/..." />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              * We will try to automatically extract thumbnails for Bunny.net links.
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Custom Thumbnail URL (Optional)</label>
            <input className="admin-input" value={form.thumbnail} onChange={e => updateField('thumbnail', e.target.value)} placeholder="https://.../image.jpg" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="admin-input" rows={3} value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Lesson overview..." />
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              {editingId ? 'Update Video' : 'Add Video'}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setEditingId(null); setForm({ title: '', description: '', url: '', thumbnail: '', order: 0 }) }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 80 }}>Thumb</th>
              <th>Order</th>
              <th>Title</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Loading videos...</td></tr>
            ) : videos.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No videos added yet.</td></tr>
            ) : (
              videos.map(v => (
                <tr key={v._id}>
                  <td>
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt="thumb" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <div style={{ width: 60, height: 40, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>No img</div>
                    )}
                  </td>
                  <td>{v.order}</td>
                  <td><div style={{ fontWeight: 600 }}>{v.title}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.description?.substring(0, 40)}...</div></td>
                  <td><div style={{ fontSize: 11, fontFamily: 'monospace', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.url}>{v.url}</div></td>
                  <td>
                    <button className="admin-btn admin-btn-ghost" style={{ padding: '4px 8px', fontSize: 12, marginRight: 8 }} onClick={() => handleEdit(v)}>Edit</button>
                    <button className="admin-btn admin-btn-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'red' }} onClick={() => handleDelete(v._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
