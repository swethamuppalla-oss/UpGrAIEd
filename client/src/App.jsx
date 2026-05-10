import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RobProvider } from './context/RobContext'
import { ToastProvider } from './components/ui/Toast'
import { ConfigProvider } from './context/ConfigContext'
import { EditModeProvider } from './context/EditModeContext'
import { StudentProgressProvider } from './context/StudentProgressContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import { applyTheme, getAutoTheme, getSavedPalette, setPalette } from "./theme/themeUtils";
import { trackEvent } from './utils/analytics';
import { CMSProvider } from './cms/context/CMSContext'
import EditToolbar from './cms/components/EditToolbar'

// ── Eagerly loaded (small / critical path) ────────────────────────────────────
import Home from './pages/Home'
import Login from './pages/Login'
import ProductLayout from './layouts/ProductLayout'
import ReservePage from './pages/ReservePage'

import WhyUpgraied from './pages/WhyUpgraied'
import PricingPage from './pages/PricingPage'
import BookDemoPage from './pages/BookDemoPage'

// ── Lazily loaded (heavy / role-gated) ────────────────────────────────────────
const StudentDashboard   = lazy(() => import('./pages/StudentDashboard'))
const BloomDashboard     = lazy(() => import('./pages/BloomDashboard'))
const VideoPlayer        = lazy(() => import('./pages/VideoPlayer'))
const LessonPage         = lazy(() => import('./pages/LessonPage'))
const ModuleOnePage      = lazy(() => import('./pages/ModuleOnePage'))
const Practice           = lazy(() => import('./components/practice/Practice'))
const ParentDashboard    = lazy(() => import('./pages/ParentDashboard'))
const WeekPlanView       = lazy(() => import('./pages/WeekPlanView'))
const PaymentPage        = lazy(() => import('./pages/PaymentPage'))
const AdminDashboard        = lazy(() => import('./pages/AdminDashboard'))
const AdminControlPanel     = lazy(() => import('./pages/AdminControlPanel'))
const AdminContentEditor    = lazy(() => import('./pages/AdminContentEditor'))
const AdminVideoCMS         = lazy(() => import('./pages/AdminVideoCMS'))
const AdminUIConfigurator   = lazy(() => import('./pages/AdminUIConfigurator'))
// ── Public landing ────────────────────────────────────────────────────────────
const UpgraiedLanding  = lazy(() => import('./pages/UpgraiedLanding'))

// ── Product routing ───────────────────────────────────────────────────────────
const UpgrEdLanding  = lazy(() => import('./pages/upgr-ed/UpgrEdLanding'))

// ── Brand home ────────────────────────────────────────────────────────────────
const BrandHomePage = lazy(() => import('./brand/pages/HomePage'))

// ── Admin website editor ──────────────────────────────────────────────────────
const AdminWebsiteEditorPage = lazy(() => import('./learning/admin/pages/AdminWebsiteEditorPage'))

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

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageSpinner />

  return (
    <StudentProgressProvider>
      <RobProvider>
        <ToastProvider>
          <EditModeProvider>
            <CMSProvider>
              <Suspense fallback={<PageSpinner />}>
                <Routes>
                {/* Root: product gateway */}
                <Route path="/" element={<Home />} />

                {/* UpGrAIEd landing */}
                <Route path="/upgraied" element={<UpgraiedLanding />} />

                {/* UpGrEd landing */}
                <Route path="/upgred" element={<UpgrEdLanding />} />

                {/* Public marketing */}
                <Route path="/why"         element={<WhyUpgraied />} />
                <Route path="/pricing"     element={<PricingPage />} />
                <Route path="/book-demo"   element={<BookDemoPage />} />

                {/* Brand home */}
                <Route path="/brand" element={<BrandHomePage />} />

                {/* Auth */}
                <Route path="/login"   element={<Login />} />
                <Route path="/reserve" element={<ReservePage />} />

                {/* Student */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/dashboard/student"       element={<StudentDashboard />} />
                  <Route path="/dashboard/student/bloom" element={<BloomDashboard />} />
                  <Route path="/player/:moduleId?"       element={<VideoPlayer />} />
                  <Route path="/lesson/:lessonId?"       element={<LessonPage />} />
                  <Route path="/student/module/:moduleNumber" element={<ModuleOnePage />} />
                  <Route path="/student/practice"        element={<Practice />} />
                </Route>

                {/* Parent */}
                <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                  <Route path="/dashboard/parent" element={<ParentDashboard />} />
                  <Route path="/payment"          element={<PaymentPage />} />
                  <Route path="/dashboard/parent/weekplan/:planId" element={<WeekPlanView />} />
                </Route>

                {/* Admin */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/dashboard/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                  <Route path="/admin-control"   element={<AdminLayout><AdminControlPanel /></AdminLayout>} />
                  <Route path="/admin/content"   element={<AdminLayout><AdminContentEditor /></AdminLayout>} />
                  <Route path="/admin/videos"    element={<AdminLayout><AdminVideoCMS /></AdminLayout>} />
                  <Route path="/admin/ui"        element={<AdminLayout><AdminUIConfigurator /></AdminLayout>} />
                  <Route path="/admin/website"   element={<AdminWebsiteEditorPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
              <EditToolbar />
            </CMSProvider>
          </EditModeProvider>
        </ToastProvider>
      </RobProvider>
    </StudentProgressProvider>
  )
}

export default function App() {
  useEffect(() => {
    // 1. Apply structural theme (light/dark/night)
    let configTheme = null;
    try {
      const raw = localStorage.getItem('upgraied_config_v2');
      if (raw) configTheme = JSON.parse(raw).data?.theme?.mode;
    } catch (e) {}

    const savedTheme = configTheme || localStorage.getItem("theme");
    if (savedTheme && savedTheme !== "auto") {
      applyTheme(savedTheme);
    } else {
      applyTheme(getAutoTheme());
    }

    // 2. Apply saved brand palette on top (sage/lavender/sky/rose/amber)
    const savedPalette = getSavedPalette();
    if (savedPalette) {
      applyTheme(savedPalette);
    } else {
      // Default: sage green
      applyTheme('sage');
    }

    trackEvent('page_view', { page: window.location.pathname });
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  )
}
