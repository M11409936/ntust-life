import type { ReactNode } from "react";

export const Sample = ({ children = "範例資料" }: { children?: ReactNode }) => <span className="sample">{children}</span>;

export function PageHead({ eyebrow, title, aside }: { eyebrow: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="top">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {aside}
    </div>
  );
}

export function OpenPill({ open }: { open: boolean }) {
  return (
    <span className={`pill ${open ? "on" : "off"}`}>
      <span className="dot" />
      {open ? "營業中" : "休息"}
    </span>
  );
}
