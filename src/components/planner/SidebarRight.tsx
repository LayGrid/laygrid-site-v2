"use client";

import { useMemo } from "react";
import { usePlanner, type WallOrientation } from "@/store/planner";
import { normalizeRotation } from "@/lib/plannerGeometry";

export default function SidebarRight() {
  const {
    blocks,
    walls,
    selected,
    updateBlock,
    deleteBlock,
    updateWall,
    deleteWall,
    settings,
    boundary,
  } = usePlanner();

  const block = useMemo(() => {
    if (selected?.type !== "block") return null;
    return blocks.find((x) => x.id === selected.id) || null;
  }, [blocks, selected]);

  const wall = useMemo(() => {
    if (selected?.type !== "wall") return null;
    return walls.find((x) => x.id === selected.id) || null;
  }, [walls, selected]);

  const setBlockNumberField = (
    key: "wM" | "dM" | "hM" | "xM" | "yM" | "rotationDeg",
    raw: string
  ) => {
    if (!block) return;
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return;
    updateBlock(block.id, { [key]: value });
  };

  const setWallNumberField = (
    key: "lengthM" | "thicknessM" | "xM" | "yM",
    raw: string
  ) => {
    if (!wall) return;
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return;
    updateWall(wall.id, { [key]: value });
  };

  if (!selected || (!block && !wall)) {
    return (
      <aside className="h-full w-full overflow-y-auto bg-black p-4 text-sm text-zinc-400">
        Nichts ausgewählt
      </aside>
    );
  }

  if (block) {
    const rotationLocked = block.meta?.rotationAllowed === false;

    return (
      <aside className="h-full w-full overflow-y-auto bg-black p-4 text-sm">
        <div className="text-zinc-300 font-semibold mb-3">Block-Eigenschaften</div>

        <div className="grid gap-3">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Name</label>
            <input
              className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={block.name}
              onChange={(e) => updateBlock(block.id, { name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-zinc-400">
              B (m)
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
                value={block.wM}
                onChange={(e) => setBlockNumberField("wM", e.target.value)}
              />
            </label>

            <label className="text-xs text-zinc-400">
              T (m)
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
                value={block.dM}
                onChange={(e) => setBlockNumberField("dM", e.target.value)}
              />
            </label>

            <label className="text-xs text-zinc-400">
              H (m)
              <input
                type="number"
                min="0"
                step="0.1"
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
                value={block.hM ?? 0}
                onChange={(e) => setBlockNumberField("hM", e.target.value)}
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs text-zinc-400">
              X (m)
              <input
                type="number"
                step={settings.snapM}
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
                value={block.xM}
                onChange={(e) => setBlockNumberField("xM", e.target.value)}
              />
            </label>

            <label className="text-xs text-zinc-400">
              Y (m)
              <input
                type="number"
                step={settings.snapM}
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
                value={block.yM}
                onChange={(e) => setBlockNumberField("yM", e.target.value)}
              />
            </label>

            <label className="text-xs text-zinc-400">
              Rot (°)
              <input
                type="number"
                step="1"
                disabled={rotationLocked}
                className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 disabled:opacity-50"
                value={normalizeRotation(block.rotationDeg)}
                onChange={(e) =>
                  setBlockNumberField("rotationDeg", e.target.value)
                }
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Farbe</span>
            <input
              type="color"
              value={block.color}
              onChange={(e) => updateBlock(block.id, { color: e.target.value })}
            />

            <button
              onClick={() => updateBlock(block.id, { rotationDeg: 0 })}
              disabled={rotationLocked}
              className="ml-auto rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-900 disabled:opacity-50"
            >
              Rotation 0°
            </button>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-400 space-y-1">
            <div>Typ: Block</div>
            <div>ID: {block.id}</div>
            <div>
              Position: {block.xM} / {block.yM} m
            </div>
            <div>
              Grösse: {block.wM} × {block.dM}
              {typeof block.hM === "number" ? ` × ${block.hM}` : ""} m
            </div>
            <div>Rotation: {normalizeRotation(block.rotationDeg)}°</div>
            <div>
              Boundary:{" "}
              {boundary
                ? `${boundary.widthM} × ${boundary.depthM} m`
                : "keine gesetzt"}
            </div>
            <div>Snap: {settings.snapM} m</div>
          </div>

          <button
            onClick={() => deleteBlock(block.id)}
            className="mt-1 rounded border border-red-600 text-red-400 px-3 py-1 hover:bg-red-900/20"
          >
            Block löschen
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-full overflow-y-auto bg-black p-4 text-sm">
      <div className="text-zinc-300 font-semibold mb-3">Wand-Eigenschaften</div>

      <div className="grid gap-3">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Name</label>
          <input
            className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
            value={wall!.name}
            onChange={(e) => updateWall(wall!.id, { name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-zinc-400">
            Länge (m)
            <input
              type="number"
              min="0.1"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={wall!.lengthM}
              onChange={(e) => setWallNumberField("lengthM", e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Dicke (m)
            <input
              type="number"
              min="0.05"
              step="0.05"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={wall!.thicknessM}
              onChange={(e) =>
                setWallNumberField("thicknessM", e.target.value)
              }
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-zinc-400">
            X (m)
            <input
              type="number"
              step={settings.snapM}
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={wall!.xM}
              onChange={(e) => setWallNumberField("xM", e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Y (m)
            <input
              type="number"
              step={settings.snapM}
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={wall!.yM}
              onChange={(e) => setWallNumberField("yM", e.target.value)}
            />
          </label>
        </div>

        <label className="text-xs text-zinc-400">
          Ausrichtung
          <select
            className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1"
            value={wall!.orientation}
            onChange={(e) =>
              updateWall(wall!.id, {
                orientation: e.target.value as WallOrientation,
              })
            }
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertikal</option>
          </select>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Farbe</span>
          <input
            type="color"
            value={wall!.color}
            onChange={(e) => updateWall(wall!.id, { color: e.target.value })}
          />
        </div>

        <div className="h-px bg-zinc-800" />

        <div className="rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-400 space-y-1">
          <div>Typ: Wand</div>
          <div>ID: {wall!.id}</div>
          <div>
            Position: {wall!.xM} / {wall!.yM} m
          </div>
          <div>
            Länge: {wall!.lengthM} m · Dicke: {wall!.thicknessM} m
          </div>
          <div>Ausrichtung: {wall!.orientation}</div>
          <div>
            Boundary:{" "}
            {boundary
              ? `${boundary.widthM} × ${boundary.depthM} m`
              : "keine gesetzt"}
          </div>
          <div>Snap: {settings.snapM} m</div>
        </div>

        <button
          onClick={() => deleteWall(wall!.id)}
          className="mt-1 rounded border border-red-600 text-red-400 px-3 py-1 hover:bg-red-900/20"
        >
          Wand löschen
        </button>
      </div>
    </aside>
  );
}