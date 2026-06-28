import type { Building } from "./cityPresets";

const BEIGE = "#d9cebb";

function hash(gx: number, gz: number): number {
  return Math.abs(gx * 73 + gz * 37 + gx * gz * 11) % 100;
}

function footprint(
  x: number,
  z: number,
  width: number,
  depth: number,
  height: number,
): Building {
  return {
    x,
    z,
    width,
    depth,
    height,
    style: "esri",
    accent: BEIGE,
  };
}

/** Dense extruded-footprint downtown SF matching Esri Scene Viewer style */
export function generateSFSkyline(): Building[] {
  const buildings: Building[] = [];

  for (let gx = -28; gx <= 28; gx += 1) {
    for (let gz = -22; gz <= 18; gz += 1) {
      const h = hash(gx, gz);

      // Street grid gaps
      if (gx % 5 === 0 || gz % 4 === 0) continue;
      if (h < 12) continue;

      const dist = Math.sqrt(gx * gx + gz * gz);
      let height = 6 + (h % 12);

      // FiDi / SOMA core — taller cluster
      if (dist < 10) height = 14 + (h % 22);
      if (dist < 5) height = 22 + (h % 28);

      // Salesforce Tower (tallest)
      if (gx === 2 && gz === 4) height = 62;
      // 555 California
      if (gx === -2 && gz === 2) height = 48;
      // One Rincon
      if (gx === 8 && gz === -6) height = 44;
      // Millennium Tower area
      if (gx === 4 && gz === 0) height = 40;

      const width = 1.6 + (h % 3) * 0.35;
      const depth = 1.4 + ((h + 3) % 3) * 0.35;

      buildings.push(footprint(gx * 1.15, gz * 1.15, width, depth, height));
    }
  }

  // Transamerica Pyramid landmark
  buildings.push({
    x: -5.5,
    z: 3,
    width: 4.5,
    depth: 4.5,
    height: 42,
    style: "pyramid",
    accent: BEIGE,
  });

  // Embarcadero low-rise waterfront strip
  for (let i = -20; i <= 20; i += 3) {
    buildings.push(footprint(i * 1.1, -20, 2.2, 1.8, 4 + (hash(i, -20) % 6)));
  }

  return buildings;
}

export const SF_ESRI_COLORS = {
  building: BEIGE,
  buildingSide: "#c8bfad",
  ground: "#e2d9c8",
  bay: "#a8bcc8",
  bayFog: "#c8d4dc",
  sky: "#c5d2dc",
  hills: "#b0b8a8",
};