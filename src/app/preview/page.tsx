"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CampaignDrawer } from "@/components/preview/CampaignDrawer";
import type { GoogleMap3DPreviewHandle } from "@/components/preview/GoogleMap3DPreview";
import type { StreetViewPreviewHandle } from "@/components/preview/StreetViewPreview";
import type { ViewPreset } from "@/lib/preview/viewPreset";
import { usesStreetView } from "@/lib/preview/viewPreset";
import {
  PlaceSearchBar,
  type SelectedPlace,
} from "@/components/preview/PlaceSearchBar";
import { PreviewControls } from "@/components/preview/PreviewControls";
import {
  CITY_LOCATIONS,
  cityToTakeoverLocation,
  customTakeoverLocation,
  getCityLocation,
  type TakeoverLocation,
} from "@/lib/preview/cityLocations";
import { generateQRMatrix } from "@/lib/preview/qrMatrix";
import { formatHour, getTimeMode } from "@/lib/preview/timeOfDay";

const GoogleMap3DPreview = dynamic(
  () => import("@/components/preview/GoogleMap3DPreview"),
  { ssr: false },
);

const StreetViewPreview = dynamic(
  () => import("@/components/preview/StreetViewPreview"),
  { ssr: false },
);

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export default function PreviewPage() {
  const map3dRef = useRef<GoogleMap3DPreviewHandle>(null);
  const streetViewRef = useRef<StreetViewPreviewHandle>(null);
  const [cityId, setCityId] = useState("san-francisco");
  const [viewPreset, setViewPreset] = useState<ViewPreset>("skyline");
  const [hour, setHour] = useState(14);
  const [destinationUrl, setDestinationUrl] = useState("https://stellarqr.com");
  const [brandColor, setBrandColor] = useState("#22d3ee");
  const [message, setMessage] = useState("Scan the Sky");
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customPlace, setCustomPlace] = useState<SelectedPlace | null>(null);

  const city = getCityLocation(cityId);
  const activeLocation: TakeoverLocation = customPlace
    ? customTakeoverLocation(
        customPlace.name,
        customPlace.latitude,
        customPlace.longitude,
        customPlace.address,
      )
    : cityToTakeoverLocation(city);
  const timeMode = getTimeMode(hour);
  const droneCount = qrMatrix.flat().filter(Boolean).length;

  useEffect(() => {
    let cancelled = false;
    generateQRMatrix(destinationUrl).then((matrix) => {
      if (!cancelled) setQrMatrix(matrix);
    });
    return () => {
      cancelled = true;
    };
  }, [destinationUrl]);

  const handleCityChange = (id: string) => {
    setCustomPlace(null);
    setCityId(id);
    setViewPreset("skyline");
  };

  const handlePlaceSelect = (place: SelectedPlace) => {
    setCustomPlace(place);
    setViewPreset("skyline");
  };

  const handleViewPreset = (preset: ViewPreset) => {
    setViewPreset(preset);
  };

  if (!apiKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020818] p-8">
        <div className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-cyan-400">
            API Key Required
          </p>
          <h2 className="mb-3 text-xl font-semibold text-white">
            Maps JavaScript API — 3D Maps
          </h2>
          <p className="mb-6 text-sm text-white/60">
            Enable the <strong>Maps JavaScript API</strong> in Google Cloud and
            add your key to <code className="text-cyan-300">.env.local</code>
          </p>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-left text-xs text-cyan-200">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
          </pre>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["maps3d", "places", "streetView"]}>
      <div className="relative h-screen w-screen overflow-hidden bg-[#0a0f14]">
        <div className="absolute inset-0">
          {qrMatrix.length > 0 &&
            (usesStreetView(viewPreset) ? (
              <StreetViewPreview
                ref={streetViewRef}
                location={activeLocation}
                qrMatrix={qrMatrix}
                hour={hour}
                brandColor={brandColor}
                viewPreset={viewPreset as "street" | "qr"}
              />
            ) : (
              <GoogleMap3DPreview
                ref={map3dRef}
                location={activeLocation}
                qrMatrix={qrMatrix}
                hour={hour}
                brandColor={brandColor}
                viewPreset={viewPreset}
              />
            ))}
        </div>

        {!usesStreetView(viewPreset) && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
        )}

        <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 px-6 py-5">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-white/90 shadow-lg backdrop-blur-2xl transition hover:bg-white/15"
          >
            <span className="text-sm font-semibold tracking-tight">StellarQR</span>
          </Link>
        </header>

        <PlaceSearchBar onPlaceSelect={handlePlaceSelect} />

        <PreviewControls
          cities={CITY_LOCATIONS.map((c) => ({
            id: c.id,
            name: c.name,
            short: c.short,
          }))}
          activeCityId={customPlace ? "" : cityId}
          activeLocationName={activeLocation.name}
          activeLocationTagline={activeLocation.tagline}
          isCustomLocation={!!customPlace}
          viewPreset={viewPreset}
          timeLabel={
            timeMode === "night"
              ? "Night Takeover"
              : timeMode === "golden"
                ? "Golden Hour"
                : formatHour(hour)
          }
          droneCount={droneCount}
          qrAltitude={activeLocation.qrAltitudeMeters}
          onCityChange={handleCityChange}
          onViewPresetChange={handleViewPreset}
          onZoomIn={() =>
            (usesStreetView(viewPreset)
              ? streetViewRef
              : map3dRef
            ).current?.zoomIn()
          }
          onZoomOut={() =>
            (usesStreetView(viewPreset)
              ? streetViewRef
              : map3dRef
            ).current?.zoomOut()
          }
          onResetView={() =>
            (usesStreetView(viewPreset)
              ? streetViewRef
              : map3dRef
            ).current?.resetView()
          }
          onOpenSettings={() => setSettingsOpen((o) => !o)}
          settingsOpen={settingsOpen}
        />

        <CampaignDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          hour={hour}
          onHourChange={setHour}
          hourLabel={formatHour(hour)}
          destinationUrl={destinationUrl}
          onDestinationUrlChange={setDestinationUrl}
          message={message}
          onMessageChange={setMessage}
          brandColor={brandColor}
          onBrandColorChange={setBrandColor}
        />
      </div>
    </APIProvider>
  );
}