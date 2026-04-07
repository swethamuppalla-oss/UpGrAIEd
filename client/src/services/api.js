import axios from 'axios';

// Dev: baseURL '' → Vite proxy forwards /api/* to localhost:5000
// Prod: VITE_API_URL must point to the deployed backend (e.g. https://upgraied-api.railway.app)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });

// REQUEST — attach JWT to every call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE — global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Student endpoints ─────────────────────────────────────────────────────────
export const getStudentProgress = () => api.get('/api/student/progress');
export const getStudentStats    = () => api.get('/api/student/stats');
export const getStudentLevels   = () => api.get('/api/student/levels');

// ── Parent endpoints ──────────────────────────────────────────────────────────
export const getChildInfo       = () => api.get('/api/parent/child').then((r) => r.data);
export const getChildActivity   = () => api.get('/api/parent/activity').then((r) => r.data);
export const getParentBilling   = () => api.get('/api/parent/billing').then((r) => r.data);

// ── Admin endpoints ───────────────────────────────────────────────────────────
export const getAdminStats      = () => api.get('/api/admin/stats').then((r) => r.data);
export const getReservations    = () => api.get('/api/admin/reservations').then((r) => r.data);
export const approveReservation = (id) => api.post(`/api/admin/approve/${id}`).then((r) => r.data);
export const getAdminPayments   = () => api.get('/api/admin/payments').then((r) => r.data);
export const getAdminUsers      = (params) => api.get('/api/admin/users', { params }).then((r) => r.data);
export const blockUser          = (id) => api.post(`/api/admin/users/${id}/block`).then((r) => r.data);
export const unblockUser        = (id) => api.post(`/api/admin/users/${id}/unblock`).then((r) => r.data);

// —— Creator endpoints ———————————————————————————————————————————————————————————
export const getCreatorStats    = () => api.get('/api/creator/stats').then((r) => r.data);
export const getCreatorVideos   = () => api.get('/api/creator/videos').then((r) => r.data);
export const uploadVideo        = (formData, onProgress) =>
  api.post('/api/creator/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total || progressEvent.loaded || 1;
      const percent = Math.round((progressEvent.loaded * 100) / total);
      if (typeof onProgress === 'function') {
        onProgress(percent);
      }
      return percent;
    },
  }).then((r) => r.data);

// Legacy — kept for backward compat
export const getAdminAnalytics  = () => api.get('/api/admin/analytics');
