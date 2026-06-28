"use client";

import { Stars } from "@react-three/drei";
import { SF_ESRI_COLORS } from "@/lib/preview/sfSkyline";
import type { CityVisualStyle } from "@/lib/preview/cityPresets";
import { getSkyColors, getSunPosition, type TimeMode } from "@/lib/preview/timeOfDay";

export function SkyEnvironment({
  timeMode,
  hour,
  visualStyle,
}: {
  timeMode: TimeMode;
  hour: number;
  visualStyle: CityVisualStyle;
}) {
  const colors = getSkyColors(timeMode);
  const [sunX, sunY, sunZ] = getSunPosition(hour);
  const isNight = timeMode === "night";
  const isEsri = visualStyle === "esri";

  if (isEsri && !isNight) {
    return (
      <>
        <color attach="background" args={[SF_ESRI_COLORS.sky]} />
        <fog attach="fog" args={[SF_ESRI_COLORS.bayFog, 60, 180]} />
        <ambientLight intensity={0.85} color="#f0ece4" />
        <directionalLight
          position={[50, 80, 40]}
          intensity={0.35}
          color="#ffffff"
        />
        <directionalLight position={[-30, 40, -20]} intensity={0.15} color="#d8e8f0" />
      </>
    );
  }

  if (isEsri && isNight) {
    return (
      <>
        <color attach="background" args={["#0a1420"]} />
        <fog attach="fog" args={["#0a1420", 50, 160]} />
        <ambientLight intensity={0.18} color="#334466" />
        <directionalLight position={[20, 30, 30]} intensity={0.08} color="#6688bb" />
        <Stars radius={120} depth={80} count={2500} factor={2.5} saturation={0.1} fade speed={0.2} />
      </>
    );
  }

  return (
    <>
      <color attach="background" args={[colors.top]} />
      <fog attach="fog" args={[colors.fog, 40, 120]} />

      <ambientLight intensity={colors.ambient} />
      <directionalLight
        position={[sunX, Math.max(sunY, 10), sunZ]}
        intensity={colors.directional}
        color={timeMode === "golden" ? "#ffd4a0" : isNight ? "#4466aa" : "#ffffff"}
      />

      {isNight && (
        <>
          <Stars
            radius={100}
            depth={60}
            count={3000}
            factor={3}
            saturation={0.2}
            fade
            speed={0.3}
          />
          <mesh position={[60, 35, -80]}>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial color="#e8e8f0" />
          </mesh>
        </>
      )}

      {timeMode === "golden" && (
        <mesh position={[sunX * 0.5, Math.max(sunY * 0.3, 5), -60]}>
          <sphereGeometry args={[6, 32, 32]} />
          <meshBasicMaterial color="#ff9944" />
        </mesh>
      )}

      {timeMode === "day" && (
        <mesh position={[sunX * 0.3, Math.max(sunY * 0.5, 30), -70]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#fff8e0" />
        </mesh>
      )}
    </>
  );
}