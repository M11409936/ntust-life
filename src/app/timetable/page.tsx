"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DAY_PERIODS, PERIODS, SEMESTER_LABEL, WEEKDAYS, type Course } from "@/data/campus";
import { useCourses } from "@/lib/courses";
import { useNow, useStored } from "@/lib/hooks";
import { colorFor, currentPeriod, weekdayIndex } from "@/lib/time";
import { PageHead, Sample } from "@/components/ui";

export default function Timetable() {
  const now = useNow();
  const { courses, isSample, save } = useCourses();
  const [night, setNight] = useStored("night", false);
  const [editing, setEditing] = useState<string | null>(null);

  const day = now ? weekdayIndex(now) : -1;
  const cp = now ? currentPeriod(now) : -1;
  const rows = PERIODS.map((p, i) => ({ p, i })).filter((r) => night || r.i < DAY_PERIODS);

  return (
    <section className="view">
      <PageHead eyebrow={SEMESTER_LABEL} title={<>我的課表 {isSample && <Sample>範例課表</Sample>}</>} />
      <div className="row between wrap">
        <p className="small muted">點格子新增或修改課程</p>
        <div className="row">
          <button className="btn small" aria-pressed={night} onClick={() => setNight(!night)}>
            {night ? "隱藏" : "顯示"}夜間 A–D 節
          </button>
          {isSample && <button className="btn small" onClick={() => save({})}>清空範例</button>}
        </div>
      </div>

      <div className="tt-wrap">
        <div className="tt">
          <div className="hd" />
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`hd${i === day ? " today" : ""}`}>{w}</div>
          ))}
          {rows.map(({ p, i }) => (
            <Row key={p.id} i={i} now={i === cp && day >= 0} courses={courses} onEdit={setEditing} />
          ))}
        </div>
      </div>

      <Link className="btn primary" href="/courses" style={{ textAlign: "center", textDecoration: "none" }}>
        搜尋台科大開課資料，加入課表
      </Link>

      {editing && (
        <Editor
          k={editing}
          courses={courses}
          onClose={() => setEditing(null)}
          onSave={(c) => {
            save(c);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function Row({ i, now, courses, onEdit }: { i: number; now: boolean; courses: Record<string, Course>; onEdit: (k: string) => void }) {
  const p = PERIODS[i];
  return (
    <>
      <div className={`pd${now ? " now" : ""}`}>
        <b>{p.id}</b>
        <span>{p.start}</span>
      </div>
      {WEEKDAYS.map((w, d) => {
        const k = `${d}-${i}`;
        const c = courses[k];
        return (
          <div key={k}>
            <button
              className={`cell${c ? " has" : ""}`}
              style={c ? ({ "--c": colorFor(c.name) } as React.CSSProperties) : undefined}
              aria-label={`星期${w}第${p.id}節${c ? "：" + c.name : "，空堂"}`}
              onClick={() => onEdit(k)}
            >
              {c && (
                <>
                  <span className="n">{c.name}</span>
                  <span className="r">{c.room}</span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}

function Editor({ k, courses, onClose, onSave }: { k: string; courses: Record<string, Course>; onClose: () => void; onSave: (c: Record<string, Course>) => void }) {
  const [d, i] = k.split("-").map(Number);
  const p = PERIODS[i];
  const existing = courses[k];
  const [name, setName] = useState(existing?.name ?? "");
  const [room, setRoom] = useState(existing?.room ?? "");
  const [alsoNext, setAlsoNext] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = { ...courses };
    const n = name.trim();
    if (!n) delete next[k];
    else {
      next[k] = { name: n, room: room.trim() };
      if (alsoNext && i + 1 < PERIODS.length) next[`${d}-${i + 1}`] = { name: n, room: room.trim() };
    }
    onSave(next);
  };
  const remove = () => {
    if (!existing) return onClose();
    const next = { ...courses };
    delete next[k];
    onSave(next);
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet">
        <form className="card" onSubmit={submit}>
          <h2>
            星期{WEEKDAYS[d]}・第 {p.id} 節 <span className="muted mono small">{p.start}–{p.end}</span>
          </h2>
          <label className="stack" style={{ gap: 4 }}>
            <span className="small muted">課程名稱</span>
            <input id="course-name" ref={ref} value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：資料結構" autoComplete="off" />
          </label>
          <label className="stack" style={{ gap: 4 }}>
            <span className="small muted">教室</span>
            <input id="course-room" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="例如：EE-505" autoComplete="off" />
          </label>
          <label className="row small">
            <input id="course-next" type="checkbox" style={{ width: "auto" }} checked={alsoNext} onChange={(e) => setAlsoNext(e.target.checked)} /> 下一節也是這堂課
          </label>
          <div className="row between">
            <button type="button" className="btn" onClick={remove}>{existing ? "刪除" : "取消"}</button>
            <button className="btn primary">儲存</button>
          </div>
        </form>
      </div>
    </>
  );
}
