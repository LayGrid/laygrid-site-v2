// src/store/planner.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  aabbIntersects,
  clamp,
  clampBlockCenterToBoundary,
  clampWallCenterToBoundary,
  fitBlockSizeToBoundary,
  getBlockAABB,
  normalizeRotation,
  round,
  sanitizeNonNegative,
  sanitizePositive,
  sanitizeText,
  snapValue,
} from "@/lib/plannerGeometry";

export type Settings = {
  scalePxPerM: number;
  snapM: number;
  enforceBoundary: boolean;
};

export type Boundary = {
  type: "rect";
  widthM: number;
  depthM: number;
  locked: boolean;
};

export type FileRef = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

export type BlockMeta = {
  description?: string;
  clearanceM?: number;
  rotationAllowed?: boolean;
  preferNear?: string[];
  avoidNear?: string[];
  zone?: "raw" | "machining" | "assembly" | "shipping" | "office" | "custom";
};

export type Block = {
  id: string;
  name: string;
  wM: number;
  dM: number;
  hM?: number;
  xM: number;
  yM: number;
  rotationDeg: number;
  color: string;
  fileRefId?: string;
  meta?: BlockMeta;
};

export type WallOrientation = "horizontal" | "vertical";

export type Wall = {
  id: string;
  name: string;
  xM: number;
  yM: number;
  lengthM: number;
  thicknessM: number;
  orientation: WallOrientation;
  color: string;
};

export type SelectedEntity =
  | { type: "block"; id: string }
  | { type: "wall"; id: string }
  | null;

export type FlowEdge = {
  fromId: string;
  toId: string;
  weight: number;
  bidirectional?: boolean;
};

export type AISolution = {
  score: number;
  blocks: Array<{ id: string; xM: number; yM: number; rotationDeg: number }>;
};

type CameraState = {
  x: number;
  y: number;
  scale: number;
};

type PreviewBlock = {
  id: string;
  xM: number;
  yM: number;
  rotationDeg: number;
};

type PlannerState = {
  settings: Settings;
  boundary: Boundary | null;
  files: FileRef[];
  blocks: Block[];
  walls: Wall[];
  selected: SelectedEntity;
  camera: CameraState;

  aiSolutions: AISolution[];
  showAIModal: boolean;
  previewBlocks: PreviewBlock[] | null;

  setBoundary: (b: Boundary) => void;
  setSettings: (p: Partial<Settings>) => void;

  addBlock: (b: Omit<Block, "id">) => void;
  updateBlock: (id: string, p: Partial<Block>) => void;
  moveBlock: (id: string, xM: number, yM: number) => void;
  deleteBlock: (id: string) => void;

  addWall: (wall: Omit<Wall, "id">) => void;
  updateWall: (id: string, p: Partial<Wall>) => void;
  moveWall: (id: string, xM: number, yM: number) => void;
  deleteWall: (id: string) => void;

  setSelected: (selected: SelectedEntity) => void;
  addFiles: (fs: File[]) => Promise<void>;
  setCamera: (p: Partial<CameraState>) => void;
  reset: () => void;

  setAISolutions: (s: AISolution[]) => void;
  setAIModal: (open: boolean) => void;
  applyAISolution: (index: number) => void;

  setPreviewBlocks: (s: PreviewBlock[] | null) => void;
};

const DEFAULT_SETTINGS: Settings = {
  scalePxPerM: 100,
  snapM: 0.5,
  enforceBoundary: true,
};

const DEFAULT_CAMERA: CameraState = {
  x: 0,
  y: 0,
  scale: 1,
};

const DEFAULT_BLOCK_COLOR = "#999999";
const DEFAULT_BLOCK_NAME = "Objekt";
const DEFAULT_WALL_COLOR = "#71717a";
const DEFAULT_WALL_NAME = "Wand";

const uid = () => Math.random().toString(36).slice(2, 10);

function sanitizeColor(value: string | undefined, fallback: string) {
  const v = (value ?? "").trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? v : fallback;
}

function sanitizeStringArray(value: string[] | undefined): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const cleaned = Array.from(
    new Set(
      value
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
    )
  );

  return cleaned.length > 0 ? cleaned : undefined;
}

function sanitizeMeta(meta: BlockMeta | undefined): BlockMeta | undefined {
  if (!meta) return undefined;

  const next: BlockMeta = {};

  if (typeof meta.description === "string") {
    const desc = meta.description.trim();
    if (desc) next.description = desc;
  }

  if (typeof meta.clearanceM === "number") {
    next.clearanceM = sanitizeNonNegative(meta.clearanceM, 0);
  }

  if (typeof meta.rotationAllowed === "boolean") {
    next.rotationAllowed = meta.rotationAllowed;
  }

  const preferNear = sanitizeStringArray(meta.preferNear);
  const avoidNear = sanitizeStringArray(meta.avoidNear);

  if (preferNear) next.preferNear = preferNear;
  if (avoidNear) next.avoidNear = avoidNear;

  if (
    meta.zone &&
    ["raw", "machining", "assembly", "shipping", "office", "custom"].includes(
      meta.zone
    )
  ) {
    next.zone = meta.zone;
  }

  return Object.keys(next).length > 0 ? next : undefined;
}

function sanitizeSettings(
  current: Settings,
  patch: Partial<Settings>
): Settings {
  const scalePxPerM = clamp(
    sanitizePositive(
      patch.scalePxPerM ?? current.scalePxPerM,
      current.scalePxPerM,
      10
    ),
    10,
    500
  );

  const snapM = clamp(
    sanitizePositive(patch.snapM ?? current.snapM, current.snapM, 0.1),
    0.1,
    10
  );

  return {
    scalePxPerM,
    snapM,
    enforceBoundary:
      typeof patch.enforceBoundary === "boolean"
        ? patch.enforceBoundary
        : current.enforceBoundary,
  };
}

function sanitizeBoundary(boundary: Boundary): Boundary {
  return {
    type: "rect",
    widthM: sanitizePositive(boundary.widthM, 20, 1),
    depthM: sanitizePositive(boundary.depthM, 12, 1),
    locked: Boolean(boundary.locked),
  };
}

function sanitizeCamera(current: CameraState, patch: Partial<CameraState>): CameraState {
  return {
    x: Number.isFinite(patch.x) ? round(patch.x as number) : current.x,
    y: Number.isFinite(patch.y) ? round(patch.y as number) : current.y,
    scale: clamp(
      Number.isFinite(patch.scale) ? round(patch.scale as number) : current.scale,
      0.2,
      4
    ),
  };
}

function snapPosition(
  xM: number,
  yM: number,
  settings: Settings
): { xM: number; yM: number } {
  return {
    xM: snapValue(xM, settings.snapM),
    yM: snapValue(yM, settings.snapM),
  };
}

function sanitizeBlock(
  input: Partial<Block> & Pick<Block, "id">,
  current: Block | null,
  settings: Settings,
  boundary: Boundary | null
): Block {
  const merged: Block = {
    id: input.id,
    name: sanitizeText(input.name ?? current?.name, DEFAULT_BLOCK_NAME),
    wM: sanitizePositive(input.wM ?? current?.wM ?? 1, current?.wM ?? 1, 0.1),
    dM: sanitizePositive(input.dM ?? current?.dM ?? 1, current?.dM ?? 1, 0.1),
    hM: sanitizeNonNegative(input.hM ?? current?.hM ?? 0, current?.hM ?? 0),
    xM: Number.isFinite(input.xM) ? round(input.xM as number) : current?.xM ?? 0,
    yM: Number.isFinite(input.yM) ? round(input.yM as number) : current?.yM ?? 0,
    rotationDeg: normalizeRotation(
      input.rotationDeg ?? current?.rotationDeg ?? 0
    ),
    color: sanitizeColor(
      input.color ?? current?.color,
      current?.color ?? DEFAULT_BLOCK_COLOR
    ),
    fileRefId:
      typeof input.fileRefId === "string"
        ? input.fileRefId
        : current?.fileRefId,
    meta: sanitizeMeta(input.meta ?? current?.meta),
  };

  if (merged.meta?.rotationAllowed === false) {
    merged.rotationDeg = 0;
  }

  if (settings.enforceBoundary && boundary) {
    const fitted = fitBlockSizeToBoundary(
      {
        wM: merged.wM,
        dM: merged.dM,
        rotationDeg: merged.rotationDeg,
      },
      boundary
    );

    merged.wM = fitted.wM;
    merged.dM = fitted.dM;
  }

  const snapped = snapPosition(merged.xM, merged.yM, settings);
  merged.xM = snapped.xM;
  merged.yM = snapped.yM;

  if (settings.enforceBoundary && boundary) {
    const clamped = clampBlockCenterToBoundary(
      { xM: merged.xM, yM: merged.yM },
      {
        wM: merged.wM,
        dM: merged.dM,
        rotationDeg: merged.rotationDeg,
      },
      boundary
    );

    merged.xM = clamped.xM;
    merged.yM = clamped.yM;
  }

  return merged;
}

function sanitizeWallOrientation(
  value: WallOrientation | undefined,
  fallback: WallOrientation
): WallOrientation {
  return value === "vertical" ? "vertical" : fallback;
}

function sanitizeWall(
  input: Partial<Wall> & Pick<Wall, "id">,
  current: Wall | null,
  settings: Settings,
  boundary: Boundary | null
): Wall {
  const merged: Wall = {
    id: input.id,
    name: sanitizeText(input.name ?? current?.name, DEFAULT_WALL_NAME),
    xM: Number.isFinite(input.xM) ? round(input.xM as number) : current?.xM ?? 0,
    yM: Number.isFinite(input.yM) ? round(input.yM as number) : current?.yM ?? 0,
    lengthM: sanitizePositive(
      input.lengthM ?? current?.lengthM ?? 4,
      current?.lengthM ?? 4,
      0.1
    ),
    thicknessM: sanitizePositive(
      input.thicknessM ?? current?.thicknessM ?? 0.2,
      current?.thicknessM ?? 0.2,
      0.05
    ),
    orientation: sanitizeWallOrientation(
      input.orientation ?? current?.orientation,
      current?.orientation ?? "horizontal"
    ),
    color: sanitizeColor(
      input.color ?? current?.color,
      current?.color ?? DEFAULT_WALL_COLOR
    ),
  };

  const snapped = snapPosition(merged.xM, merged.yM, settings);
  merged.xM = snapped.xM;
  merged.yM = snapped.yM;

  if (settings.enforceBoundary && boundary) {
    const clamped = clampWallCenterToBoundary(
      { xM: merged.xM, yM: merged.yM },
      {
        lengthM: merged.lengthM,
        thicknessM: merged.thicknessM,
        orientation: merged.orientation,
      },
      boundary
    );

    merged.xM = clamped.xM;
    merged.yM = clamped.yM;
  }

  return merged;
}

function blocksOverlap(a: Block, b: Block): boolean {
  const aabbA = getBlockAABB(
    { xM: a.xM, yM: a.yM },
    { wM: a.wM, dM: a.dM, rotationDeg: a.rotationDeg },
    a.meta?.clearanceM ?? 0
  );

  const aabbB = getBlockAABB(
    { xM: b.xM, yM: b.yM },
    { wM: b.wM, dM: b.dM, rotationDeg: b.rotationDeg },
    b.meta?.clearanceM ?? 0
  );

  return aabbIntersects(aabbA, aabbB);
}

function findInitialPlacement(
  candidate: Block,
  existingBlocks: Block[],
  settings: Settings,
  boundary: Boundary | null
): Block {
  if (!boundary || !settings.enforceBoundary) {
    return candidate;
  }

  const collides = existingBlocks.some((b) => blocksOverlap(candidate, b));
  if (!collides) return candidate;

  const step = settings.snapM > 0 ? settings.snapM : 0.5;
  const maxRadius = Math.ceil(Math.max(boundary.widthM, boundary.depthM) / step);

  for (let radius = 0; radius <= maxRadius; radius++) {
    for (let gx = -radius; gx <= radius; gx++) {
      for (let gy = -radius; gy <= radius; gy++) {
        const isPerimeter =
          Math.abs(gx) === radius || Math.abs(gy) === radius;

        if (!isPerimeter) continue;

        const probe = sanitizeBlock(
          {
            ...candidate,
            xM: gx * step,
            yM: gy * step,
          },
          candidate,
          settings,
          boundary
        );

        const hit = existingBlocks.some((b) => blocksOverlap(probe, b));
        if (!hit) return probe;
      }
    }
  }

  return candidate;
}

function revokeFileUrls(files: FileRef[]) {
  for (const file of files) {
    try {
      URL.revokeObjectURL(file.url);
    } catch {
      // bewusst still
    }
  }
}

export const usePlanner = create<PlannerState>()(
  devtools(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      boundary: null,
      files: [],
      blocks: [],
      walls: [],
      selected: null,
      camera: DEFAULT_CAMERA,

      aiSolutions: [],
      showAIModal: false,
      previewBlocks: null,

      setBoundary: (boundary) => {
        const nextBoundary = sanitizeBoundary(boundary);

        set(
          (state) => ({
            boundary: nextBoundary,
            blocks: state.blocks.map((block) =>
              sanitizeBlock(block, block, state.settings, nextBoundary)
            ),
            walls: state.walls.map((wall) =>
              sanitizeWall(wall, wall, state.settings, nextBoundary)
            ),
          }),
          false,
          "planner/setBoundary"
        );
      },

      setSettings: (patch) => {
        set(
          (state) => {
            const nextSettings = sanitizeSettings(state.settings, patch);

            return {
              settings: nextSettings,
              blocks: state.blocks.map((block) =>
                sanitizeBlock(block, block, nextSettings, state.boundary)
              ),
              walls: state.walls.map((wall) =>
                sanitizeWall(wall, wall, nextSettings, state.boundary)
              ),
            };
          },
          false,
          "planner/setSettings"
        );
      },

      addBlock: (blockInput) => {
        set(
          (state) => {
            const id = uid();

            const sanitized = sanitizeBlock(
              { ...blockInput, id },
              null,
              state.settings,
              state.boundary
            );

            const placed = findInitialPlacement(
              sanitized,
              state.blocks,
              state.settings,
              state.boundary
            );

            return {
              blocks: [...state.blocks, placed],
              selected: { type: "block", id: placed.id } as const,
            };
          },
          false,
          "planner/addBlock"
        );
      },

      updateBlock: (id, patch) => {
        set(
          (state) => {
            const exists = state.blocks.find((b) => b.id === id);
            if (!exists) return state;

            return {
              blocks: state.blocks.map((block) =>
                block.id === id
                  ? sanitizeBlock(
                      { ...patch, id },
                      block,
                      state.settings,
                      state.boundary
                    )
                  : block
              ),
            };
          },
          false,
          "planner/updateBlock"
        );
      },

      moveBlock: (id, xM, yM) => {
        set(
          (state) => {
            const exists = state.blocks.find((b) => b.id === id);
            if (!exists) return state;

            return {
              blocks: state.blocks.map((block) =>
                block.id === id
                  ? sanitizeBlock(
                      { id, xM, yM },
                      block,
                      state.settings,
                      state.boundary
                    )
                  : block
              ),
            };
          },
          false,
          "planner/moveBlock"
        );
      },

      deleteBlock: (id) => {
        set(
          (state) => ({
            blocks: state.blocks.filter((b) => b.id !== id),
            selected:
              state.selected?.type === "block" && state.selected.id === id
                ? null
                : state.selected,
            previewBlocks: state.previewBlocks?.filter((b) => b.id !== id) ?? null,
          }),
          false,
          "planner/deleteBlock"
        );
      },

      addWall: (wallInput) => {
        set(
          (state) => {
            const id = uid();
            const wall = sanitizeWall(
              { ...wallInput, id },
              null,
              state.settings,
              state.boundary
            );

            return {
              walls: [...state.walls, wall],
              selected: { type: "wall", id: wall.id } as const,
            };
          },
          false,
          "planner/addWall"
        );
      },

      updateWall: (id, patch) => {
        set(
          (state) => {
            const exists = state.walls.find((w) => w.id === id);
            if (!exists) return state;

            return {
              walls: state.walls.map((wall) =>
                wall.id === id
                  ? sanitizeWall(
                      { ...patch, id },
                      wall,
                      state.settings,
                      state.boundary
                    )
                  : wall
              ),
            };
          },
          false,
          "planner/updateWall"
        );
      },

      moveWall: (id, xM, yM) => {
        set(
          (state) => {
            const exists = state.walls.find((w) => w.id === id);
            if (!exists) return state;

            return {
              walls: state.walls.map((wall) =>
                wall.id === id
                  ? sanitizeWall(
                      { id, xM, yM },
                      wall,
                      state.settings,
                      state.boundary
                    )
                  : wall
              ),
            };
          },
          false,
          "planner/moveWall"
        );
      },

      deleteWall: (id) => {
        set(
          (state) => ({
            walls: state.walls.filter((w) => w.id !== id),
            selected:
              state.selected?.type === "wall" && state.selected.id === id
                ? null
                : state.selected,
          }),
          false,
          "planner/deleteWall"
        );
      },

      setSelected: (selected) => {
        set({ selected }, false, "planner/setSelected");
      },

      addFiles: async (fs) => {
        const entries: FileRef[] = fs.map((file) => ({
          id: uid(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }));

        set(
          (state) => ({
            files: [...state.files, ...entries],
          }),
          false,
          "planner/addFiles"
        );
      },

      setCamera: (patch) => {
        set(
          (state) => ({
            camera: sanitizeCamera(state.camera, patch),
          }),
          false,
          "planner/setCamera"
        );
      },

      reset: () => {
        revokeFileUrls(get().files);

        set(
          {
            settings: DEFAULT_SETTINGS,
            boundary: null,
            files: [],
            blocks: [],
            walls: [],
            selected: null,
            camera: DEFAULT_CAMERA,
            aiSolutions: [],
            showAIModal: false,
            previewBlocks: null,
          },
          false,
          "planner/reset"
        );
      },

      setAISolutions: (solutions) => {
        const safeSolutions: AISolution[] = Array.isArray(solutions)
          ? solutions.map((sol) => ({
              score: Number.isFinite(sol?.score) ? round(sol.score) : 0,
              blocks: Array.isArray(sol?.blocks)
                ? sol.blocks
                    .filter((b) => b && typeof b.id === "string")
                    .map((b) => ({
                      id: b.id,
                      xM: Number.isFinite(b.xM) ? round(b.xM) : 0,
                      yM: Number.isFinite(b.yM) ? round(b.yM) : 0,
                      rotationDeg: normalizeRotation(
                        Number.isFinite(b.rotationDeg) ? b.rotationDeg : 0
                      ),
                    }))
                : [],
            }))
          : [];

        set({ aiSolutions: safeSolutions }, false, "planner/setAISolutions");
      },

      setAIModal: (open) => {
        set({ showAIModal: Boolean(open) }, false, "planner/setAIModal");
      },

      applyAISolution: (index) => {
        set(
          (state) => {
            const solution = state.aiSolutions[index];
            if (!solution) return state;

            return {
              blocks: state.blocks.map((block) => {
                const move = solution.blocks.find((entry) => entry.id === block.id);
                if (!move) return block;

                return sanitizeBlock(
                  {
                    id: block.id,
                    xM: move.xM,
                    yM: move.yM,
                    rotationDeg: move.rotationDeg,
                  },
                  block,
                  state.settings,
                  state.boundary
                );
              }),
              previewBlocks: null,
              showAIModal: false,
            };
          },
          false,
          "planner/applyAISolution"
        );
      },

      setPreviewBlocks: (preview) => {
        const blocks = get().blocks;
        const settings = get().settings;
        const boundary = get().boundary;

        const nextPreview =
          preview && Array.isArray(preview)
            ? preview
                .filter((p) => typeof p.id === "string")
                .map((p) => {
                  const original = blocks.find((b) => b.id === p.id);

                  if (!original) {
                    return {
                      id: p.id,
                      xM: Number.isFinite(p.xM) ? round(p.xM) : 0,
                      yM: Number.isFinite(p.yM) ? round(p.yM) : 0,
                      rotationDeg: normalizeRotation(
                        Number.isFinite(p.rotationDeg) ? p.rotationDeg : 0
                      ),
                    };
                  }

                  const safe = sanitizeBlock(
                    {
                      id: original.id,
                      xM: p.xM,
                      yM: p.yM,
                      rotationDeg: p.rotationDeg,
                    },
                    original,
                    settings,
                    boundary
                  );

                  return {
                    id: safe.id,
                    xM: safe.xM,
                    yM: safe.yM,
                    rotationDeg: safe.rotationDeg,
                  };
                })
            : null;

        set({ previewBlocks: nextPreview }, false, "planner/setPreviewBlocks");
      },
    }),
    { name: "planner-store" }
  )
);