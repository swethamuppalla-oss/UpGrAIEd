import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_ROUTES = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  admin:   '/dashboard/admin',
  creator: '/dashboard/creator',
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the user's own dashboard
    return <Navigate to={ROLE_ROUTES[user?.role] || '/login'} replace />
  }

  return children
}
