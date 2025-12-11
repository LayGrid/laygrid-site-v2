// src/app/api/ai/layout/route.ts
import { NextResponse } from "next/server";
/** ---------- Typen ---------- */
type BlockMeta = {
  description?: string;
  clearanceM?: number;
  rotationAllowed?: boolean;
  preferNear?: string[];
  avoidNear?: string[];
  zone?: string;
};
type Block = {
  id: string;
  name: string;
  wM: number;
  dM: number;
  xM: number;
  yM: number;
  rotationDeg: number;
  color?: string;
  meta?: BlockMeta;
};
type Boundary = { widthM: number; depthM: number };
type Settings = {
  snapM: number;
  scalePxPerM: number;
  enforceBoundary: boolean;
};
type FlowEdge = { fromId: string; toId: string; weight: number; bidirectional?: boolean };
type Payload = {
  project: {
    settings: Settings;
    boundary: { widthM: number; depthM: number } | null;
    blocks: Block[];
    files?: any[];
  };
  flows?: FlowEdge[];
  preferences?: {
    weightFlow?: number;
    weightPreferNear?: number;
    weightAvoidNear?: number;
    weightClearance?: number;
    weightOutside?: number;
    weightOverlap?: number;
    weightRotation?: number;
  };
  variants?: number;
  timeBudgetMs?: number;
};
type Solution = {
  score: number;
  blocks: Array<{ id: string; xM: number; yM: number; rotationDeg: number }>;
};
/** ---------- Helpers ---------- */
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const degNorm = (d: number) => ((d % 360) + 360) % 360;
function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}
// vereinfachte Bounding-Box (AABB) für rotiertes Rechteck
function aabb(block: Block) {
  const r = (block.rotationDeg || 0) * (Math.PI / 180);
  const cos = Math.cos(r),
    sin = Math.sin(r);
  const hw = block.wM / 2,
    hd = block.dM / 2;
  const bbW = Math.abs(hw * cos) + Math.abs(hd * sin);
  const bbH = Math.abs(hw * sin) + Math.abs(hd * cos);
  return {
    minX: block.xM - bbW,
    maxX: block.xM + bbW,
    minY: block.yM - bbH,
    maxY: block.yM + bbH,
  };
}
function overlaps(a: Block, b: Block, clearance: number) {
  const A = aabb(a);
  const B = aabb(b);
  return !(
    A.maxX + clearance <= B.minX ||
    A.minX - clearance >= B.maxX ||
    A.maxY + clearance <= B.minY ||
    A.minY - clearance >= B.maxY
  );
}
function keepInside(b: Block, boundary: Boundary) {
  const { widthM, depthM } = boundary;
  b.xM = clamp(b.xM, -widthM / 2 + 0.1, widthM / 2 - 0.1);
  b.yM = clamp(b.yM, -depthM / 2 + 0.1, depthM / 2 - 0.1);
}
/** Kostenfunktion */
function scoreLayout(
  blocks: Block[],
  flows: FlowEdge[],
  boundary: Boundary | null,
  prefs: Required<NonNullable<Payload["preferences"]>>
) {
  let score = 0;
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const center = (b: Block) => ({ x: b.xM, y: b.yM });
  // 1) Flow-Distanzen
  for (const f of flows) {
    const a = byId.get(f.fromId);
    const t = byId.get(f.toId);
    if (!a || !t) continue;
    const d = dist(center(a), center(t));
    score += d * (f.weight || 1) * (prefs.weightFlow ?? 50);
    if (f.bidirectional) score += d * (f.weight || 1) * (prefs.weightFlow ?? 50);
  }
  // 2) preferNear / avoidNear
  for (const b of blocks) {
    const meta = b.meta || {};
    if (meta.preferNear) {
      for (const id of meta.preferNear) {
        const t = byId.get(id);
        if (!t) continue;
        const d = dist(center(b), center(t));
        score += d * (prefs.weightPreferNear ?? 30);
      }
    }
    if (meta.avoidNear) {
      for (const id of meta.avoidNear) {
        const t = byId.get(id);
        if (!t) continue;
        const d = dist(center(b), center(t));
        score += Math.max(0, 15 - d) ** 2 * (prefs.weightAvoidNear ?? 200);
      }
    }
  }

  // 3) Clearance / Overlap
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i],
        b = blocks[j];
      const clear = Math.max(a.meta?.clearanceM ?? 0, b.meta?.clearanceM ?? 0);
      if (overlaps(a, b, clear)) {
        score += prefs.weightOverlap ?? 7000;
      }
    }
  }

  // 4) Outside penalty (grob: Mittelpunkt außerhalb)
  if (boundary) {
    for (const b of blocks) {
      if (
        b.xM < -boundary.widthM / 2 ||
        b.xM > boundary.widthM / 2 ||
        b.yM < -boundary.depthM / 2 ||
        b.yM > boundary.depthM / 2
      ) {
        score += prefs.weightOutside ?? 5000;
      }
    }
  }

  // 5) Rotation (falls Rotation „teuer“ sein soll)
  for (const b of blocks) {
    if ((b.rotationDeg || 0) !== 0) {
      score += (prefs.weightRotation ?? 0.5) * Math.abs(b.rotationDeg);
    }
  }
  return score;
}

/** Startlayout: grob in ein Gitter packen */
function initialPlacement(blocks: Block[], boundary: Boundary | null) {
  const out: Block[] = blocks.map((b) => ({ ...b }));
  if (!boundary) return out;
  const cols = Math.ceil(Math.sqrt(out.length));
  const rows = Math.ceil(out.length / cols);
  const cellW = boundary.widthM / cols;
  const cellH = boundary.depthM / rows;
  for (let i = 0; i < out.length; i++) {
    const c = i % cols,
      r = Math.floor(i / cols);
    out[i].xM = -boundary.widthM / 2 + cellW * (c + 0.5);
    out[i].yM = -boundary.depthM / 2 + cellH * (r + 0.5);
    out[i].rotationDeg = 0;
  }
  return out;
}

/** Zufälliger Move (Pan + Rot), hält in der Hülle */
function mutate(blocks: Block[], boundary: Boundary | null) {
  const out = blocks.map((b) => ({ ...b }));
  const iters = 1 + Math.floor(Math.random() * 3);
  for (let k = 0; k < iters; k++) {
    const i = Math.floor(Math.random() * out.length);
    const b = out[i];
    const step = 0.5; // Meter
    b.xM += rand(-step, step);
    b.yM += rand(-step, step);
    if (b.meta?.rotationAllowed !== false) {
      b.rotationDeg = degNorm(b.rotationDeg + rand(-20, 20));
    }
    if (boundary) keepInside(b, boundary);
  }
  return out;
}

/** ---------- Route ---------- */
export async function POST(req: Request) {
  const payload = (await req.json()) as Payload;
  const boundary: Boundary | null = payload.project.boundary
    ? {
        widthM: payload.project.boundary.widthM,
        depthM: payload.project.boundary.depthM,
      }
    : null;
  const baseBlocks: Block[] = payload.project.blocks.map((b) => ({
    ...b,
    rotationDeg: degNorm(b.rotationDeg || 0),
  }));

  const flows: FlowEdge[] = payload.flows ?? [];
  // PREFS mit Defaults (fix gegen "possibly undefined")
  const prefs: Required<NonNullable<Payload["preferences"]>> = {
    weightFlow: payload.preferences?.weightFlow ?? 50,
    weightPreferNear: payload.preferences?.weightPreferNear ?? 30,
    weightAvoidNear: payload.preferences?.weightAvoidNear ?? 200,
    weightClearance: payload.preferences?.weightClearance ?? 1000,
    weightOutside: payload.preferences?.weightOutside ?? 5000,
    weightOverlap: payload.preferences?.weightOverlap ?? 7000,
    weightRotation: payload.preferences?.weightRotation ?? 0.5,
  };

  const variants = Math.max(1, Math.min(10, payload.variants ?? 3));
  const timeBudgetMs = Math.max(150, payload.timeBudgetMs ?? 900);
  const solutions: Solution[] = [];
  for (let v = 0; v < variants; v++) {
    let cur = initialPlacement(baseBlocks, boundary);
    let curScore = scoreLayout(cur, flows, boundary, prefs);
    let best = cur.map((b) => ({ ...b }));
    let bestScore = curScore;
    const start = Date.now();
    while (Date.now() - start < timeBudgetMs) {
      const cand = mutate(cur, boundary);
      const s = scoreLayout(cand, flows, boundary, prefs);
      if (s <= curScore || Math.random() < 0.15) {
        cur = cand;
        curScore = s;
        if (s < bestScore) {
          best = cand.map((b) => ({ ...b }));
          bestScore = s;
        }
      }
    }

    solutions.push({
      score: bestScore,
      blocks: best.map((b) => ({
        id: b.id,
        xM: b.xM,
        yM: b.yM,
        rotationDeg: degNorm(b.rotationDeg || 0),

      })),

    });

  }

  return NextResponse.json({ solutions });

}
 