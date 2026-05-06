import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout'

const UpgraiedLanding   = lazy(() => import('../pages/UpgraiedLanding'))
const StudentDashboard  = lazy(() => import('./pages/StudentDashboard'))

function Spinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(110,220,95,0.2)',
        borderTop: '3px solid #6EDC5F',
        animation: 'bloom-spin-slow 0.9s linear infinite',
      }} />
    </div>
  )
}

/**
 * Upgraied V2 app sub-tree.
 * Rendered inside the existing BrowserRouter in root App.jsx,
 * mounted at /upgraied/*.
 */
export default function UpgraiedApp() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<UpgraiedLanding />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="*" element={<Navigate to="/upgraied" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
