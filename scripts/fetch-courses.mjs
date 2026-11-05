// 從台科大課程查詢系統抓取整學期的開課資料，存成精簡的 JSON 給 app 搜尋用。
// 在 GitHub Actions 建置前執行；抓取失敗時不讓建置失敗，app 會顯示「資料暫時無法取得」。
import { mkdir, writeFile } from "node:fs/promises";

const API = "https://querycourse.ntust.edu.tw/querycourse/api/courses";

/** 依日期推算學期代碼：6 月起算下一學年上學期（例如 2026-09 → 1151） */
export function currentSemester(d = new Date()) {
  const y = d.getFullYear() - 1911;
  return d.getMonth() + 1 >= 6 ? `${y}1` : `${y - 1}2`;
}

const semester = process.env.SEMESTER || currentSemester();
// 不帶條件的全校查詢會在伺服器端逾時（HTTP 500），所以依課號開頭分批查。
// 3N、3T 是臺灣大學系統的師大、臺大課程，量大所以獨立出來。
const PREFIXES = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0", "1", "2", "3N", "3T", "4", "5", "6", "7", "8", "9"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bodyFor = (prefix) => ({
  Semester: semester, CourseNo: prefix, CourseName: "", CourseTeacher: "", Dimension: "", CourseNotes: "",
  CampusNotes: "", ForeignLanguage: 0, OnlyGeneral: 0, OnleyNTUST: 0, OnlyMaster: 0, OnlyUnderGraduate: 0,
  OnlyNode: 0, Language: "zh",
});

async function query(prefix) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        body: JSON.stringify(bodyFor(prefix)),
        signal: AbortSignal.timeout(150_000),
      });
      if (res.ok) return (await res.json()) ?? [];
      if (![429, 500, 502, 503, 504].includes(res.status)) throw new Error(`HTTP ${res.status}`);
      console.log(`  ${prefix}: HTTP ${res.status}，稍後重試`);
    } catch (e) {
      if (attempt === 3) throw e;
      console.log(`  ${prefix}: ${e.message}，稍後重試`);
    }
    await sleep(2000 * attempt);
  }
  throw new Error(`${prefix} 重試後仍失敗`);
}

async function main() {
  console.log(`抓取 ${semester} 學期課程…`);
  const rows = [];
  const failed = [];
  for (const prefix of PREFIXES) {
    try {
      const got = await query(prefix);
      rows.push(...got);
      console.log(`  ${prefix}: ${got.length} 筆`);
    } catch (e) {
      failed.push(prefix);
      console.log(`  ${prefix}: 失敗（${e.message}）`);
    }
    await sleep(1000); // 放慢速度，避免造成學校伺服器負擔
  }
  if (!rows.length) throw new Error("所有批次都失敗");
  if (failed.length) console.warn(`::warning::部分課號開頭抓取失敗：${failed.join("、")}`);
  const seen = new Map();
  for (const r of rows) {
    const no = (r.CourseNo || "").trim();
    if (!no) continue;
    const prev = seen.get(no);
    const node = (r.Node || "").split(",").map((s) => s.trim()).filter(Boolean);
    const room = (r.ClassRoomNo || "").trim();
    if (prev) {
      // 同一門課可能拆成多列（不同時段或教室），合併起來
      for (const n of node) if (!prev.node.includes(n)) prev.node.push(n);
      if (room && !prev.room.split(",").includes(room)) prev.room = prev.room ? `${prev.room},${room}` : room;
      continue;
    }
    seen.set(no, {
      no,
      name: (r.CourseName || "").trim(),
      teacher: (r.CourseTeacher || "").trim(),
      credit: Number(r.CreditPoint) || 0,
      node,
      room,
      enrolled: Number(r.ChooseStudent) || 0,
      limit: Number(r.Restrict2) || Number(r.Restrict1) || 0,
    });
  }
  const courses = [...seen.values()];
  await mkdir("public/data", { recursive: true });
  await writeFile(
    "public/data/courses.json",
    JSON.stringify({ semester, updatedAt: new Date().toISOString(), courses }),
  );
  console.log(`完成：${courses.length} 門課`);
}

main().catch((e) => {
  console.warn(`::warning::課程資料抓取失敗（${e.message}），這次部署不含課程搜尋資料`);
});
