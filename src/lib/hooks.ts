"use client";
import { useEffect, useState } from "react";

const PREFIX = "ntustlife.";

/** 存在使用者瀏覽器的狀態；讀取失敗（無痕模式等）時退回預設值 */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(v));
    } catch {}
  };
  return [value, set, loaded] as const;
}

/** 每分鐘更新一次的現在時間；首次渲染前為 null 以避免 SSR 時間不一致 */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}
