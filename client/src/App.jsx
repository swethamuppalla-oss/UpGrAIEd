import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login            from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard  from './pages/ParentDashboard';
import AdminDashboard   from './pages/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import VideoPlayer      from './pages/VideoPlayer';
import ReservePage      from './pages/ReservePage';
import PaymentPage      from './pages/PaymentPage';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1625',
            color: '#F0EEF8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#7B3FE4', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#E4398A', secondary: '#fff' } },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"   element={<Login />} />
          <Route path="/reserve" element={<ReservePage />} />

          {/* Student */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/player/:moduleId" element={
            <ProtectedRoute roles={['student']}><VideoPlayer /></ProtectedRoute>
          } />

          {/* Parent */}
          <Route path="/dashboard/parent" element={
            <ProtectedRoute roles={['parent']}><ParentDashboard /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute roles={['parent']}><PaymentPage /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          {/* Creator */}
          <Route path="/dashboard/creator" element={
            <ProtectedRoute roles={['creator']}><CreatorDashboard /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
