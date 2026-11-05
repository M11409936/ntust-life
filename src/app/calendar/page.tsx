"use client";
import { useState, type FormEvent } from "react";
import { DEFAULT_WISHES, EVENTS, SEMESTER_LABEL } from "@/data/campus";
import { useNow, useStored } from "@/lib/hooks";
import { PageHead, Sample } from "@/components/ui";

export default function Calendar() {
  const now = useNow();
  const today = now ? new Date(now.toDateString()) : null;
  // 許願池目前只存在本機；之後改存 Supabase 讓大家共用
  const [wishes, setWishes] = useStored("wishes", DEFAULT_WISHES);
  const [votes, setVotes] = useStored<Record<string, boolean>>("votes", {});
  const [draft, setDraft] = useState("");

  const toggle = (text: string) => {
    const on = !votes[text];
    setWishes(wishes.map((w) => (w.text === text ? { ...w, votes: w.votes + (on ? 1 : -1) } : w)));
    const v = { ...votes };
    if (on) v[text] = true;
    else delete v[text];
    setVotes(v);
  };
  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t || wishes.some((w) => w.text === t)) return setDraft("");
    setWishes([...wishes, { text: t, votes: 1 }]);
    setVotes({ ...votes, [t]: true });
    setDraft("");
  };

  return (
    <section className="view">
      <PageHead eyebrow={SEMESTER_LABEL} title="行事曆" aside={<Sample>範例日期</Sample>} />
      <div className="card">
        <div className="list">
          {EVENTS.map((e) => {
            const dt = new Date(e.date + "T00:00");
            const past = today ? dt < today : false;
            return (
              <div key={e.date + e.title} className="ev" style={past ? { opacity: 0.5 } : undefined}>
                <div className="d">
                  <span className="small">{dt.getMonth() + 1}月</span>
                  <b>{dt.getDate()}</b>
                </div>
                <div>
                  <b>{e.title}</b>
                  <p className="small muted">{e.kind}{past ? "・已過" : ""}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h3>許願池</h3>
        <p className="small muted">想要什麼功能？投票讓我們知道先做哪個。</p>
        <form className="row" onSubmit={add}>
          <input id="wish" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="例如：圖書館座位查詢" autoComplete="off" />
          <button className="btn primary" style={{ whiteSpace: "nowrap" }}>許願</button>
        </form>
        <div className="list">
          {[...wishes].sort((a, b) => b.votes - a.votes).map((w) => (
            <div key={w.text} className="wish">
              <button className="vote" aria-pressed={!!votes[w.text]} aria-label={`投票給 ${w.text}`} onClick={() => toggle(w.text)}>
                ▲<span>{w.votes}</span>
              </button>
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
