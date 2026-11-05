"use client";
import { useEffect, useState } from "react";
import { THEME_KEY as KEY } from "@/lib/theme";

type Mode = "system" | "light" | "dark";
const OPTIONS: { mode: Mode; label: string }[] = [
  { mode: "light", label: "白天" },
  { mode: "dark", label: "夜間" },
  { mode: "system", label: "自動" },
];

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") delete root.dataset.theme;
  else root.dataset.theme = mode;
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#0d171c" : "#eef2f4"));
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (t === "light" || t === "dark") setMode(t);
    } catch {}
  }, []);
  const choose = (m: Mode) => {
    setMode(m);
    apply(m);
    try {
      localStorage.setItem(KEY, JSON.stringify(m));
    } catch {}
  };
  return (
    <div className="seg" role="radiogroup" aria-label="顯示模式">
      {OPTIONS.map((o) => (
        <button key={o.mode} role="radio" aria-checked={mode === o.mode} onClick={() => choose(o.mode)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
