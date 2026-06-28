// The Discovery centrifuge corridor: concentric octagons in one-point
// perspective. Static = subtle texture behind the hero; animated = rings
// drifting outward, as if moving down the tunnel (used while "thinking").

// Round to 2 decimals so server (Node V8) and client (Chromium V8) render
// byte-identical coordinates — raw Math.cos floats can differ in the last ULP
// across engines and trigger a hydration mismatch.
const r2 = (n: number) => Math.round(n * 100) / 100;
const OCTAGON = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 180) * (22.5 + i * 45);
  return [r2(50 * Math.cos(a)), r2(50 * Math.sin(a))];
});
const POINTS = OCTAGON.map(([x, y]) => `${x},${y}`).join(" ");

const RING_SCALES = [1, 0.78, 0.58, 0.4, 0.24, 0.12];

export function CorridorBackdrop({
  animate = false,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={`${animate ? "corridor-animate" : ""} ${className}`}
    >
      {/* radial spokes toward the vanishing point */}
      {!animate &&
        OCTAGON.map(([x, y], i) => (
          <line
            key={`spoke-${i}`}
            x1="0"
            y1="0"
            x2={x}
            y2={y}
            stroke="var(--ink)"
            strokeWidth="0.15"
          />
        ))}

      {RING_SCALES.map((s, i) => (
        <g
          key={`ring-${i}`}
          className="corridor-ring"
          transform={`scale(${s})`}
          style={animate ? { animationDelay: `${i * 0.8}s` } : undefined}
        >
          <polygon
            points={POINTS}
            fill="none"
            stroke={animate ? "var(--orange)" : "var(--ink)"}
            strokeWidth={animate ? 0.5 : 0.3}
          />
        </g>
      ))}
    </svg>
  );
}
