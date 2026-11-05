"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "今日", icon: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /> },
  { href: "/timetable", label: "課表", icon: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 4v17M3 15h18" /></> },
  { href: "/transit", label: "交通", icon: <><rect x="4" y="3" width="16" height="14" rx="3" /><path d="M4 11h16M8 21l1-4M16 21l-1-4" /></> },
  { href: "/campus", label: "校園", icon: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></> },
  { href: "/calendar", label: "行事曆", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
];

export default function TabBar() {
  const path = usePathname();
  return (
    <div className="tabs">
      <nav aria-label="主選單">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className="tab" aria-current={path === t.href ? "page" : undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{t.icon}</svg>
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
