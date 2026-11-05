"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PERIODS, WEEKDAYS, type Course } from "@/data/campus";
import { useCourses } from "@/lib/courses";
import { BASE } from "@/lib/base";
import { applyAdd, formatNodes, planAdd, searchCatalog, type Catalog, type CatalogCourse } from "@/lib/catalog";
import { PageHead } from "@/components/ui";

type Load = { state: "loading" } | { state: "error" } | { state: "ok"; data: Catalog };

export default function CourseSearch() {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [q, setQ] = useState("");
  const { courses, isSample, save } = useCourses();
  const [conflictFor, setConflictFor] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/data/courses.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Catalog) => setLoad({ state: "ok", data }))
      .catch(() => setLoad({ state: "error" }));
  }, []);

  const results = useMemo(() => (load.state === "ok" ? searchCatalog(load.data.courses, q) : []), [load, q]);
  // 還是範例課表時，加入第一門真的課就換成空白課表
  const base = isSample ? {} : courses;
  const added = new Set(Object.values(base).map((c) => c.no).filter(Boolean));

  const add = (c: CatalogCourse, force = false) => {
    const plan = planAdd(c, base);
    if (plan.conflicts.length && !force) return setConflictFor(c.no);
    let next: Record<string, Course> = { ...base };
    for (const { with: other } of plan.conflicts) next = removeCourse(next, other);
    save(applyAdd(c, next));
    setConflictFor(null);
  };
  const remove = (no: string) => save(Object.fromEntries(Object.entries(base).filter(([, v]) => v.no !== no)));

  return (
    <section className="view">
      <PageHead
        eyebrow={load.state === "ok" ? `${load.data.semester.slice(0, 3)} 學年度 第 ${load.data.semester.slice(3)} 學期` : "課程查詢"}
        title="搜尋課程"
        aside={<Link className="btn small" href="/timetable">回課表</Link>}
      />
      <input id="course-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="課名、課號或老師，例如 微積分、CS1003" autoComplete="off" />

      {load.state === "loading" && <p className="muted">正在載入開課資料…</p>}
      {load.state === "error" && (
        <div className="card">
          <h3>開課資料暫時無法取得</h3>
          <p className="small muted">可以先到學校的課程查詢系統找課，再回課表手動加入。</p>
          <a className="btn" href="https://querycourse.ntust.edu.tw/QueryCourse/" target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none" }}>
            開啟台科大課程查詢
          </a>
        </div>
      )}
      {load.state === "ok" && !q.trim() && (
        <p className="small muted">
          共 {load.data.courses.length.toLocaleString()} 門課，資料更新於 {new Date(load.data.updatedAt).toLocaleDateString("zh-TW")}。加入課表時會自動檢查衝堂。
        </p>
      )}
      {load.state === "ok" && q.trim() && !results.length && <p className="muted">找不到符合「{q}」的課程。</p>}

      {results.map((c) => {
        const isAdded = added.has(c.no);
        const plan = planAdd(c, base);
        return (
          <div key={c.no} className="card">
            <div className="row between" style={{ alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <h3>{c.name}</h3>
                <p className="small muted">
                  <span className="mono">{c.no}</span>・{c.teacher || "老師未定"}・{c.credit} 學分
                </p>
              </div>
              {isAdded ? (
                <button className="btn small" onClick={() => remove(c.no)}>移出課表</button>
              ) : (
                <button className="btn small primary" onClick={() => add(c)} disabled={!plan.slots.length}>加入課表</button>
              )}
            </div>
            <div className="row wrap small">
              <span>星期 {formatNodes(c.node)}</span>
              {c.room && <span className="code">{c.room}</span>}
              {c.limit > 0 && (
                <span className={`pill ${c.enrolled >= c.limit ? "off" : ""}`}>
                  選課 {c.enrolled}/{c.limit}
                </span>
              )}
            </div>
            {!isAdded && plan.conflicts.length > 0 && conflictFor !== c.no && (
              <p className="small" style={{ color: "var(--warn)" }}>會和「{[...new Set(plan.conflicts.map((x) => x.with.name))].join("、")}」衝堂</p>
            )}
            {plan.skipped.length > 0 && <p className="small muted">週末或未定的時段不會顯示在課表上。</p>}
            {conflictFor === c.no && (
              <div className="stack" style={{ gap: 8 }}>
                <p className="small" style={{ color: "var(--warn)" }}>
                  衝堂：
                  {plan.conflicts
                    .map(({ key, with: o }) => {
                      const [d, p] = key.split("-").map(Number);
                      return `星期${WEEKDAYS[d]}第 ${PERIODS[p].id} 節「${o.name}」`;
                    })
                    .join("、")}
                </p>
                <div className="row">
                  <button className="btn small" onClick={() => setConflictFor(null)}>取消</button>
                  <button className="btn small primary" onClick={() => add(c, true)}>改成這門課</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

/** 移除整門課（同名或同課號的所有格子） */
function removeCourse(table: Record<string, Course>, course: Course) {
  return Object.fromEntries(
    Object.entries(table).filter(([, v]) => !(course.no ? v.no === course.no : v.name === course.name)),
  );
}
