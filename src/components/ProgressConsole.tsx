"use client";

import { useEffect, useRef, useState } from "react";

// Reveals "thinking" lines one at a time on a timer so the user knows the
// app is working. Keeps the last line pulsing with a cursor until `done`
// flips true, then the parent advances the flow.
export function ProgressConsole({
  title,
  lines,
  done,
}: {
  title: string;
  lines: string[];
  done: boolean;
}) {
  const [visible, setVisible] = useState(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible >= lines.length) return;
    // Slow down as we approach the end so we don't run out before `done`.
    const remaining = lines.length - visible;
    const delay = remaining <= 1 ? 1400 : 750;
    timer.current = setTimeout(() => setVisible((v) => v + 1), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible, lines.length]);

  const shown = lines.slice(0, visible);

  return (
    <div className="w-full animate-fade-in-up rounded-2xl border border-border bg-panel/80 p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-accent-2"
            style={{ animation: "pulse-ring 1.4s ease-in-out infinite" }}
          />
        </span>
        <span className="text-sm font-medium text-muted">{title}</span>
      </div>

      <div className="space-y-2 font-mono text-sm">
        {shown.map((line, i) => {
          const isLast = i === shown.length - 1;
          const settled = !isLast || done || visible < lines.length;
          return (
            <div key={i} className="flex items-start gap-2 animate-fade-in-up">
              <span className={settled ? "text-accent-2" : "text-accent"}>
                {settled && !(isLast && !done && visible >= lines.length)
                  ? "✓"
                  : "▸"}
              </span>
              <span className={settled ? "text-foreground/80" : "text-foreground"}>
                {line}
                {isLast && !done && (
                  <span className="cursor-blink ml-0.5 text-accent">▋</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
