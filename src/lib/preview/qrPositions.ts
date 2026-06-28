import { offsetLatLng } from "./geo";
import type { TakeoverLocation } from "./cityLocations";

export const QR_MODULE_SPACING = 2.8;

export function getQRDronePositions(
  location: TakeoverLocation,
  matrix: boolean[][],
): { lat: number; lng: number; key: string }[] {
  if (matrix.length === 0) return [];

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const offsetX = -((cols - 1) * QR_MODULE_SPACING) / 2;
  const offsetY = ((rows - 1) * QR_MODULE_SPACING) / 2;
  const pts: { lat: number; lng: number; key: string }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!matrix[row][col]) continue;
      const { lat, lng } = offsetLatLng(
        location.latitude,
        location.longitude,
        offsetX + col * QR_MODULE_SPACING,
        offsetY - row * QR_MODULE_SPACING,
      );
      pts.push({ lat, lng, key: `${row}-${col}` });
    }
  }

  return pts;
}