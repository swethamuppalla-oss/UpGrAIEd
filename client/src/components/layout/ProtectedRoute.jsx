import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps a route so only authenticated users with the correct role can access it.
 * Usage: <Route element={<ProtectedRoute roles={['student']} />}>
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
