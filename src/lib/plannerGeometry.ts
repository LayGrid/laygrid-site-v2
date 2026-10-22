// src/lib/plannerGeometry.ts

export type GeometryBoundary = {
  widthM: number;
  depthM: number;
};

export type GeometryBlockLike = {
  wM: number;
  dM: number;
  rotationDeg: number;
};

export type GeometryPoint = {
  xM: number;
  yM: number;
};

export type GeometryRect = {
  widthM: number;
  depthM: number;
};

export type GeometryWallLike = {
  lengthM: number;
  thicknessM: number;
  orientation: "horizontal" | "vertical";
};

const ROUND_DECIMALS = 3;

export function round(value: number, decimals = ROUND_DECIMALS): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function sanitizePositive(
  value: number,
  fallback = 1,
  min = 0.1
): number {
  if (!Number.isFinite(value) || value <= 0) return Math.max(min, fallback);
  return Math.max(min, round(value));
}

export function sanitizeNonNegative(value: number, fallback = 0): number {
  if (!Number.isFinite(value) || value < 0) return Math.max(0, fallback);
  return round(value);
}

export function sanitizeText(value: string | undefined, fallback: string): string {
  const text = (value ?? "").trim();
  return text.length > 0 ? text : fallback;
}

export function snapValue(value: number, step: number): number {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(step) || step <= 0) return round(value);
  return round(Math.round(value / step) * step);
}

export function normalizeRotation(rotationDeg: number): number {
  if (!Number.isFinite(rotationDeg)) return 0;
  let next = rotationDeg % 360;
  if (next < 0) next += 360;
  if (Math.abs(next) < 1e-9) next = 0;
  return round(next);
}

export function getRotatedFootprint(block: GeometryBlockLike): GeometryRect {
  const w = sanitizePositive(block.wM, 1);
  const d = sanitizePositive(block.dM, 1);
  const rot = normalizeRotation(block.rotationDeg);
  const rad = (rot * Math.PI) / 180;

  const absCos = Math.abs(Math.cos(rad));
  const absSin = Math.abs(Math.sin(rad));

  const widthM = round(w * absCos + d * absSin);
  const depthM = round(w * absSin + d * absCos);

  return { widthM, depthM };
}

export function getWallFootprint(wall: GeometryWallLike): GeometryRect {
  const lengthM = sanitizePositive(wall.lengthM, 4, 0.1);
  const thicknessM = sanitizePositive(wall.thicknessM, 0.2, 0.05);

  return wall.orientation === "vertical"
    ? { widthM: thicknessM, depthM: lengthM }
    : { widthM: lengthM, depthM: thicknessM };
}

export function clampRectCenterToBoundary(
  center: GeometryPoint,
  rect: GeometryRect,
  boundary: GeometryBoundary
): GeometryPoint {
  const halfW = sanitizePositive(rect.widthM, 1) / 2;
  const halfD = sanitizePositive(rect.depthM, 1) / 2;

  const boundaryHalfW = sanitizePositive(boundary.widthM, 1) / 2;
  const boundaryHalfD = sanitizePositive(boundary.depthM, 1) / 2;

  const minX = -boundaryHalfW + halfW;
  const maxX = boundaryHalfW - halfW;
  const minY = -boundaryHalfD + halfD;
  const maxY = boundaryHalfD - halfD;

  const safeX = Number.isFinite(center.xM) ? center.xM : 0;
  const safeY = Number.isFinite(center.yM) ? center.yM : 0;

  return {
    xM: round(minX <= maxX ? clamp(safeX, minX, maxX) : 0),
    yM: round(minY <= maxY ? clamp(safeY, minY, maxY) : 0),
  };
}

export function fitBlockSizeToBoundary(
  block: GeometryBlockLike,
  boundary: GeometryBoundary
): {
  wM: number;
  dM: number;
  scaled: boolean;
} {
  const safeBoundaryW = sanitizePositive(boundary.widthM, 1);
  const safeBoundaryD = sanitizePositive(boundary.depthM, 1);

  let wM = sanitizePositive(block.wM, 1);
  let dM = sanitizePositive(block.dM, 1);

  const fp = getRotatedFootprint({
    wM,
    dM,
    rotationDeg: block.rotationDeg,
  });

  const scaleFactor = Math.min(
    1,
    safeBoundaryW / fp.widthM,
    safeBoundaryD / fp.depthM
  );

  if (scaleFactor >= 1) {
    return { wM, dM, scaled: false };
  }

  wM = round(wM * scaleFactor);
  dM = round(dM * scaleFactor);

  return {
    wM: sanitizePositive(wM, 0.1, 0.1),
    dM: sanitizePositive(dM, 0.1, 0.1),
    scaled: true,
  };
}

export function clampBlockCenterToBoundary(
  center: GeometryPoint,
  block: GeometryBlockLike,
  boundary: GeometryBoundary
): GeometryPoint {
  return clampRectCenterToBoundary(
    center,
    getRotatedFootprint(block),
    boundary
  );
}

export function clampWallCenterToBoundary(
  center: GeometryPoint,
  wall: GeometryWallLike,
  boundary: GeometryBoundary
): GeometryPoint {
  return clampRectCenterToBoundary(center, getWallFootprint(wall), boundary);
}

export function getBlockAABB(
  center: GeometryPoint,
  block: GeometryBlockLike,
  clearanceM = 0
) {
  const fp = getRotatedFootprint(block);
  const extra = sanitizeNonNegative(clearanceM, 0) * 2;

  const halfW = (fp.widthM + extra) / 2;
  const halfD = (fp.depthM + extra) / 2;

  return {
    left: round(center.xM - halfW),
    right: round(center.xM + halfW),
    top: round(center.yM - halfD),
    bottom: round(center.yM + halfD),
  };
}

export function aabbIntersects(
  a: ReturnType<typeof getBlockAABB>,
  b: ReturnType<typeof getBlockAABB>
): boolean {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}