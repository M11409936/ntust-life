import { PERIODS, type Course } from "@/data/campus";

/** public/data/courses.json 裡的一門課 */
export type CatalogCourse = {
  no: string;
  name: string;
  teacher: string;
  credit: number;
  node: string[]; // 例如 ["M3", "M4", "WA"]：星期代碼 + 節次
  room: string;
  enrolled: number;
  limit: number;
};
export type Catalog = { semester: string; updatedAt: string; courses: CatalogCourse[] };

const DAY_CODES = ["M", "T", "W", "R", "F"];
const DAY_NAMES: Record<string, string> = { M: "一", T: "二", W: "三", R: "四", F: "五", S: "六", U: "日" };

/** 把 "M3" 轉成課表格子的 key（"0-2"）；週末或無法辨識的節次回傳 null */
export function slotKey(node: string): string | null {
  const day = DAY_CODES.indexOf(node[0]);
  const period = PERIODS.findIndex((p) => p.id === node.slice(1));
  return day < 0 || period < 0 ? null : `${day}-${period}`;
}

/** 顯示用：["M3","M4","R6"] → "一 3–4、四 6" */
export function formatNodes(nodes: string[]): string {
  const byDay = new Map<string, string[]>();
  for (const n of nodes) {
    const d = DAY_NAMES[n[0]] ?? n[0];
    byDay.set(d, [...(byDay.get(d) ?? []), n.slice(1)]);
  }
  return [...byDay].map(([d, ps]) => `${d} ${ps.length > 1 ? `${ps[0]}–${ps[ps.length - 1]}` : ps[0]}`).join("、") || "時間未定";
}

/** 依關鍵字搜尋課名、課號、老師；多個關鍵字用空白分隔，全部符合才列出 */
export function searchCatalog(courses: CatalogCourse[], query: string, limit = 50): CatalogCourse[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out: CatalogCourse[] = [];
  for (const c of courses) {
    const hay = `${c.name} ${c.no} ${c.teacher}`.toLowerCase();
    if (terms.every((t) => hay.includes(t))) {
      out.push(c);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export type AddPlan = { slots: string[]; conflicts: { key: string; with: Course }[]; skipped: string[] };

/** 算出加入課表會佔哪些格子、和哪些現有課程衝堂 */
export function planAdd(course: CatalogCourse, timetable: Record<string, Course>): AddPlan {
  const slots: string[] = [];
  const skipped: string[] = [];
  const conflicts: AddPlan["conflicts"] = [];
  for (const n of course.node) {
    const k = slotKey(n);
    if (!k) {
      skipped.push(n);
      continue;
    }
    slots.push(k);
    const existing = timetable[k];
    if (existing && existing.no !== course.no) conflicts.push({ key: k, with: existing });
  }
  return { slots, conflicts, skipped };
}

export function applyAdd(course: CatalogCourse, timetable: Record<string, Course>): Record<string, Course> {
  const next = { ...timetable };
  const room = course.room.split(",")[0] ?? "";
  for (const k of planAdd(course, timetable).slots) next[k] = { name: course.name, room, no: course.no };
  return next;
}
