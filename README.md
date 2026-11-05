# 台科日常

台科大學生的校園生活 PWA：今日總覽、課表、交通、校園（學餐、建築代碼）、行事曆與許願池。

## 開發

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 正式建置
```

## 結構

- `src/data/campus.ts`：節次、建築、學餐、行事曆、交通等校園資料。**目前全部是範例資料，上線前要跟學校公告核對。**
- `src/lib/`：時間計算、本機儲存、課表狀態
- `src/app/`：五個分頁（`/`、`/timetable`、`/transit`、`/campus`、`/calendar`）
- `src/app/manifest.ts`、`public/sw.js`：PWA 設定與離線快取

## 之後的規劃

- 交通：接交通部 TDX API 取得公車即時到站、YouBike 車數
- 課表：匯入台科大課程查詢資料、衝堂檢查、匯出 .ics
- 許願池與帳號：Supabase
