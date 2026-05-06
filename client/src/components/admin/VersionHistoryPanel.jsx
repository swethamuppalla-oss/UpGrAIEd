import { useState, useEffect } from 'react'
import { getConfigByKey } from '../../services'
import { useEditMode } from '../../context/EditModeContext'
import { useToast } from '../ui/Toast'

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function VersionHistoryPanel({ onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(null)
  const { restoreVersion } = useEditMode()
  const { showToast } = useToast()

  useEffect(() => {
    getConfigByKey('ui_history')
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRestore = async (entry, index) => {
    if (restoring !== null) return
    setRestoring(index)
    try {
      await restoreVersion(entry.snapshot)
      showToast('Version restored successfully', 'success')
      onClose()
    } catch (err) {
      showToast(err.message || 'Restore failed', 'error')
      setRestoring(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1199,
          background: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1200,
        width: '340px',
        background: 'linear-gradient(160deg, #0D2318, #0A1F12)',
        borderLeft: '1px solid rgba(110,220,95,0.18)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(110,220,95,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ margin: 0, color: '#F0FFF4', fontSize: '15px', fontWeight: 700 }}>
              Version History
            </h3>
            <p style={{ margin: '4px 0 0', color: 'rgba(168,245,162,0.5)', fontSize: '12px' }}>
              Last {history.length} saved versions
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(168,245,162,0.6)', fontSize: '20px', lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {loading && (
            <p style={{ color: 'rgba(168,245,162,0.5)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
              Loading…
            </p>
          )}

          {!loading && history.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕐</div>
              <p style={{ color: 'rgba(168,245,162,0.5)', fontSize: '13px' }}>
                No saved versions yet.<br />Versions are saved automatically when you publish.
              </p>
            </div>
          )}

          {!loading && history.map((entry, i) => (
            <div key={i} style={{
              background: 'rgba(22,43,31,0.7)',
              border: '1px solid rgba(110,220,95,0.12)',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ color: '#A8F5A2', fontSize: '13px', fontWeight: 600 }}>
                    Version {history.length - i}
                  </div>
                  <div style={{ color: 'rgba(168,245,162,0.5)', fontSize: '11px', marginTop: '2px' }}>
                    {formatTimestamp(entry.savedAt)}
                  </div>
                </div>
                {i === 0 && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                    color: '#6EDC5F', background: 'rgba(110,220,95,0.12)',
                    padding: '2px 8px', borderRadius: '50px',
                  }}>
                    LATEST
                  </span>
                )}
              </div>

              {/* Preview snippet */}
              {entry.snapshot?.sections?.hero?.title && (
                <p style={{
                  color: 'rgba(168,245,162,0.45)', fontSize: '11px',
                  margin: '0 0 12px', fontStyle: 'italic',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  "{entry.snapshot.sections.hero.title}"
                </p>
              )}

              <button
                onClick={() => handleRestore(entry, i)}
                disabled={restoring !== null}
                style={{
                  width: '100%', padding: '7px', borderRadius: '7px',
                  background: restoring === i ? 'rgba(110,220,95,0.2)' : 'rgba(110,220,95,0.1)',
                  border: '1px solid rgba(110,220,95,0.25)',
                  color: restoring === i ? 'rgba(168,245,162,0.5)' : '#A8F5A2',
                  fontSize: '12px', fontWeight: 600, cursor: restoring !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {restoring === i ? 'Restoring…' : 'Restore this version'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
