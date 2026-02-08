// lib/progress.ts
export const PROGRESS_KEY = "valentine_progress";

type Progress = {
  solvedWordle?: boolean;
  solvedAdd10?: boolean;
};

export function getProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setProgress(next: Progress) {
  if (typeof window === "undefined") return;
  const curr = getProgress();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...curr, ...next }));
}
