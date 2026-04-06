import api from './api';

export const sendOtp    = (email)           => api.post('/api/auth/send-otp',    { email });
export const verifyOtp  = (email, otp)      => api.post('/api/auth/verify-otp',  { email, otp });
export const adminLogin = (email, password) => api.post('/api/auth/admin-login', { email, password });
export const demoLogin  = (role)            => api.post('/api/auth/demo-login',  { role });
export const logoutApi  = ()               => api.post('/api/auth/logout');
