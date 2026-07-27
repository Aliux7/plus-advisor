import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOTS = ["public/about", "public/office", "public/stories"];
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);
const QUALITY = 82;

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (RASTER_EXT.has(extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

const targets = (await Promise.all(ROOTS.map((r) => walk(r)))).flat();
let totalIn = 0;
let totalOut = 0;

for (const src of targets) {
  const dst = src.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const inBytes = (await stat(src)).size;
  await sharp(src).webp({ quality: QUALITY }).toFile(dst);
  const outBytes = (await stat(dst)).size;
  totalIn += inBytes;
  totalOut += outBytes;
  const pct = ((1 - outBytes / inBytes) * 100).toFixed(1);
  console.log(
    `${src.padEnd(50)} ${(inBytes / 1024).toFixed(0).padStart(6)}KB → ${(
      outBytes / 1024
    )
      .toFixed(0)
      .padStart(6)}KB  (-${pct}%)`,
  );
}

console.log(
  `\nTotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB → ${(
    totalOut /
    1024 /
    1024
  ).toFixed(1)}MB (saved ${((1 - totalOut / totalIn) * 100).toFixed(1)}%)`,
);
