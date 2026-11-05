"use client";
import { useState } from "react";
import { BUILDINGS, EATERIES, type Building } from "@/data/campus";
import { useNow } from "@/lib/hooks";
import { isOpen } from "@/lib/time";
import { OpenPill, PageHead, Sample } from "@/components/ui";

const CATS = ["全部", "教學", "系館", "行政", "生活"] as const;

export default function Campus() {
  const now = useNow();
  const [cat, setCat] = useState<(typeof CATS)[number]>("全部");
  const [q, setQ] = useState("");
  const list = BUILDINGS.filter(
    (b: Building) => (cat === "全部" || b.type === cat) && (!q || (b.code + b.name + b.desc).toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <section className="view">
      <PageHead eyebrow="公館校區" title="校園" aside={<Sample />} />
      <div className="card">
        <h3>現在吃什麼</h3>
        <div className="list">
          {EATERIES.map((e) => (
            <div key={e.name} className="row between">
              <div style={{ minWidth: 0 }}>
                <b>{e.name}</b>
                <p className="small muted">{e.where}・{e.tag}</p>
                <p className="small muted mono">{e.hours.map((h) => h.join("–")).join("、")}</p>
              </div>
              {now && <OpenPill open={isOpen(e, now)} />}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3>建築代碼查詢</h3>
        <input id="building-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="輸入代碼或名稱，例如 TR、電資" autoComplete="off" />
        <div className="chips">
          {CATS.map((c) => (
            <button key={c} className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="list">
          {list.length ? (
            list.map((b) => (
              <div key={b.code} className="row">
                <span className="code" style={{ minWidth: 38, textAlign: "center" }}>{b.code}</span>
                <div style={{ minWidth: 0 }}>
                  <b>{b.name}</b>
                  <p className="small muted">{b.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">找不到「{q}」，試試看建築代碼。</p>
          )}
        </div>
      </div>
    </section>
  );
}
