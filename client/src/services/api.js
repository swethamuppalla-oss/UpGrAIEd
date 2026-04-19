import axios from 'axios'

const api = axios.create({
  baseURL: ''
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const sendOtp = (email) =>
  api.post('/api/auth/send-otp', { email }).then(r => r.data)
export const verifyOtp = (email, otp) =>
  api.post('/api/auth/verify-otp', { email, otp }).then(r => r.data)
export const adminLogin = (email, password) =>
  api.post('/api/auth/admin-login', { email, password }).then(r => r.data)
export const demoLogin = (role) =>
  api.post('/api/auth/demo-login', { role }).then(r => r.data)

// Student
export const getStudentProgress = () =>
  api.get('/api/student/progress').then(r => r.data)
export const getStudentStats = () =>
  api.get('/api/student/stats').then(r => r.data)
export const getStudentLevels = () =>
  api.get('/api/student/levels').then(r => r.data)
export const getCurriculum = () =>
  api.get('/api/student/curriculum').then(r => r.data)

// Video
export const getStreamUrl = (moduleId) =>
  api.get(`/api/videos/${moduleId}/stream-url`).then(r => r.data)
export const getModuleProgress = (moduleId) =>
  api.get(`/api/videos/${moduleId}/my-progress`).then(r => r.data)
export const postProgress = (moduleId, percent) =>
  api.post(`/api/videos/${moduleId}/progress`, { percent }).then(r => r.data)

// Parent
export const getChildInfo = () =>
  api.get('/api/parent/child').then(r => r.data)
export const getChildActivity = () =>
  api.get('/api/parent/activity').then(r => r.data)
export const getParentBilling = () =>
  api.get('/api/parent/billing').then(r => r.data)
export const getPaymentStatus = () =>
  api.get('/api/parent/payment-status').then(r => r.data)

// Admin
export const getAdminStats = () =>
  api.get('/api/admin/stats').then(r => r.data)
export const getReservations = () =>
  api.get('/api/admin/reservations').then(r => r.data)
export const approveReservation = (id) =>
  api.post(`/api/admin/approve/${id}`).then(r => r.data)
export const getAdminPayments = () =>
  api.get('/api/admin/payments').then(r => r.data)
export const getAdminUsers = () =>
  api.get('/api/admin/users').then(r => r.data)
export const blockUser = (id) =>
  api.post(`/api/admin/users/${id}/block`).then(r => r.data)
export const unblockUser = (id) =>
  api.post(`/api/admin/users/${id}/unblock`).then(r => r.data)

// Creator
export const getCreatorStats = () =>
  api.get('/api/creator/stats').then(r => r.data)
export const getCreatorVideos = () =>
  api.get('/api/creator/videos').then(r => r.data)
export const uploadVideo = (formData, onProgress) =>
  api.post('/api/creator/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress)
        onProgress(Math.round((e.loaded * 100) / e.total))
    }
  }).then(r => r.data)

// ROB Student
export const getROBQuiz = (moduleId) =>
  api.get(`/api/rob/quiz${moduleId ? `?moduleId=${moduleId}` : ''}`).then(r => r.data)
export const chatWithROB = (question, moduleId) =>
  api.post('/api/rob/chat', { question, moduleId }).then(r => r.data)
export const saveROBXP = (xp, level, badges, extra = {}) =>
  api.post('/api/rob/xp', { xp, level, badges, ...extra }).then(r => r.data)
export const getROBProgress = () =>
  api.get('/api/rob/progress').then(r => r.data)
export const getROBKnowledge = (moduleId) =>
  api.get(`/api/rob/knowledge/${moduleId}`).then(r => r.data)
export const getRobCompanion = () =>
  api.get('/api/rob/companion').then(r => r.data)
export const saveRobCompanionState = (data) =>
  api.post('/api/rob/companion', data).then(r => r.data)

// ROB Creator
export const trainROBConcept = (data) =>
  api.post('/api/rob/train', data).then(r => r.data)
export const getCreatorROBKnowledge = () =>
  api.get('/api/rob/creator/knowledge').then(r => r.data)
export const deleteROBKnowledge = (id) =>
  api.delete(`/api/rob/knowledge/${id}`).then(r => r.data)
export const publishROBModule = (moduleId) =>
  api.post(`/api/rob/publish/${moduleId}`).then(r => r.data)
export const getRobIntelligence = () =>
  api.get('/api/rob/intelligence').then(r => r.data)

// Reservation
export const createReservation = (data) =>
  api.post('/api/reserve', data).then(r => r.data)
export const checkPhone = (phone) =>
  api.get(`/api/reserve/check/${phone}`).then(r => r.data)

// Payment
export const createPaymentOrder = () =>
  api.post('/api/payments/create-order').then(r => r.data)
export const verifyPayment = (data) =>
  api.post('/api/payments/verify', data).then(r => r.data)

export default api
