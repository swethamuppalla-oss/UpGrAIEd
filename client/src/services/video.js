import api from './api';

export const getStreamUrl     = (videoId)             => api.get(`/api/videos/${videoId}/stream`);
export const pingProgress     = (videoId, percent)    => api.post(`/api/videos/${videoId}/progress`, { percent });
export const getModuleVideos  = (moduleId)            => api.get(`/api/videos/${moduleId}`);
