import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
