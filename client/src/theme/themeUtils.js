import { themeConfig } from "./themeConfig";

export const applyTheme = (theme) => {
  const root = document.documentElement;
  const config = themeConfig[theme];

  if (!config) return;

  Object.entries(config).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const getAutoTheme = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 17) return "light";
  if (hour >= 17 && hour < 20) return "dark";
  return "night";
};
