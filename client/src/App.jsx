import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RobProvider } from './context/RobContext'
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
import LessonPage from './pages/LessonPage'
import ModuleOnePage from './pages/ModuleOnePage'
import { StudentProgressProvider } from './context/StudentProgressContext'
import BloomDashboard from './pages/BloomDashboard'
import LandingPage from './pages/LandingPage'
import WhyUpgraied from './pages/WhyUpgraied'
import PricingPage from './pages/PricingPage'
import BookDemoPage from './pages/BookDemoPage'

export default function App() {
  return (
    <StudentProgressProvider>
    <RobProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
          {/* Public growth / marketing routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/why" element={<WhyUpgraied />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/book-demo" element={<BookDemoPage />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reserve" element={<ReservePage />} />

          {/* Student routes */}
          <Route element={
            <ProtectedRoute allowedRoles={['student']} />
          }>
            <Route path="/dashboard/student"
              element={<StudentDashboard />} />
            <Route path="/dashboard/student/bloom"
              element={<BloomDashboard />} />
            <Route path="/player/:moduleId?"
              element={<VideoPlayer />} />
            <Route path="/lesson/:lessonId?"
              element={<LessonPage />} />
            <Route path="/student/module/1"
              element={<ModuleOnePage />} />
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

          {/* Fallback */}
          <Route path="*"
            element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </RobProvider>
    </StudentProgressProvider>
  )
}
