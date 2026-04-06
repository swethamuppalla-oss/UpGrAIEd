import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Nested-route guard. Use as a layout route in App.jsx:
 *   <Route element={<ProtectedRoute allowedRoles={['student']} />}>
 *     <Route path="/dashboard/student" element={<StudentDashboard />} />
 *   </Route>
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  // Wait for localStorage hydration before deciding
  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#08060F',
        color: '#F0EEF8', fontFamily: 'Satoshi, sans-serif', fontSize: 14,
      }}>
        Loading…
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
