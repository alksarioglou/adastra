export type ViewPreset = "skyline" | "overhead" | "street" | "qr";

export function usesStreetView(preset: ViewPreset): boolean {
  return preset === "street" || preset === "qr";
}