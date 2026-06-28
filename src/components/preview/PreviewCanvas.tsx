"use client";

import { Canvas } from "@react-three/fiber";
import { PreviewScene } from "./PreviewScene";
import type { CityPreset } from "@/lib/preview/cityPresets";

export default function PreviewCanvas({
  city,
  qrMatrix,
  hour,
  brandColor,
  message,
}: {
  city: CityPreset;
  qrMatrix: boolean[][];
  hour: number;
  brandColor: string;
  message: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <PreviewScene
        city={city}
        qrMatrix={qrMatrix}
        hour={hour}
        brandColor={brandColor}
        message={message}
      />
    </Canvas>
  );
}