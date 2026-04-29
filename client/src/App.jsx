import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RobProvider } from './context/RobContext'
import { ToastProvider } from './components/ui/Toast'
import { ConfigProvider } from './context/ConfigContext'
import { StudentProgressProvider } from './context/StudentProgressContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { applyTheme, getAutoTheme } from "./theme/themeUtils";

// ── Eagerly loaded (small / critical path) ────────────────────────────────────
import Login from './pages/Login'
import ReservePage from './pages/ReservePage'
import LandingPage from './pages/LandingPage'
import WhyUpgraied from './pages/WhyUpgraied'
import PricingPage from './pages/PricingPage'
import BookDemoPage from './pages/BookDemoPage'

// ── Lazily loaded (heavy / role-gated) ────────────────────────────────────────
const StudentDashboard   = lazy(() => import('./pages/StudentDashboard'))
const BloomDashboard     = lazy(() => import('./pages/BloomDashboard'))
const VideoPlayer        = lazy(() => import('./pages/VideoPlayer'))
const LessonPage         = lazy(() => import('./pages/LessonPage'))
const ModuleOnePage      = lazy(() => import('./pages/ModuleOnePage'))
const ParentDashboard    = lazy(() => import('./pages/ParentDashboard'))
const WeekPlanView       = lazy(() => import('./pages/WeekPlanView'))
const PaymentPage        = lazy(() => import('./pages/PaymentPage'))
const AdminDashboard     = lazy(() => import('./pages/AdminDashboard'))
const AdminControlPanel  = lazy(() => import('./pages/AdminControlPanel'))
const CreatorDashboard   = lazy(() => import('./pages/CreatorDashboard'))

function PageSpinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A1F12',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '4px solid rgba(110,220,95,0.15)',
        borderTop: '4px solid #6EDC5F',
        animation: 'bloom-spin-slow 0.9s linear infinite',
      }} />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    let configTheme = null;
    try {
      const raw = localStorage.getItem('upgraied_config_v2');
      if (raw) configTheme = JSON.parse(raw).data?.theme?.mode;
    } catch (e) {}

    const savedTheme = configTheme || localStorage.getItem("theme");

    if (savedTheme && savedTheme !== "auto") {
      applyTheme(savedTheme);
    } else {
      const autoTheme = getAutoTheme();
      applyTheme(autoTheme);
    }
  }, []);

  return (
    <ConfigProvider>
      <StudentProgressProvider>
        <RobProvider>
          <AuthProvider>
            <ToastProvider>
              <BrowserRouter>
                <Suspense fallback={<PageSpinner />}>
                  <Routes>
                    {/* Public marketing */}
                    <Route path="/"          element={<LandingPage />} />
                    <Route path="/why"       element={<WhyUpgraied />} />
                    <Route path="/pricing"   element={<PricingPage />} />
                    <Route path="/book-demo" element={<BookDemoPage />} />

                    {/* Auth */}
                    <Route path="/login"   element={<Login />} />
                    <Route path="/reserve" element={<ReservePage />} />

                    {/* Student */}
                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                      <Route path="/dashboard/student"       element={<StudentDashboard />} />
                      <Route path="/dashboard/student/bloom" element={<BloomDashboard />} />
                      <Route path="/player/:moduleId?"       element={<VideoPlayer />} />
                      <Route path="/lesson/:lessonId?"       element={<LessonPage />} />
                      <Route path="/student/module/1"        element={<ModuleOnePage />} />
                    </Route>

                    {/* Parent */}
                    <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                      <Route path="/dashboard/parent" element={<ParentDashboard />} />
                      <Route path="/payment"          element={<PaymentPage />} />
                      <Route path="/dashboard/parent/weekplan/:planId" element={<WeekPlanView />} />
                    </Route>

                    {/* Admin */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/dashboard/admin" element={<AdminDashboard />} />
                      <Route path="/admin-control"   element={<AdminControlPanel />} />
                    </Route>

                    {/* Creator */}
                    <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
                      <Route path="/dashboard/creator" element={<CreatorDashboard />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </RobProvider>
      </StudentProgressProvider>
    </ConfigProvider>
  )
}
