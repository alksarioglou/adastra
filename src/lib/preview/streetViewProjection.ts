import { bearingBetween, distanceBetweenMeters } from "./geo";
import { QR_MODULE_SPACING } from "./qrPositions";
import {
  STREET_VIEW_DOT_FILL,
  STREET_VIEW_QR_SCREEN_FRACTION,
} from "./streetViewQr";

export type StreetViewScreenPoint = {
  x: number;
  y: number;
  visible: boolean;
};

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Horizontal FOV in degrees for Street View zoom level. */
export function streetViewHFov(zoom: number): number {
  return 180 / Math.pow(2, zoom);
}

/** Project a sky point onto the Street View viewport using angular offsets. */
export function projectToStreetView(
  panoLat: number,
  panoLng: number,
  panoElevation: number,
  pov: { heading: number; pitch: number },
  zoom: number,
  width: number,
  height: number,
  target: { lat: number; lng: number; altitude: number },
): StreetViewScreenPoint {
  const horizontalDist = Math.max(
    distanceBetweenMeters(panoLat, panoLng, target.lat, target.lng),
    8,
  );
  const bearing = bearingBetween(panoLat, panoLng, target.lat, target.lng);
  const elevationAngle =
    (Math.atan2(target.altitude - panoElevation, horizontalDist) * 180) /
    Math.PI;

  let deltaHeading = bearing - pov.heading;
  while (deltaHeading > 180) deltaHeading -= 360;
  while (deltaHeading < -180) deltaHeading += 360;

  const deltaPitch = elevationAngle - pov.pitch;

  const hFov = streetViewHFov(zoom);
  const vFov = hFov * (height / width);
  const halfH = hFov / 2;
  const halfV = vFov / 2;

  if (Math.abs(deltaHeading) > halfH + 2 || Math.abs(deltaPitch) > halfV + 2) {
    return { x: 0, y: 0, visible: false };
  }

  const tanH = Math.tan(toRad(halfH));
  const tanV = Math.tan(toRad(halfV));

  const nx =
    tanH === 0 ? 0 : Math.tan(toRad(deltaHeading)) / tanH;
  const ny =
    tanV === 0 ? 0 : Math.tan(toRad(deltaPitch)) / tanV;

  const x = width / 2 + nx * (width / 2);
  const y = height / 2 - ny * (height / 2);

  return { x, y, visible: true };
}

export type StreetViewProjectionContext = {
  panoLat: number;
  panoLng: number;
  panoElevation: number;
  pov: { heading: number; pitch: number };
  zoom: number;
  width: number;
  height: number;
};

/**
 * Face-on square in screen space, anchored to the sky point. A horizontal
 * drone plane collapses to a line when pitch is steep; this stays square.
 */
export type ProjectedQRScreen = {
  dots: { key: string; x: number; y: number; visible: boolean }[];
  cellSize: number;
  dotSize: number;
};

export function projectQRSquareScreen(
  ctx: StreetViewProjectionContext,
  centerLat: number,
  centerLng: number,
  altitude: number,
  matrix: boolean[][],
): ProjectedQRScreen {
  const center = projectToStreetView(
    ctx.panoLat,
    ctx.panoLng,
    ctx.panoElevation,
    ctx.pov,
    ctx.zoom,
    ctx.width,
    ctx.height,
    { lat: centerLat, lng: centerLng, altitude },
  );

  const empty: ProjectedQRScreen = { dots: [], cellSize: 0, dotSize: 0 };

  if (!center.visible) {
    return empty;
  }

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return empty;

  const qrSizePx = Math.min(
    ctx.width * STREET_VIEW_QR_SCREEN_FRACTION,
    ctx.height * 0.5,
  );
  const cellSize = qrSizePx / Math.max(cols, rows);
  const dotSize = cellSize * STREET_VIEW_DOT_FILL;
  const gridW = (cols - 1) * cellSize;
  const gridH = (rows - 1) * cellSize;

  const bearing = bearingBetween(
    ctx.panoLat,
    ctx.panoLng,
    centerLat,
    centerLng,
  );
  let deltaHeading = bearing - ctx.pov.heading;
  while (deltaHeading > 180) deltaHeading -= 360;
  while (deltaHeading < -180) deltaHeading += 360;

  const rot = toRad(deltaHeading);
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);

  const dots: { key: string; x: number; y: number; visible: boolean }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!matrix[row][col]) continue;

      const localX = col * cellSize - gridW / 2;
      const localY = row * cellSize - gridH / 2;
      const rx = localX * cosR - localY * sinR;
      const ry = localX * sinR + localY * cosR;

      dots.push({
        key: `${row}-${col}`,
        x: center.x + rx,
        y: center.y + ry,
        visible: true,
      });
    }
  }

  return { dots, cellSize, dotSize };
}