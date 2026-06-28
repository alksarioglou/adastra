import QRCode from "qrcode";

function buildQRMatrix(url: string, size?: number): boolean[][] {
  const trimmed = url.trim() || "https://adastra.com";
  const qr = QRCode.create(trimmed, { errorCorrectionLevel: "H" });
  const modules = qr.modules;
  const moduleCount = modules.size;

  const matrix: boolean[][] = [];
  for (let row = 0; row < moduleCount; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < moduleCount; col++) {
      rowData.push(modules.get(row, col) === 1);
    }
    matrix.push(rowData);
  }

  if (size !== undefined && moduleCount > size) {
    const offset = Math.floor((moduleCount - size) / 2);
    return matrix
      .slice(offset, offset + size)
      .map((row) => row.slice(offset, offset + size));
  }

  return matrix;
}

/** Full QR module grid — never crop or scanners cannot decode it. */
export async function generateQRMatrix(url: string): Promise<boolean[][]> {
  return buildQRMatrix(url);
}

/** Cropped matrix for decorative 3D formations (not used for scanning). */
export function generateQRMatrixSync(url: string, size = 29): boolean[][] {
  return buildQRMatrix(url, size);
}

export async function generateQRDataUrl(url: string): Promise<string> {
  const trimmed = url.trim() || "https://adastra.com";
  return QRCode.toDataURL(trimmed, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 512,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}