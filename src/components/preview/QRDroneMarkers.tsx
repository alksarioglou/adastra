"use client";

import { useMemo } from "react";
import { AltitudeMode, Marker3D } from "@vis.gl/react-google-maps";
import type { TakeoverLocation } from "@/lib/preview/cityLocations";
import { getQRDronePositions } from "@/lib/preview/qrPositions";
import type { ViewPreset } from "@/lib/preview/viewPreset";
import { getTimeMode } from "@/lib/preview/timeOfDay";

function DroneDot({
  color,
  glow,
  size,
}: {
  color: string;
  glow: boolean;
  size: number;
}) {
  const r = size * 0.4;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill={color}
        stroke={glow ? color : "#0f172a"}
        strokeWidth="0.5"
        style={glow ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}
      />
    </svg>
  );
}

const DOT_SIZE: Record<ViewPreset, number> = {
  skyline: 10,
  overhead: 14,
  qr: 22,
};

export function QRDroneMarkers({
  location,
  matrix,
  hour,
  brandColor,
  viewPreset = "skyline",
}: {
  location: TakeoverLocation;
  matrix: boolean[][];
  hour: number;
  brandColor: string;
  viewPreset?: ViewPreset;
}) {
  const isNight = getTimeMode(hour) !== "day";
  const color = isNight ? brandColor : "#0f172a";
  const dotSize = DOT_SIZE[viewPreset];
  const glow = isNight || viewPreset !== "skyline";

  const positions = useMemo(
    () => getQRDronePositions(location, matrix),
    [matrix, location],
  );

  return (
    <>
      {positions.map((p) => (
        <Marker3D
          key={p.key}
          position={{
            lat: p.lat,
            lng: p.lng,
            altitude: location.qrAltitudeMeters,
          }}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
          extruded={false}
          sizePreserved
          drawsWhenOccluded
        >
          <DroneDot color={color} glow={glow} size={dotSize} />
        </Marker3D>
      ))}
    </>
  );
}