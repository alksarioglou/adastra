import { offsetLatLng } from "./geo";
import type { Map3DCamera, TakeoverLocation } from "./cityLocations";
import { QR_MODULE_SPACING } from "./qrPositions";

const DEFAULT_QR_MODULES = 29;

/** Oblique city skyline — campaign planning overview. */
export function getSkylineCamera(location: TakeoverLocation): Map3DCamera {
  const { map3d } = location;
  return {
    center: {
      lat: location.latitude,
      lng: location.longitude,
      altitude: map3d.centerAltitude,
    },
    range: map3d.range,
    heading: map3d.heading,
    tilt: map3d.tilt,
  };
}

/** Directly overhead camera — tilt 0 (nadir), centered on the QR formation. */
export function getOverheadCamera(
  location: TakeoverLocation,
  options: { range?: number; fov?: number } = {},
): Map3DCamera {
  const gridSpan = (DEFAULT_QR_MODULES - 1) * QR_MODULE_SPACING;
  const fov = options.fov ?? 52;
  const halfFovRad = ((fov / 2) * Math.PI) / 180;
  const autoRange = ((gridSpan / 2) / Math.tan(halfFovRad)) * 1.4;
  const range = options.range ?? Math.max(160, Math.round(autoRange));

  return {
    center: {
      lat: location.latitude,
      lng: location.longitude,
      altitude: location.qrAltitudeMeters,
    },
    range,
    heading: location.map3d.heading,
    tilt: 0,
    fov,
    altitudeMode: "RELATIVE_TO_GROUND",
  };
}

/** Eye-level camera on the sidewalk, looking up at the QR formation. */
export function getPedestrianCamera(
  location: TakeoverLocation,
  options: {
    /** Horizontal distance from QR center to viewer (meters). */
    distance?: number;
    /** Eye height above ground mesh (meters). */
    eyeHeight?: number;
    fov?: number;
  } = {},
): Map3DCamera {
  const { map3d } = location;
  const distance = options.distance ?? 72;
  const eyeHeight = options.eyeHeight ?? 1.7;
  const fov = options.fov ?? 58;

  // Viewer stands behind the camera's default viewing direction.
  const approachHeading = (map3d.heading + 180) % 360;
  const rad = (approachHeading * Math.PI) / 180;
  const viewerPos = offsetLatLng(
    location.latitude,
    location.longitude,
    distance * Math.sin(rad),
    distance * Math.cos(rad),
  );

  const qrAlt = location.qrAltitudeMeters;
  const verticalDelta = qrAlt - eyeHeight;
  const range = Math.hypot(distance, verticalDelta);
  const elevationAngle =
    (Math.atan2(verticalDelta, distance) * 180) / Math.PI;
  // tilt 0 = nadir, 90 = horizon, 180 = zenith
  const tilt = 90 + elevationAngle;

  return {
    center: {
      lat: location.latitude,
      lng: location.longitude,
      altitude: qrAlt,
    },
    cameraPosition: {
      lat: viewerPos.lat,
      lng: viewerPos.lng,
      altitude: eyeHeight,
    },
    heading: map3d.heading,
    range,
    tilt,
    fov,
    altitudeMode: "RELATIVE_TO_MESH",
  };
}