"use client";
import Link from "next/link";
import { EVENTS, ROUTES } from "@/data/campus";
import { useCourses } from "@/lib/courses";
import { useNow } from "@/lib/hooks";
import { dayBlocks, minutesOf, nextBusIn, openEateries, toMin, weekdayIndex } from "@/lib/time";
import { Sample } from "@/components/ui";

export default function Today() {
  const now = useNow();
  const { courses, isSample } = useCourses();
  if (!now) return <section className="view" aria-busy="true" />;

  const h = now.getHours();
  const hi = h < 11 ? "早安" : h < 14 ? "午安" : h < 18 ? "午後好" : "晚安";
  const m = minutesOf(now);
  const day = weekdayIndex(now);
  const blocks = dayBlocks(courses, day);
  const next = blocks.find((b) => toMin(b.end) > m);
  const bus = nextBusIn(now);
  const open = openEateries(now);
  const today = new Date(now.toDateString());
  const ev = EVENTS.find((e) => new Date(e.date + "T00:00") >= today);
  const days = ev ? Math.round((new Date(ev.date + "T00:00").getTime() - today.getTime()) / 864e5) : null;

  return (
    <section className="view">
      <div className="top">
        <div>
          <p className="eyebrow">
            {now.getMonth() + 1} 月 {now.getDate()} 日・星期{"日一二三四五六"[now.getDay()]}
          </p>
          <h1>{hi}，台科人</h1>
        </div>
      </div>

      <div className="card hero">
        <p className="small muted">
          {next ? (toMin(next.start) <= m ? "正在上課" : "下一堂課") : "今天"} {isSample && <Sample>範例課表</Sample>}
        </p>
        {next ? (
          <>
            <h2>{next.name}</h2>
            <div className="row wrap">
              <span className="mono">{next.start}–{next.end}</span>
              <span>第 {next.from}{next.to !== next.from ? `–${next.to}` : ""} 節</span>
              {next.room && <span className="code">{next.room}</span>}
            </div>
          </>
        ) : (
          <h2>{day < 0 ? "週末沒有課，好好休息" : "今天的課都上完了"}</h2>
        )}
      </div>

      <div className="card">
        <div className="row between">
          <h3>今日課程</h3>
          <Link className="btn small" href="/timetable">看課表</Link>
        </div>
        {blocks.length ? (
          <div className="list">
            {blocks.map((b) => (
              <div key={b.from} className="row between">
                <div style={{ minWidth: 0 }}>
                  <b>{b.name}</b>
                  <p className="small muted mono">{b.start}–{b.end}</p>
                </div>
                {b.room && <span className="code">{b.room}</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">今天沒有排課。</p>
        )}
      </div>

      <div className="card">
        <div className="row between">
          <h3>出門</h3>
          <Sample>範例班距</Sample>
        </div>
        <div className="dep">
          <span>基隆路「台灣科技大學」站下一班</span>
          <span className="count">{bus === null ? "末班已過" : `${bus} 分`}</span>
          <span className="muted small">走到{ROUTES[0].to}約 {ROUTES[0].mins} 分鐘</span>
        </div>
      </div>

      <div className="card">
        <div className="row between">
          <h3>現在營業</h3>
          <Link className="btn small" href="/campus">全部餐廳</Link>
        </div>
        {open.length ? (
          <div className="chips">
            {open.map((e) => (
              <span key={e.name} className="pill on"><span className="dot" />{e.name}</span>
            ))}
          </div>
        ) : (
          <p className="muted">目前校內餐廳都休息了。</p>
        )}
      </div>

      {ev && (
        <div className="card">
          <div className="row between">
            <h3>行事曆</h3>
            <Sample>範例</Sample>
          </div>
          <div className="row between">
            <span>{ev.title}</span>
            <span className="mono">{days === 0 ? "今天" : `${days} 天後`}</span>
          </div>
        </div>
      )}
    </section>
  );
}
