"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      className="icon-btn"
      onClick={toggle}
      title={theme === "dark" ? "เปลี่ยนเป็น Light mode" : "เปลี่ยนเป็น Dark mode"}
      aria-label="toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
