"use client";

import { useEffect, useRef, useState } from "react";
import { projectQRImageLayout } from "@/lib/preview/streetViewProjection";
import { renderStreetViewQRCanvas } from "@/lib/preview/streetViewQrCanvas";
import { getStreetViewQrAltitude } from "@/lib/preview/streetViewQr";
import type { TakeoverLocation } from "@/lib/preview/cityLocations";

type QRImageLayout = {
  visible: boolean;
  centerX: number;
  centerY: number;
  sizePx: number;
};

export function QRSkyOverlay({
  panorama,
  location,
  scanUrl,
  color,
  glow,
}: {
  panorama: google.maps.StreetViewPanorama | null;
  location: TakeoverLocation;
  scanUrl: string;
  color: string;
  glow: boolean;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [layout, setLayout] = useState<QRImageLayout | null>(null);
  const skyAltitude = getStreetViewQrAltitude(location.qrAltitudeMeters);

  useEffect(() => {
    setQrImage(renderStreetViewQRCanvas(scanUrl, { glow, glowColor: color }));
  }, [scanUrl, glow, color]);

  useEffect(() => {
    if (!panorama || !layerRef.current) return;

    const update = () => {
      const layer = layerRef.current;
      const pos = panorama.getPosition();
      if (!layer || !pos) return;

      const width = layer.offsetWidth;
      const height = layer.offsetHeight;
      if (width === 0 || height === 0) return;

      setLayout(
        projectQRImageLayout(
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
        ),
      );
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
  }, [panorama, location, skyAltitude]);

  const show = layout?.visible && qrImage && layout.sizePx > 0;

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {show && (
        <img
          src={qrImage}
          alt=""
          className="absolute block"
          width={layout.sizePx}
          height={layout.sizePx}
          style={{
            left: layout.centerX - layout.sizePx / 2,
            top: layout.centerY - layout.sizePx / 2,
            width: layout.sizePx,
            height: layout.sizePx,
            imageRendering: "pixelated",
            filter: glow
              ? `drop-shadow(0 0 12px ${color}88) drop-shadow(0 4px 16px rgba(0,0,0,0.25))`
              : "drop-shadow(0 4px 14px rgba(0,0,0,0.35))",
          }}
        />
      )}
    </div>
  );
}