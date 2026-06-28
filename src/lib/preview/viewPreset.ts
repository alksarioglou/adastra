export type ViewPreset = "skyline" | "overhead" | "qr";

export function usesStreetView(preset: ViewPreset): boolean {
  return preset === "qr";
}