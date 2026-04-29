import { applyTheme, getAutoTheme } from "../../theme/themeUtils";

const ThemeToggle = () => {
  const setTheme = (theme) => {
    localStorage.setItem("theme", theme);

    if (theme === "auto") {
      applyTheme(getAutoTheme());
    } else {
      applyTheme(theme);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: 'fit-content' }}>
      <button className="ui-button-secondary" onClick={() => setTheme("light")} style={{ padding: '6px 12px' }}>Light</button>
      <button className="ui-button-secondary" onClick={() => setTheme("dark")} style={{ padding: '6px 12px' }}>Dark</button>
      <button className="ui-button-secondary" onClick={() => setTheme("night")} style={{ padding: '6px 12px' }}>Night</button>
      <button className="ui-button-primary" onClick={() => setTheme("auto")} style={{ padding: '6px 12px' }}>Auto</button>
    </div>
  );
};

export default ThemeToggle;
