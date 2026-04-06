import { useEffect, useRef } from 'react';
import { pingProgress } from '../services/video';
import { PROGRESS_PING_INTERVAL } from '../utils/constants';

/**
 * Pings the backend every 30s with the current video progress percent.
 * @param {string} videoId
 * @param {() => number} getPercent  — callback that returns the current percent (0-100)
 * @param {boolean} active           — set to false to pause pinging (e.g. video paused)
 */
export const useProgress = (videoId, getPercent, active = true) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!videoId || !active) return;

    timerRef.current = setInterval(async () => {
      const percent = getPercent();
      if (percent > 0) {
        try { await pingProgress(videoId, percent); } catch { /* silent */ }
      }
    }, PROGRESS_PING_INTERVAL * 1000);

    return () => clearInterval(timerRef.current);
  }, [videoId, active, getPercent]);
};
