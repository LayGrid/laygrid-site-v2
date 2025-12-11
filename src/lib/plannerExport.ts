import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Block, Boundary, FileRef, Settings } from "@/store/planner";

export type Project = {
  settings: Settings;
  boundary: Boundary | null;
  files: FileRef[];
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
};

export async function exportZip(p: Project) {
  const zip = new JSZip();
  zip.file("project.json", JSON.stringify(p, null, 2));

  // Einfaches SVG (2D)
  zip.file("layout.svg", renderSVG(p));

  // Originaldateien
  const folder = zip.folder("files");
  if (folder) {
    for (const f of p.files) {
      const res = await fetch(f.url);
      const blob = await res.blob();
      folder.file(f.name, blob);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "laygrid-project.zip");
}

// Minimaler SVG Renderer (Metrik: 1 m = settings.scalePxPerM px)
function renderSVG(p: Project): string {
  const s = p.settings.scalePxPerM;
  const W = 2000, H = 1400;
  const rects = p.blocks
    .map((b) => {
      const w = b.wM * s;
      const h = b.dM * s;
      const x = (b.xM * s) + W / 2;
      const y = (b.yM * s) + H / 2;
      const rot = b.rotationDeg;
      return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${b.color}" fill-opacity="0.3" stroke="${b.color}" transform="rotate(${rot},${x},${y})"/>`;
    })
    .join("\n");
  const boundary = p.boundary
    ? `<rect x="${W/2 - (p.boundary.widthM*s)/2}" y="${H/2 - (p.boundary.depthM*s)/2}" width="${p.boundary.widthM*s}" height="${p.boundary.depthM*s}" fill="none" stroke="#888" stroke-dasharray="6 6"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  ${boundary}
  ${rects}
</svg>`;
}
