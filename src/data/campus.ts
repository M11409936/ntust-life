// 注意：以下資料皆為「範例資料」，尚未與台科大官方公告核對。
// 上線前請逐項確認，並在 VERIFIED 改為 true。
export const VERIFIED = false;

/** 台科大節次：日間 1–10 節、夜間 A–D 節 */
export const PERIODS: { id: string; start: string; end: string }[] = [
  { id: "1", start: "08:10", end: "09:00" },
  { id: "2", start: "09:10", end: "10:00" },
  { id: "3", start: "10:20", end: "11:10" },
  { id: "4", start: "11:20", end: "12:10" },
  { id: "5", start: "12:20", end: "13:10" },
  { id: "6", start: "13:20", end: "14:10" },
  { id: "7", start: "14:20", end: "15:10" },
  { id: "8", start: "15:30", end: "16:20" },
  { id: "9", start: "16:30", end: "17:20" },
  { id: "10", start: "17:30", end: "18:20" },
  { id: "A", start: "18:25", end: "19:15" },
  { id: "B", start: "19:20", end: "20:10" },
  { id: "C", start: "20:15", end: "21:05" },
  { id: "D", start: "21:10", end: "22:00" },
];
export const DAY_PERIODS = 10;
export const WEEKDAYS = ["一", "二", "三", "四", "五"];
export const SEMESTER_LABEL = "115 學年度 第 1 學期";

export type Building = { code: string; name: string; type: "教學" | "系館" | "行政" | "生活"; desc: string };
export const BUILDINGS: Building[] = [
  { code: "IB", name: "國際大樓", type: "教學", desc: "通識、語言課程與國際事務" },
  { code: "TR", name: "研揚大樓", type: "教學", desc: "大型講堂、電腦教室" },
  { code: "T4", name: "第四教學大樓", type: "教學", desc: "一般教室" },
  { code: "EE", name: "電資館", type: "系館", desc: "電機、電子、資工相關系所" },
  { code: "E1", name: "工程一館", type: "系館", desc: "工學院系所與實驗室" },
  { code: "E2", name: "工程二館", type: "系館", desc: "工學院系所與實驗室" },
  { code: "MA", name: "管理大樓", type: "系館", desc: "管理學院系所" },
  { code: "AD", name: "行政大樓", type: "行政", desc: "註冊組、課務組、學務處" },
  { code: "LB", name: "圖書館", type: "生活", desc: "自習室、借還書" },
  { code: "SC", name: "學生活動中心", type: "生活", desc: "社團辦公室、學生餐廳" },
  { code: "GYM", name: "體育館", type: "生活", desc: "球場、游泳池、健身房" },
];

export type Eatery = { name: string; where: string; tag: string; hours: [string, string][] };
export const EATERIES: Eatery[] = [
  { name: "第一學生餐廳", where: "學生活動中心 1F", tag: "自助餐・麵食", hours: [["07:00", "19:30"]] },
  { name: "第二學生餐廳", where: "學生活動中心 B1", tag: "便當・小吃", hours: [["10:30", "14:00"], ["16:30", "19:30"]] },
  { name: "便利商店", where: "學生活動中心 1F", tag: "24 小時", hours: [["00:00", "24:00"]] },
  { name: "咖啡輕食", where: "國際大樓 1F", tag: "咖啡・三明治", hours: [["08:00", "18:00"]] },
];

export type CalEvent = { date: string; title: string; kind: "學期" | "選課" | "考試" | "假日" | "活動" };
export const EVENTS: CalEvent[] = [
  { date: "2026-09-07", title: "開學、正式上課", kind: "學期" },
  { date: "2026-09-21", title: "加退選截止", kind: "選課" },
  { date: "2026-10-10", title: "國慶日放假", kind: "假日" },
  { date: "2026-11-02", title: "期中考週開始", kind: "考試" },
  { date: "2026-11-16", title: "期中退選截止", kind: "選課" },
  { date: "2026-12-12", title: "校慶系列活動", kind: "活動" },
  { date: "2027-01-01", title: "元旦放假", kind: "假日" },
  { date: "2027-01-04", title: "期末考週開始", kind: "考試" },
  { date: "2027-01-18", title: "寒假開始", kind: "學期" },
];

/** 範例班距：正式版改接交通部 TDX 即時到站 API */
export const BUS_STOP = { name: "台灣科技大學", road: "基隆路", every: 8, first: "06:00", last: "22:30" };
export const ROUTES = [
  { to: "捷運公館站", via: "綠線・沿基隆路步行", mins: 10 },
  { to: "臺大校總區", via: "跨校選課・步行經舟山路", mins: 12 },
  { to: "捷運台電大樓站", via: "綠線・經汀州路", mins: 18 },
];

export type Course = { name: string; room: string; no?: string };
export const SAMPLE_COURSES: Record<string, Course> = {
  "0-2": { name: "微積分(一)", room: "T4-301" },
  "0-3": { name: "微積分(一)", room: "T4-301" },
  "1-5": { name: "程式設計", room: "EE-505" },
  "1-6": { name: "程式設計", room: "EE-505" },
  "2-1": { name: "大學國文", room: "IB-202" },
  "2-2": { name: "大學國文", room: "IB-202" },
  "3-7": { name: "普通物理", room: "E1-101" },
  "3-8": { name: "普通物理", room: "E1-101" },
  "4-3": { name: "英文(一)", room: "TR-412" },
  "4-4": { name: "英文(一)", room: "TR-412" },
};

export const DEFAULT_WISHES = [
  { text: "課表可以匯出到 Google 日曆", votes: 42 },
  { text: "公車到站推播通知", votes: 31 },
  { text: "學餐今日菜單與價格", votes: 27 },
  { text: "空教室查詢", votes: 19 },
];
