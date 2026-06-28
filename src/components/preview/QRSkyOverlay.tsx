"use client";

import { useEffect, useRef, useState } from "react";
import { projectQRSquareScreen } from "@/lib/preview/streetViewProjection";
import { getStreetViewQrAltitude } from "@/lib/preview/streetViewQr";
import type { TakeoverLocation } from "@/lib/preview/cityLocations";

type ProjectedDot = {
  key: string;
  x: number;
  y: number;
  visible: boolean;
};

export function QRSkyOverlay({
  panorama,
  location,
  qrMatrix,
  color,
  glow,
}: {
  panorama: google.maps.StreetViewPanorama | null;
  location: TakeoverLocation;
  qrMatrix: boolean[][];
  color: string;
  glow: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<ProjectedDot[]>([]);
  const [dotSize, setDotSize] = useState(14);
  const skyAltitude = getStreetViewQrAltitude(location.qrAltitudeMeters);

  useEffect(() => {
    if (!panorama || !layerRef.current) return;

    const update = () => {
      const layer = layerRef.current;
      const pos = panorama.getPosition();
      if (!layer || !pos) return;

      const width = layer.offsetWidth;
      const height = layer.offsetHeight;
      if (width === 0 || height === 0) return;

      const projected = projectQRSquareScreen(
        {
          panoLat: pos.lat(),
          panoLng: pos.lng(),
          panoElevation: 2,
          pov: panorama.getPov(),
          zoom: panorama.getZoom() ?? 1,
          width,
          height,
        },
        location.latitude,
        location.longitude,
        skyAltitude,
        qrMatrix,
      );

      setDots(projected.dots);
      setDotSize(projected.dotSize);
    };

    update();
    const events = ["pov_changed", "position_changed", "zoom_changed", "resize"] as const;
    const listeners = events.map((event) =>
      panorama.addListener(event, update),
    );

    const observer = new ResizeObserver(update);
    observer.observe(layerRef.current);

    return () => {
      listeners.forEach((l) => l.remove());
      observer.disconnect();
    };
  }, [panorama, location, qrMatrix, skyAltitude]);

  const shadow = glow
    ? `0 0 10px ${color}, 0 0 18px ${color}, 0 0 4px #fff`
    : "0 0 6px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.4)";

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {dots.map((dot) =>
        dot.visible ? (
          <div
            key={dot.key}
            className="absolute rounded-full"
            style={{
              left: dot.x - dotSize / 2,
              top: dot.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              background: color,
              boxShadow: shadow,
              border: glow ? "1px solid rgba(255,255,255,0.6)" : "1.5px solid #fff",
            }}
          />
        ) : null,
      )}
    </div>
  );
}