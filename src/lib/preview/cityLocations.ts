import {
  getOverheadCamera,
  getPedestrianCamera,
  getSkylineCamera,
} from "./cameraPresets";
import type { ViewPreset } from "./viewPreset";

export type Map3DCameraPreset = {
  centerAltitude: number;
  range: number;
  heading: number;
  tilt: number;
};

export type TakeoverLocation = {
  name: string;
  short?: string;
  tagline?: string;
  latitude: number;
  longitude: number;
  qrAltitudeMeters: number;
  map3d: Map3DCameraPreset;
};

export type CityLocation = TakeoverLocation & {
  id: string;
  short: string;
  tagline: string;
};

export type Map3DCamera = {
  center: { lat: number; lng: number; altitude: number };
  range: number;
  heading: number;
  tilt: number;
  cameraPosition?: { lat: number; lng: number; altitude: number };
  fov?: number;
  altitudeMode?: "ABSOLUTE" | "RELATIVE_TO_GROUND" | "RELATIVE_TO_MESH";
};

export const CITY_LOCATIONS: CityLocation[] = [
  {
    id: "san-francisco",
    name: "San Francisco",
    short: "SF",
    tagline: "Financial District",
    latitude: 37.7897,
    longitude: -122.4009,
    qrAltitudeMeters: 180,
    map3d: { centerAltitude: 80, range: 900, heading: 320, tilt: 67 },
  },
  {
    id: "new-york",
    name: "New York",
    short: "NYC",
    tagline: "Midtown Manhattan",
    latitude: 40.758,
    longitude: -73.9855,
    qrAltitudeMeters: 220,
    map3d: { centerAltitude: 60, range: 1100, heading: 45, tilt: 65 },
  },
  {
    id: "austin",
    name: "Austin",
    short: "ATX",
    tagline: "Congress Ave",
    latitude: 30.2672,
    longitude: -97.7431,
    qrAltitudeMeters: 160,
    map3d: { centerAltitude: 50, range: 750, heading: 200, tilt: 62 },
  },
  {
    id: "miami",
    name: "Miami",
    short: "MIA",
    tagline: "Brickell",
    latitude: 25.7617,
    longitude: -80.1918,
    qrAltitudeMeters: 170,
    map3d: { centerAltitude: 40, range: 850, heading: 280, tilt: 64 },
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    short: "LA",
    tagline: "Downtown",
    latitude: 34.0522,
    longitude: -118.2437,
    qrAltitudeMeters: 200,
    map3d: { centerAltitude: 70, range: 950, heading: 90, tilt: 66 },
  },
];

export function getCityLocation(id: string): CityLocation {
  return CITY_LOCATIONS.find((c) => c.id === id) ?? CITY_LOCATIONS[0];
}

export function cityToTakeoverLocation(city: CityLocation): TakeoverLocation {
  return city;
}

const DEFAULT_CUSTOM_CAMERA: Map3DCameraPreset = {
  centerAltitude: 60,
  range: 900,
  heading: 320,
  tilt: 67,
};

export function customTakeoverLocation(
  name: string,
  latitude: number,
  longitude: number,
  tagline?: string,
): TakeoverLocation {
  return {
    name,
    tagline,
    latitude,
    longitude,
    qrAltitudeMeters: 180,
    map3d: DEFAULT_CUSTOM_CAMERA,
  };
}

export function getMap3DCamera(
  location: TakeoverLocation,
  preset: ViewPreset = "skyline",
): Map3DCamera {
  switch (preset) {
    case "skyline":
      return getSkylineCamera(location);
    case "overhead":
      return getOverheadCamera(location);
    case "qr":
      // Closer scan angle — pedestrian holding phone up
      return getPedestrianCamera(location, {
        distance: 55,
        eyeHeight: 1.7,
        fov: 46,
      });
  }
}