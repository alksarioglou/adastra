import { generateSFSkyline } from "./sfSkyline";

export type BuildingStyle =
  | "glass"
  | "concrete"
  | "spire"
  | "artdeco"
  | "esri"
  | "pyramid";

export type CityVisualStyle = "stylized" | "esri";

export type Building = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  style: BuildingStyle;
  accent?: string;
};

export type CityPreset = {
  id: string;
  name: string;
  tagline: string;
  skylineColor: string;
  visualStyle: CityVisualStyle;
  qrAltitude: number;
  qrPosition: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  buildings: Building[];
};

const block = (
  x: number,
  z: number,
  width: number,
  depth: number,
  height: number,
  style: BuildingStyle = "glass",
  accent?: string,
): Building => ({ x, z, width, depth, height, style, accent });

export const CITY_PRESETS: CityPreset[] = [
  {
    id: "san-francisco",
    name: "San Francisco",
    tagline: "Downtown extruded footprints · Esri-style",
    skylineColor: "#d9cebb",
    visualStyle: "esri",
    qrAltitude: 72,
    qrPosition: [2, 72, -15],
    cameraPosition: [42, 52, 58],
    cameraTarget: [0, 8, -12],
    buildings: generateSFSkyline(),
  },
  {
    id: "new-york",
    name: "New York",
    tagline: "Midtown Manhattan grid",
    skylineColor: "#2a2a3a",
    visualStyle: "stylized",
    qrAltitude: 48,
    qrPosition: [2, 48, -6],
    cameraPosition: [32, 16, 42],
    cameraTarget: [0, 20, 0],
    buildings: [
      block(-20, -8, 6, 6, 38, "concrete"),
      block(-12, -6, 5, 5, 55, "spire", "#d4c5a0"),
      block(-4, -4, 4, 4, 32, "glass"),
      block(4, -2, 5, 5, 44, "glass"),
      block(12, -4, 4, 6, 36, "concrete"),
      block(20, -6, 5, 5, 28, "glass"),
      block(-16, 6, 6, 4, 24, "concrete"),
      block(-6, 8, 4, 4, 40, "spire"),
      block(6, 10, 5, 5, 30, "glass"),
      block(16, 8, 4, 4, 22, "concrete"),
      block(-10, 14, 5, 3, 18, "concrete"),
      block(10, 16, 4, 4, 26, "glass"),
    ],
  },
  {
    id: "austin",
    name: "Austin",
    tagline: "Downtown + Congress Ave",
    skylineColor: "#3d2e1f",
    visualStyle: "stylized",
    qrAltitude: 36,
    qrPosition: [0, 36, -10],
    cameraPosition: [26, 12, 34],
    cameraTarget: [0, 15, 0],
    buildings: [
      block(-14, -4, 4, 4, 28, "glass"),
      block(-6, -2, 3, 3, 38, "spire", "#e8e0d0"),
      block(2, 0, 4, 4, 22, "concrete"),
      block(10, -2, 5, 4, 26, "glass"),
      block(16, -4, 4, 5, 20, "concrete"),
      block(-10, 8, 5, 3, 16, "concrete"),
      block(4, 10, 4, 4, 18, "glass"),
      block(14, 8, 3, 3, 14, "concrete"),
      block(-4, 14, 4, 3, 12, "concrete"),
    ],
  },
  {
    id: "miami",
    name: "Miami",
    tagline: "Brickell waterfront",
    skylineColor: "#1a4a6e",
    visualStyle: "stylized",
    qrAltitude: 40,
    qrPosition: [-2, 40, -12],
    cameraPosition: [30, 14, 40],
    cameraTarget: [0, 18, 0],
    buildings: [
      block(-18, -6, 6, 4, 32, "artdeco", "#f0e6d8"),
      block(-10, -4, 5, 5, 42, "glass"),
      block(-2, -2, 4, 4, 36, "glass"),
      block(8, 0, 5, 4, 48, "spire", "#87ceeb"),
      block(16, -2, 4, 5, 34, "artdeco"),
      block(-12, 10, 5, 3, 24, "artdeco"),
      block(4, 12, 4, 4, 28, "glass"),
      block(14, 10, 3, 3, 20, "glass"),
    ],
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    tagline: "DTLA skyline",
    skylineColor: "#4a3520",
    visualStyle: "stylized",
    qrAltitude: 44,
    qrPosition: [1, 44, -7],
    cameraPosition: [34, 15, 44],
    cameraTarget: [0, 18, 0],
    buildings: [
      block(-20, -8, 5, 5, 30, "concrete"),
      block(-12, -6, 4, 4, 52, "spire", "#b8c8d8"),
      block(-4, -4, 5, 4, 28, "glass"),
      block(6, -2, 4, 5, 38, "glass"),
      block(14, -4, 5, 5, 32, "concrete"),
      block(20, -6, 4, 4, 24, "glass"),
      block(-8, 8, 6, 4, 18, "concrete"),
      block(4, 10, 4, 4, 22, "glass"),
      block(16, 8, 3, 3, 16, "concrete"),
    ],
  },
];

export function getCityPreset(id: string): CityPreset {
  return CITY_PRESETS.find((c) => c.id === id) ?? CITY_PRESETS[0];
}