import { useState, useEffect } from 'react';

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem('upgraied_admin') === 'true'
  );

  const enable  = () => { localStorage.setItem('upgraied_admin', 'true');  setIsAdmin(true);  };
  const disable = () => { localStorage.setItem('upgraied_admin', 'false'); setIsAdmin(false); };
  const toggle  = () => (isAdmin ? disable() : enable());

  // Auto-enable from ?admin=1 URL param
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('admin') === '1') enable();
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'upgraied_admin') setIsAdmin(e.newValue === 'true');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { isAdmin, enable, disable, toggle };
}
