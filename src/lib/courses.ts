"use client";
import { SAMPLE_COURSES, type Course } from "@/data/campus";
import { useStored } from "./hooks";

/** 使用者課表；尚未自行編輯時顯示範例課表 */
export function useCourses() {
  const [stored, setStored, loaded] = useStored<Record<string, Course> | null>("courses", null);
  const isSample = stored === null;
  return {
    courses: stored ?? SAMPLE_COURSES,
    isSample,
    loaded,
    save: (c: Record<string, Course>) => setStored(c),
  };
}
