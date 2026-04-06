import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import ParentDashboard from './pages/ParentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import VideoPlayer from './pages/VideoPlayer'
import ReservePage from './pages/ReservePage'
import PaymentPage from './pages/PaymentPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"   element={<Login />} />
            <Route path="/reserve" element={<ReservePage />} />

            {/* Student */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            {/* Parent */}
            <Route path="/dashboard/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Creator */}
            <Route path="/dashboard/creator" element={
              <ProtectedRoute allowedRoles={['creator']}>
                <CreatorDashboard />
              </ProtectedRoute>
            } />

            {/* Video player (student only) */}
            <Route path="/player/:moduleId?" element={
              <ProtectedRoute allowedRoles={['student']}>
                <VideoPlayer />
              </ProtectedRoute>
            } />

            {/* Payment (parent only) */}
            <Route path="/payment" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <PaymentPage />
              </ProtectedRoute>
            } />

            {/* Catch-all → login */}
            <Route path="/"  element={<Navigate to="/login" replace />} />
            <Route path="*"  element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
