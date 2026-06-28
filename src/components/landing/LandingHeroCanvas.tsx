"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false },
);

const LandingScene = dynamic(
  () => import("./LandingScene").then((m) => m.LandingScene),
  { ssr: false },
);

export function LandingHeroCanvas({ qrMatrix }: { qrMatrix: boolean[][] }) {
  if (qrMatrix.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111318]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <LandingScene qrMatrix={qrMatrix} />
    </Canvas>
  );
}