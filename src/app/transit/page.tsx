"use client";
import { BUS_STOP, ROUTES } from "@/data/campus";
import { useNow } from "@/lib/hooks";
import { nextBusIn } from "@/lib/time";
import { PageHead, Sample } from "@/components/ui";

export default function Transit() {
  const now = useNow();
  const bus = now ? nextBusIn(now) : null;
  return (
    <section className="view">
      <PageHead eyebrow="基隆路四段 43 號" title="交通" aside={<Sample />} />
      <div className="card hero">
        <p className="small muted">{BUS_STOP.road}「{BUS_STOP.name}」站</p>
        <div className="row between">
          <h2>下一班公車</h2>
          <span className="big">
            {bus === null ? "—" : bus}
            <span style={{ fontSize: "1rem" }}> 分</span>
          </span>
        </div>
        <p className="small muted">目前以固定班距估算，之後改接交通部 TDX 的即時到站資料。</p>
      </div>
      <div className="card">
        <h3>常用路線</h3>
        <div className="list">
          {ROUTES.map((r) => (
            <div key={r.to} className="row between">
              <div>
                <b>{r.to}</b>
                <p className="small muted">{r.via}</p>
              </div>
              <span className="mono">約 {r.mins} 分</span>
            </div>
          ))}
          <div className="row between">
            <div>
              <b>YouBike 臺灣科技大學站</b>
              <p className="small muted">校門口附近</p>
            </div>
            <span className="pill">即時車數待接</span>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>接下來會做</h3>
        <p className="small muted">收藏站牌後在「今日」頁直接看到站時間，加上 YouBike 可借／可還數、捷運首末班車與颱風停班停課通知。</p>
      </div>
    </section>
  );
}
