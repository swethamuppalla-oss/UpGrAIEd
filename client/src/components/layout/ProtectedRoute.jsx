import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isTokenExpired } from '../../services/authService'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, isLoading } = useAuth()

  if (isLoading) return (
    <div style={{
      display:'flex', alignItems:'center',
      justifyContent:'center', height:'100vh',
      background:'#08060F', color:'#F0EEF8',
      fontFamily:'Satoshi,sans-serif', fontSize:'14px'
    }}>
      Loading...
    </div>
  )

  if (!token || !user || isTokenExpired(token)) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />

  return <Outlet />
}
