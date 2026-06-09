import { useEffect, useState } from "react";

function getInitialTheme() {
  const savedTheme = localStorage.getItem("stackbook-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("stackbook-theme", theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="theme-toggle__indicator" aria-hidden="true" />
      {isDark ? "Tema claro" : "Tema oscuro"}
    </button>
  );
}

export default ThemeToggle;
