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
