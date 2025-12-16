// PUBLIC_INTERFACE
export function formatTime(sec) {
  /** Formats seconds as m:ss. */
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// PUBLIC_INTERFACE
export function clamp(n, min, max) {
  /** Clamps a number between min and max. */
  return Math.min(max, Math.max(min, n));
}

// PUBLIC_INTERFACE
export function moveItem(arr, from, to) {
  /** Returns a new array with item moved. */
  const a = [...arr];
  if (from < 0 || from >= a.length || to < 0 || to >= a.length) return a;
  const [it] = a.splice(from, 1);
  a.splice(to, 0, it);
  return a;
}
