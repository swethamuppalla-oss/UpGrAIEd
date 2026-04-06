export const API_URL = import.meta.env.VITE_API_URL || '';

export const ROLES = {
  STUDENT: 'student',
  PARENT:  'parent',
  ADMIN:   'admin',
  CREATOR: 'creator',
};

export const ROLE_HOME = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  admin:   '/dashboard/admin',
  creator: '/dashboard/creator',
};

export const VIDEO_COMPLETE_THRESHOLD = 85; // percent
export const PROGRESS_PING_INTERVAL   = 30; // seconds
