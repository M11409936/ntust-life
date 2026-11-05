"use client";
import { useState } from "react";
import { DEFAULT_FAVORITES, PORTAL_URL, SERVICE_GROUPS, type Service } from "@/data/services";
import { useStored } from "@/lib/hooks";
import { PageHead } from "@/components/ui";

export default function Services() {
  const [favs, setFavs] = useStored<string[]>("favServices", DEFAULT_FAVORITES);
  const [q, setQ] = useState("");
  const toggle = (id: string) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);
  const match = (s: Service) => !q || s.name.toLowerCase().includes(q.toLowerCase());
  const groups = SERVICE_GROUPS.map((g) => ({ ...g, items: g.items.filter(match) })).filter((g) => g.items.length);

  return (
    <section className="view">
      <PageHead eyebrow="學生專區" title="校務服務" />
      <p className="small muted">
        點名稱會開啟學校的系統，登入一律在學校網站完成，這個 app 不會經手你的帳號密碼。按星號可以把常用的放到「今日」頁。
      </p>
      <input id="service-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋，例如 成績、宿舍、獎學金" autoComplete="off" />
      {groups.map((g) => (
        <div key={g.title} className="card">
          <h3>{g.title}</h3>
          <div className="list">
            {g.items.map((s) => (
              <div key={s.id} className="svc">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <b>{s.name}</b>
                  {s.login && <span className="pill small">需登入</span>}
                </a>
                <button className="star" aria-pressed={favs.includes(s.id)} aria-label={`${favs.includes(s.id) ? "取消收藏" : "收藏"} ${s.name}`} onClick={() => toggle(s.id)}>
                  {favs.includes(s.id) ? "★" : "☆"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!groups.length && <p className="muted">找不到「{q}」，換個關鍵字試試。</p>}
      <a className="btn" href={PORTAL_URL} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none" }}>
        開啟完整的學生專區
      </a>
    </section>
  );
}
