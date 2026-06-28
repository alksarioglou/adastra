"use client";

import { Suspense } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { CitySkyline } from "./CitySkyline";
import { DroneQRFormation } from "./DroneQRFormation";
import { SkyEnvironment } from "./SkyEnvironment";
import type { CityPreset } from "@/lib/preview/cityPresets";
import { getTimeMode } from "@/lib/preview/timeOfDay";

export function PreviewScene({
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
  const timeMode = getTimeMode(hour);
  const isNight = timeMode !== "day";

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={city.cameraPosition}
        fov={50}
        near={0.1}
        far={500}
      />

      <SkyEnvironment
        timeMode={timeMode}
        hour={hour}
        visualStyle={city.visualStyle}
      />

      <Suspense fallback={null}>
        <CitySkyline city={city} timeMode={timeMode} />
        <DroneQRFormation
          matrix={qrMatrix}
          position={city.qrPosition}
          timeMode={timeMode}
          brandColor={brandColor}
          message={message}
        />
      </Suspense>

      <OrbitControls
        enablePan={city.visualStyle === "esri"}
        minDistance={city.visualStyle === "esri" ? 25 : 15}
        maxDistance={city.visualStyle === "esri" ? 120 : 80}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.2}
        target={city.cameraTarget}
        autoRotate={isNight}
        autoRotateSpeed={city.visualStyle === "esri" ? 0.15 : 0.3}
      />

      {isNight && (
        <EffectComposer>
          <Bloom
            intensity={city.visualStyle === "esri" ? 1.6 : 1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil offset={0.1} darkness={city.visualStyle === "esri" ? 0.45 : 0.6} />
        </EffectComposer>
      )}
    </>
  );
}