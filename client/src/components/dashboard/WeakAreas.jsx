export default function WeakAreas({ areas = [], conceptsDone = 0, onPractice }) {
  return (
    <div className="dashboard-section">
      <h2>⚠️ Focus Areas</h2>

      {areas.length > 0 ? (
        areas.map((w, i) => (
          <div key={i} className="weak-card">
            <div className="weak-title">{w.conceptId}</div>
            <div className="weak-date">
              Last struggled: {new Date(w.lastSeenAt).toLocaleDateString()}
            </div>
          </div>
        ))
      ) : (
        <div className="empty">No weak areas yet 🎉</div>
      )}
    </div>
  )
}
