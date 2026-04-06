import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// ── Request interceptor: attach token from localStorage ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('upgraied_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: handle 401 by redirecting to login ────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('upgraied_token')
      localStorage.removeItem('upgraied_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const sendOtp   = (phone)      => api.post('/auth/send-otp',    { phone })
export const verifyOtp = (phone, otp) => api.post('/auth/verify-otp',  { phone, otp })

// ── Parent ───────────────────────────────────────────────────────────────────
export const getChildInfo      = ()  => api.get('/parent/child')
export const getChildActivity  = ()  => api.get('/parent/activity')
export const getParentBilling  = ()  => api.get('/parent/billing')
export const getPaymentStatus  = ()  => api.get('/parent/payment-status')

// ── Admin ────────────────────────────────────────────────────────────────────
export const getAdminStats      = ()   => api.get('/admin/stats')
export const getReservations    = ()   => api.get('/admin/reservations')
export const approveReservation = (id) => api.post(`/admin/approve/${id}`)
export const getAdminPayments   = ()   => api.get('/admin/payments')
export const getAdminUsers      = ()   => api.get('/admin/users')
export const blockUser          = (id) => api.post(`/admin/users/${id}/block`)
export const unblockUser        = (id) => api.post(`/admin/users/${id}/unblock`)

// ── Creator ──────────────────────────────────────────────────────────────────
export const getCreatorStats  = ()         => api.get('/creator/stats')
export const getCreatorVideos = ()         => api.get('/creator/videos')
export const uploadVideo      = (formData) => api.post('/creator/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})

// ── Student ──────────────────────────────────────────────────────────────────
export const getStudentCurriculum  = ()               => api.get('/student/curriculum')
export const getVideoStreamUrl     = (id)             => api.get(`/videos/${id}/stream-url`)
export const updateVideoProgress   = (id, percent)    => api.post(`/videos/${id}/progress`, { percentWatched: percent })
export const getModuleVideos       = (moduleId)       => api.get(`/videos/module/${moduleId}`)

// ── Payments ─────────────────────────────────────────────────────────────────
export const createOrder   = ()     => api.post('/payments/create-order')
export const verifyPayment = (data) => api.post('/payments/verify', data)

// ── Reserve ──────────────────────────────────────────────────────────────────
export const submitReservation = (data) => api.post('/reserve', data)

export default api
