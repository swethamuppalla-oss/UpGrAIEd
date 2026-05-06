import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * RootLayout — wraps all V2 pages.
 * Add shared nav / footer here as sections are built out.
 */
export default function RootLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#0D2318' }}>
      <Outlet />
    </div>
  )
}
