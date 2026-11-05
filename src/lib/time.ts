import { BUS_STOP, EATERIES, PERIODS, type Course, type Eatery } from "@/data/campus";

export const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
export const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();

/** 星期一到五回傳 0–4，週末回傳 -1 */
export const weekdayIndex = (d: Date) => {
  const g = d.getDay();
  return g >= 1 && g <= 5 ? g - 1 : -1;
};

/** 目前節次（上課前 10 分鐘起算），沒有則為 -1 */
export const currentPeriod = (d: Date) => {
  const m = minutesOf(d);
  return PERIODS.findIndex((p) => m >= toMin(p.start) - 10 && m <= toMin(p.end));
};

export const isOpen = (e: Eatery, d: Date) => {
  const m = minutesOf(d);
  return e.hours.some(([a, b]) => m >= toMin(a) && m < toMin(b));
};
export const openEateries = (d: Date) => EATERIES.filter((e) => isOpen(e, d));

/** 依固定班距估算下一班公車（分鐘），末班已過回傳 null */
export const nextBusIn = (d: Date) => {
  const m = minutesOf(d);
  const f = toMin(BUS_STOP.first);
  const l = toMin(BUS_STOP.last);
  if (m < f) return f - m;
  if (m > l) return null;
  return BUS_STOP.every - ((m - f) % BUS_STOP.every);
};

export type Block = Course & { start: string; end: string; from: string; to: string };
/** 把當天相鄰同名的節次合併成一個區塊 */
export const dayBlocks = (courses: Record<string, Course>, day: number): Block[] => {
  if (day < 0) return [];
  const out: Block[] = [];
  let last: Block | null = null;
  PERIODS.forEach((p, i) => {
    const c = courses[`${day}-${i}`];
    if (!c) {
      last = null;
      return;
    }
    if (last && last.name === c.name) {
      last.end = p.end;
      last.to = p.id;
    } else {
      last = { ...c, start: p.start, end: p.end, from: p.id, to: p.id };
      out.push(last);
    }
  });
  return out;
};

const COLORS = ["#0b8a9e", "#d0802a", "#6f5bd6", "#2f9a5b", "#c74b6b", "#4a78c9"];
export const colorFor = (name: string) => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[h % COLORS.length];
};
