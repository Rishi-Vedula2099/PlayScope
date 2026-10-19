export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatMinute(minute: number, second?: number): string {
  if (second !== undefined) {
    return `${minute}'${second.toString().padStart(2, "0")}`;
  }
  return `${minute}'`;
}

export function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    goal: "⚽",
    shot: "🎯",
    pass: "➡️",
    foul: "⚠️",
    save: "🧤",
    corner: "🚩",
    freekick: "🦶",
    offside: "🏁",
    substitution: "🔄",
    yellow_card: "🟨",
    red_card: "🟥",
  };
  return icons[type] || "•";
}

export function getEventColor(type: string): string {
  const colors: Record<string, string> = {
    goal: "#10b981",
    shot: "#6366f1",
    pass: "#3b82f6",
    foul: "#f59e0b",
    save: "#06b6d4",
    corner: "#8b5cf6",
    freekick: "#ec4899",
    offside: "#64748b",
    substitution: "#a855f7",
    yellow_card: "#eab308",
    red_card: "#ef4444",
  };
  return colors[type] || "#94a3b8";
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
