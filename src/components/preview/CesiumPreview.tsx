"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { CityLocation } from "@/lib/preview/cityLocations";
import { getTimeMode } from "@/lib/preview/timeOfDay";

type CesiumModule = typeof import("cesium");

export type ViewPreset = "skyline" | "street" | "qr";

export type CesiumPreviewHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setViewPreset: (preset: ViewPreset) => void;
};

type ViewerState = {
  viewer: import("cesium").Viewer;
  Cesium: CesiumModule;
  pointCollection: import("cesium").PointPrimitiveCollection | null;
  labelEntity: import("cesium").Entity | null;
  rotateHandler: (() => void) | null;
  city: CityLocation;
};

function hexToCesiumColor(Cesium: CesiumModule, hex: string, alpha = 1) {
  return Cesium.Color.fromCssColorString(hex).withAlpha(alpha);
}

function applyTimeOfDay(
  viewer: import("cesium").Viewer,
  Cesium: CesiumModule,
  hour: number,
) {
  const mode = getTimeMode(hour);
  const scene = viewer.scene;

  if (mode === "night") {
    if (scene.skyAtmosphere) scene.skyAtmosphere.show = false;
    if (scene.sun) scene.sun.show = false;
    if (scene.moon) scene.moon.show = true;
    scene.backgroundColor = Cesium.Color.fromCssColorString("#020818");
    scene.fog.enabled = true;
    scene.fog.density = 0.00015;
    scene.fog.minimumBrightness = 0.03;
  } else if (mode === "golden") {
    if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
    if (scene.sun) scene.sun.show = true;
    if (scene.moon) scene.moon.show = false;
    scene.backgroundColor = Cesium.Color.fromCssColorString("#1a1020");
    scene.fog.enabled = true;
    scene.fog.density = 0.00008;
  } else {
    if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;
    if (scene.sun) scene.sun.show = true;
    if (scene.moon) scene.moon.show = false;
    scene.backgroundColor = Cesium.Color.fromCssColorString("#c5d2dc");
    scene.fog.enabled = true;
    scene.fog.density = 0.00002;
  }
}

function getCameraForPreset(city: CityLocation, preset: ViewPreset) {
  const base = city.camera;
  switch (preset) {
    case "street":
      return {
        ...base,
        height: Math.max(base.height * 0.45, 45),
        pitch: -12,
        heading: base.heading + 8,
      };
    case "qr":
      return {
        longitude: city.longitude + 0.004,
        latitude: city.latitude - 0.005,
        height: 55,
        heading: 20,
        pitch: -38,
      };
    default:
      return base;
  }
}

function flyToCity(
  viewer: import("cesium").Viewer,
  Cesium: CesiumModule,
  city: CityLocation,
  preset: ViewPreset = "skyline",
  duration = 1.8,
) {
  const cam = getCameraForPreset(city, preset);
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      cam.longitude,
      cam.latitude,
      cam.height,
    ),
    orientation: {
      heading: Cesium.Math.toRadians(cam.heading),
      pitch: Cesium.Math.toRadians(cam.pitch),
      roll: 0,
    },
    duration,
  });
}

function zoomRelative(
  state: ViewerState,
  factor: number,
) {
  const { viewer, Cesium, city } = state;
  const center = Cesium.Cartesian3.fromDegrees(
    city.longitude,
    city.latitude,
    city.qrAltitudeMeters * 0.35,
  );
  const camera = viewer.camera;
  const offset = Cesium.Cartesian3.subtract(
    camera.position,
    center,
    new Cesium.Cartesian3(),
  );
  const distance = Cesium.Cartesian3.magnitude(offset);
  const newDistance = Cesium.Math.clamp(distance * factor, 40, 2500);
  const direction = Cesium.Cartesian3.normalize(offset, new Cesium.Cartesian3());
  const newPosition = Cesium.Cartesian3.add(
    center,
    Cesium.Cartesian3.multiplyByScalar(direction, newDistance, new Cesium.Cartesian3()),
    new Cesium.Cartesian3(),
  );

  camera.flyTo({
    destination: newPosition,
    orientation: {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    },
    duration: 0.35,
  });
}

function updateQRFormation(
  state: ViewerState,
  city: CityLocation,
  matrix: boolean[][],
  brandColor: string,
  message: string,
  hour: number,
) {
  const { viewer, Cesium } = state;
  const mode = getTimeMode(hour);
  const isNight = mode !== "day";

  if (state.pointCollection) {
    viewer.scene.primitives.remove(state.pointCollection);
    state.pointCollection = null;
  }
  if (state.labelEntity) {
    viewer.entities.remove(state.labelEntity);
    state.labelEntity = null;
  }

  if (matrix.length === 0) return;

  const moduleSpacing = 2.8;
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const center = Cesium.Cartesian3.fromDegrees(
    city.longitude,
    city.latitude,
    city.qrAltitudeMeters,
  );
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  const collection = viewer.scene.primitives.add(
    new Cesium.PointPrimitiveCollection(),
  );
  state.pointCollection = collection;

  const color = hexToCesiumColor(
    Cesium,
    isNight ? brandColor : "#1e293b",
    isNight ? 1 : 0.9,
  );
  const offsetX = -((cols - 1) * moduleSpacing) / 2;
  const offsetY = ((rows - 1) * moduleSpacing) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!matrix[row][col]) continue;
      const local = new Cesium.Cartesian3(
        offsetX + col * moduleSpacing,
        offsetY - row * moduleSpacing,
        0,
      );
      const world = Cesium.Matrix4.multiplyByPoint(
        transform,
        local,
        new Cesium.Cartesian3(),
      );
      collection.add({
        position: world,
        color,
        pixelSize: isNight ? 9 : 7,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      });
    }
  }

  if (message) {
    const labelLocal = new Cesium.Cartesian3(
      0,
      offsetY - rows * moduleSpacing * 0.65,
      0,
    );
    const labelWorld = Cesium.Matrix4.multiplyByPoint(
      transform,
      labelLocal,
      new Cesium.Cartesian3(),
    );
    state.labelEntity = viewer.entities.add({
      position: labelWorld,
      label: {
        text: message,
        font: "600 18px system-ui, sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelOffset: new Cesium.Cartesian2(0, 0),
      },
    });
  }
}

function setupAutoRotate(
  state: ViewerState,
  city: CityLocation,
  hour: number,
) {
  const { viewer, Cesium } = state;
  const mode = getTimeMode(hour);
  const isNight = mode !== "day";

  if (state.rotateHandler) {
    state.rotateHandler();
    state.rotateHandler = null;
  }

  if (!isNight) return;

  const center = Cesium.Cartesian3.fromDegrees(
    city.longitude,
    city.latitude,
    city.qrAltitudeMeters * 0.5,
  );
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  viewer.camera.lookAtTransform(transform);

  const remove = viewer.clock.onTick.addEventListener(() => {
    viewer.camera.rotateRight(0.003);
  });
  state.rotateHandler = () => {
    remove();
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  };
}

const CesiumPreview = forwardRef<
  CesiumPreviewHandle,
  {
    city: CityLocation;
    qrMatrix: boolean[][];
    hour: number;
    brandColor: string;
    message: string;
    onStatusChange?: (
      status: "loading" | "ready" | "error",
      detail?: string,
    ) => void;
  }
>(function CesiumPreview(
  { city, qrMatrix, hour, brandColor, message, onStatusChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewerState | null>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const viewPresetRef = useRef<ViewPreset>("skyline");

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      const state = stateRef.current;
      if (!state) return;
      zoomRelative(state, 0.72);
    },
    zoomOut: () => {
      const state = stateRef.current;
      if (!state) return;
      zoomRelative(state, 1.38);
    },
    resetView: () => {
      const state = stateRef.current;
      if (!state) return;
      flyToCity(
        state.viewer,
        state.Cesium,
        state.city,
        viewPresetRef.current,
      );
    },
    setViewPreset: (preset: ViewPreset) => {
      const state = stateRef.current;
      if (!state) return;
      viewPresetRef.current = preset;
      flyToCity(state.viewer, state.Cesium, state.city, preset);
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    async function init() {
      onStatusChange?.("loading");

      (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL =
        "/cesium/";

      const Cesium = await import("cesium");
      await import("cesium/Build/Cesium/Widgets/widgets.css");

      if (destroyed || !containerRef.current) return;

      const ionToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
      if (ionToken) {
        Cesium.Ion.defaultAccessToken = ionToken;
      }

      Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

      const viewer = new Cesium.Viewer(containerRef.current, {
        globe: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
        requestRenderMode: true,
        creditContainer: creditsRef.current ?? undefined,
        skyBox: false,
      });

      if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
      viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.5);

      const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      let tilesLoaded = false;

      try {
        if (googleKey) {
          const tileset = await Cesium.Cesium3DTileset.fromUrl(
            `https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleKey}`,
            { showCreditsOnScreen: true },
          );
          viewer.scene.primitives.add(tileset);
          tilesLoaded = true;
        } else if (ionToken) {
          const tileset = await Cesium.createGooglePhotorealistic3DTileset();
          viewer.scene.primitives.add(tileset);
          tilesLoaded = true;
        }
      } catch (error) {
        console.error("Failed to load photorealistic tiles:", error);
      }

      if (!tilesLoaded) {
        onStatusChange?.(
          "error",
          "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local (Map Tiles API enabled)",
        );
        viewer.destroy();
        return;
      }

      const state: ViewerState = {
        viewer,
        Cesium,
        pointCollection: null,
        labelEntity: null,
        rotateHandler: null,
        city,
      };
      stateRef.current = state;

      applyTimeOfDay(viewer, Cesium, hour);
      flyToCity(viewer, Cesium, city, viewPresetRef.current);
      updateQRFormation(state, city, qrMatrix, brandColor, message, hour);
      setupAutoRotate(state, city, hour);

      onStatusChange?.("ready");
    }

    init();

    return () => {
      destroyed = true;
      const state = stateRef.current;
      if (state) {
        state.rotateHandler?.();
        state.viewer.destroy();
        stateRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    applyTimeOfDay(state.viewer, state.Cesium, hour);
    setupAutoRotate(state, city, hour);
    state.viewer.scene.requestRender();
  }, [hour, city]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.city = city;
    viewPresetRef.current = "skyline";
    flyToCity(state.viewer, state.Cesium, city, "skyline");
    updateQRFormation(state, city, qrMatrix, brandColor, message, hour);
    setupAutoRotate(state, city, hour);
    state.viewer.scene.requestRender();
  }, [city, qrMatrix, brandColor, message, hour]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div
        ref={creditsRef}
        className="pointer-events-none absolute bottom-0 left-0 max-w-[70%] px-2 py-1 text-[10px] text-white/50"
      />
    </div>
  );
});

export default CesiumPreview;