export type TimeMode = "day" | "night" | "golden";

export function getTimeMode(hour: number): TimeMode {
  if (hour >= 6 && hour < 8) return "golden";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "golden";
  return "night";
}

export function formatHour(hour: number): string {
  const h = Math.floor(hour) % 24;
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

export function getSunPosition(hour: number): [number, number, number] {
  const radians = ((hour - 6) / 24) * Math.PI * 2;
  const y = Math.sin(radians) * 80;
  const x = Math.cos(radians) * 100;
  return [x, Math.max(y, -20), 50];
}

export function getSkyColors(mode: TimeMode) {
  switch (mode) {
    case "day":
      return {
        top: "#4a90d9",
        horizon: "#b8d4f0",
        ground: "#1a2a1a",
        fog: "#b8d4f0",
        ambient: 0.55,
        directional: 1.4,
      };
    case "golden":
      return {
        top: "#2d1b4e",
        horizon: "#ff8c42",
        ground: "#1a1510",
        fog: "#ff9f5a",
        ambient: 0.35,
        directional: 1.0,
      };
    case "night":
      return {
        top: "#020818",
        horizon: "#0a1628",
        ground: "#050a10",
        fog: "#0a1628",
        ambient: 0.12,
        directional: 0.15,
      };
  }
}