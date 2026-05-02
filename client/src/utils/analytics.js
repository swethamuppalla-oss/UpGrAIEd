export const EVENTS = {
  LANDING_VIEW:  'landing_view',
  CTA_CLICK:     'cta_click',
  AI_FIRST_USE:  'ai_first_use',
  LOGIN_SUCCESS: 'login_success',
  FIRST_SUCCESS: 'first_success',
};

export const trackEvent = (eventName, data = {}) => {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Event:', eventName, data);
  }
  if (!window.gtag) return;
  window.gtag('event', eventName, data);
};

export const identifyUser = (userId) => {
  if (!userId) return;
  if (import.meta.env.DEV) {
    console.log('[Analytics] Identify:', userId);
  }
  if (!window.gtag) return;
  window.gtag('set', { user_id: userId });
};
