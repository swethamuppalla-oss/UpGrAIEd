import { useState, useEffect, useRef } from 'react';
import { cmsKey } from '../components/cms';

export function useCMSContent(pageKey, defaults = {}) {
  const storageKey = cmsKey(pageKey);
  const saveTimer  = useRef(null);

  const [content, setContent] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch {
      return defaults;
    }
  });

  // Persist on change, debounced
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(content));
      } catch { /* quota exceeded */ }
      // TODO: persist to API
    }, 500);

    return () => clearTimeout(saveTimer.current);
  }, [content, storageKey]);

  const update = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  return { content, update };
}
