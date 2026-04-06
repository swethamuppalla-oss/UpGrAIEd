import axios from 'axios';

// baseURL is '' — Vite proxy forwards /api/* to http://localhost:5000
const api = axios.create({ baseURL: '' });

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
