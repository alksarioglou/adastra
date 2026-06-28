import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "node_modules/cesium/Build/Cesium");
const dest = path.join(root, "public/cesium");

const folders = ["Workers", "ThirdParty", "Assets", "Widgets"];

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, dstPath);
    else fs.copyFileSync(srcPath, dstPath);
  }
}

if (!fs.existsSync(source)) {
  console.warn("Cesium not installed, skipping asset copy.");
  process.exit(0);
}

for (const folder of folders) {
  copyDir(path.join(source, folder), path.join(dest, folder));
}

console.log("Cesium assets copied to public/cesium/");