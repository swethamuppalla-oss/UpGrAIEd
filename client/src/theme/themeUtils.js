import { themeConfig } from "./themeConfig";

/**
 * Applies a theme palette to the document root CSS variables.
 * Works with both structural themes (light/dark/night) and named pastel palettes
 * (sage, lavender, sky, rose, amber).
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;
  const config = themeConfig[theme];
  if (!config) return;
  Object.entries(config).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  // Tag the root so CSS can scope overrides
  root.setAttribute("data-palette", theme);
};

/**
 * Saves selected palette name to localStorage and applies it immediately.
 */
export const setPalette = (paletteName) => {
  localStorage.setItem("upgraied_palette", paletteName);
  applyTheme(paletteName);
};

/**
 * Reads saved palette from config → localStorage → auto fallback.
 */
export const getSavedPalette = () => {
  try {
    const raw = localStorage.getItem("upgraied_config_v2");
    if (raw) {
      const stored = JSON.parse(raw).data?.theme?.palette;
      if (stored) return stored;
    }
  } catch {}
  return localStorage.getItem("upgraied_palette") || null;
};

export const getAutoTheme = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return "light";
  if (hour >= 17 && hour < 20) return "dark";
  return "night";
};

