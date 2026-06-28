/** Display altitude for sky QR in Street View. */
export function getStreetViewQrAltitude(baseAltitudeMeters: number): number {
  return Math.max(420, Math.round(baseAltitudeMeters * 2.8));
}

/** How much of the viewport width the QR square should occupy in Scan View. */
export const STREET_VIEW_QR_SCREEN_FRACTION = 0.1;

/** Extra white padding around the QR image (quiet zone), as a fraction of QR size. */
export const STREET_VIEW_QR_QUIET_ZONE_FRACTION = 0.1;

/** Dot diameter as a fraction of cell spacing (leave small gaps between drones). */
export const STREET_VIEW_DOT_FILL = 0.92;

