import QRCode from "qrcode";

const QUIET_MODULES = 4;
const CANVAS_PX = 512;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders a scannable QR with rounded-square "drone" modules on a transparent
 * quiet zone — the sky behind acts as the light background.
 */
export function renderStreetViewQRCanvas(
  url: string,
  options: { glow: boolean; glowColor: string },
): string {
  const trimmed = url.trim() || "https://adastra.com";
  const qr = QRCode.create(trimmed, { errorCorrectionLevel: "H" });
  const modules = qr.modules;
  const count = modules.size;
  const total = count + QUIET_MODULES * 2;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_PX;
  canvas.height = CANVAS_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const cell = CANVAS_PX / total;
  const moduleSize = cell * 0.9;
  const inset = (cell - moduleSize) / 2;
  const corner = moduleSize * 0.18;
  const moduleColor = "#0b0b0b";

  ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);

  // Glow pass — soft accent behind modules; sharp modules drawn on top for scan fidelity.
  if (options.glow) {
    ctx.fillStyle = options.glowColor;
    ctx.globalAlpha = 0.35;
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!modules.get(row, col)) continue;
        const x = (col + QUIET_MODULES) * cell + inset;
        const y = (row + QUIET_MODULES) * cell + inset;
        const pad = cell * 0.12;
        roundRect(ctx, x - pad, y - pad, moduleSize + pad * 2, moduleSize + pad * 2, corner + pad);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = moduleColor;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules.get(row, col)) continue;

      const x = (col + QUIET_MODULES) * cell + inset;
      const y = (row + QUIET_MODULES) * cell + inset;

      roundRect(ctx, x, y, moduleSize, moduleSize, corner);
      ctx.fill();
    }
  }

  return canvas.toDataURL("image/png");
}