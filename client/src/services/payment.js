import api from './api';

export const createOrder   = (enrollmentId) => api.post('/api/payments/create-order', { enrollmentId });
export const verifyPayment = (payload)      => api.post('/api/payments/verify', payload);
export const getInvoice    = (paymentId)    => api.get(`/api/payments/invoice/${paymentId}`);
