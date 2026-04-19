import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import ReservePage from './pages/ReservePage'
import StudentDashboard from './pages/StudentDashboard'
import VideoPlayer from './pages/VideoPlayer'
import ParentDashboard from './pages/ParentDashboard'
import PaymentPage from './pages/PaymentPage'
import AdminDashboard from './pages/AdminDashboard'
import CreatorDashboard from './pages/CreatorDashboard'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reserve" element={<ReservePage />} />

          {/* Student routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['student']} />
          }>
            <Route path="/dashboard/student"
              element={<StudentDashboard />} />
            <Route path="/player/:moduleId?"
              element={<VideoPlayer />} />
          </Route>

          {/* Parent routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['parent']} />
          }>
            <Route path="/dashboard/parent"
              element={<ParentDashboard />} />
            <Route path="/payment"
              element={<PaymentPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['admin']} />
          }>
            <Route path="/dashboard/admin"
              element={<AdminDashboard />} />
          </Route>

          {/* Creator routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['creator']} />
          }>
            <Route path="/dashboard/creator"
              element={<CreatorDashboard />} />
          </Route>

          {/* Fallbacks */}
          <Route path="/"
            element={<Navigate to="/login" replace />} />
          <Route path="*"
            element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
