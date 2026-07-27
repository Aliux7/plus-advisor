import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (extname(e.name) === ".tsx" || extname(e.name) === ".ts")
      out.push(full);
  }
  return out;
}

const REPLACEMENTS = [
  // Section-specific raster extensions → .webp
  { from: /"\/about\/([^"]+)\.(png|jpg|jpeg)"/g, to: '"/about/$1.webp"' },
  { from: /"\/office\/([^"]+)\.(png|jpg|jpeg)"/g, to: '"/office/$1.webp"' },
  { from: /"\/stories\/([^"]+)\.(png|jpg|jpeg)"/g, to: '"/stories/$1.webp"' },
  // Move the 4 shared assets from /home/ → /shared/
  {
    from: /"\/home\/family-legacy-ellipse\.webp"/g,
    to: '"/shared/family-legacy-ellipse.webp"',
  },
  {
    from: /"\/home\/blue-mountain-sand\.webp"/g,
    to: '"/shared/blue-mountain-sand.webp"',
  },
  {
    from: /"\/home\/quote-ellipse-small\.webp"/g,
    to: '"/shared/quote-ellipse-small.svg"',
  },
  {
    from: /"\/home\/quote-ellipse-large\.webp"/g,
    to: '"/shared/quote-ellipse-large.webp"',
  },
  // stories/blue-mountain-sand was a duplicate of the home one — reroute to shared
  {
    from: /"\/stories\/blue-mountain-sand\.webp"/g,
    to: '"/shared/blue-mountain-sand.webp"',
  },
];

const files = await walk("app");
let changed = 0;
for (const file of files) {
  const src = await readFile(file, "utf8");
  let out = src;
  for (const { from, to } of REPLACEMENTS) out = out.replace(from, to);
  if (out !== src) {
    await writeFile(file, out);
    changed++;
    console.log("Updated:", file);
  }
}
console.log(`\nChanged ${changed} files.`);
