"use client";

import { useMemo, useState } from "react";
import { usePlanner, type WallOrientation } from "@/store/planner";

const LIBRARY_ITEMS = [
  {
    name: "Maschine 2×1 m",
    wM: 2,
    dM: 1,
    hM: 2,
    color: "#3b82f6",
  },
  {
    name: "Palette 1×1 m",
    wM: 1,
    dM: 1,
    hM: 0.2,
    color: "#f59e0b",
  },
  {
    name: "Arbeitstisch 1.5×0.8 m",
    wM: 1.5,
    dM: 0.8,
    hM: 0.9,
    color: "#22c55e",
  },
  {
    name: "Regal 2×0.6 m",
    wM: 2,
    dM: 0.6,
    hM: 2.2,
    color: "#a855f7",
  },
];

export default function SidebarLeft() {
  const { addBlock, addWall, addFiles, files, settings, boundary, walls } =
    usePlanner();

  const [name, setName] = useState("Maschine");
  const [w, setW] = useState("2");
  const [d, setD] = useState("1");
  const [h, setH] = useState("2");
  const [color, setColor] = useState("#22c55e");

  const [wallName, setWallName] = useState("Wand");
  const [wallLength, setWallLength] = useState("6");
  const [wallThickness, setWallThickness] = useState("0.2");
  const [wallOrientation, setWallOrientation] =
    useState<WallOrientation>("horizontal");
  const [wallColor, setWallColor] = useState("#71717a");

  const parsed = useMemo(() => {
    const width = parseFloat(w);
    const depth = parseFloat(d);
    const height = parseFloat(h);

    return {
      width,
      depth,
      height,
      validWidth: Number.isFinite(width) && width > 0,
      validDepth: Number.isFinite(depth) && depth > 0,
      validHeight: Number.isFinite(height) && height >= 0,
    };
  }, [w, d, h]);

  const parsedWall = useMemo(() => {
    const length = parseFloat(wallLength);
    const thickness = parseFloat(wallThickness);

    return {
      length,
      thickness,
      validLength: Number.isFinite(length) && length > 0,
      validThickness: Number.isFinite(thickness) && thickness > 0,
    };
  }, [wallLength, wallThickness]);

  const canAddCustomBlock =
    name.trim().length > 0 &&
    parsed.validWidth &&
    parsed.validDepth &&
    parsed.validHeight;

  const canAddWall =
    wallName.trim().length > 0 &&
    parsedWall.validLength &&
    parsedWall.validThickness;

  const addLibraryBlock = (item: (typeof LIBRARY_ITEMS)[number]) => {
    addBlock({
      name: item.name,
      wM: item.wM,
      dM: item.dM,
      hM: item.hM,
      xM: 0,
      yM: 0,
      rotationDeg: 0,
      color: item.color,
    });
  };

  const addCustomBlock = () => {
    if (!canAddCustomBlock) return;

    addBlock({
      name: name.trim(),
      wM: parsed.width,
      dM: parsed.depth,
      hM: parsed.height,
      xM: 0,
      yM: 0,
      rotationDeg: 0,
      color,
    });
  };

  const handleAddWall = () => {
    if (!canAddWall) return;

    addWall({
      name: wallName.trim(),
      xM: 0,
      yM: 0,
      lengthM: parsedWall.length,
      thicknessM: parsedWall.thickness,
      orientation: wallOrientation,
      color: wallColor,
    });
  };

  return (
    <aside className="w-72 shrink-0 border border-zinc-800 rounded-xl p-3 bg-black overflow-y-auto max-h-[90vh]">
      <div className="text-sm text-zinc-300 font-semibold mb-2">Bibliothek</div>

      <div className="grid gap-2">
        {LIBRARY_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => addLibraryBlock(item)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900"
          >
            <div className="text-sm text-zinc-200">{item.name}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {item.wM} × {item.dM} × {item.hM} m
            </div>
          </button>
        ))}
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="text-sm text-zinc-300 font-semibold mb-2">
        Eigenen Block anlegen
      </div>

      <div className="grid gap-2 text-sm">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Name</label>
          <input
            className="w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs text-zinc-400">
            Breite
            <input
              type="number"
              min="0.1"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
              value={w}
              onChange={(e) => setW(e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Tiefe
            <input
              type="number"
              min="0.1"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
              value={d}
              onChange={(e) => setD(e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Höhe
            <input
              type="number"
              min="0"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
              value={h}
              onChange={(e) => setH(e.target.value)}
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Farbe</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <button
          onClick={addCustomBlock}
          disabled={!canAddCustomBlock}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900 disabled:opacity-50"
        >
          Block hinzufügen
        </button>
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="text-sm text-zinc-300 font-semibold mb-2">
        Wand hinzufügen
      </div>

      <div className="grid gap-2 text-sm">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Name</label>
          <input
            className="w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-zinc-400">
            Länge
            <input
              type="number"
              min="0.1"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
              value={wallLength}
              onChange={(e) => setWallLength(e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Dicke
            <input
              type="number"
              min="0.05"
              step="0.05"
              className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
              value={wallThickness}
              onChange={(e) => setWallThickness(e.target.value)}
            />
          </label>
        </div>

        <label className="text-xs text-zinc-400">
          Ausrichtung
          <select
            className="mt-1 w-full rounded border border-zinc-700 bg-black px-2 py-1 text-white"
            value={wallOrientation}
            onChange={(e) =>
              setWallOrientation(e.target.value as WallOrientation)
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
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddWall}
          disabled={!canAddWall}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900 disabled:opacity-50"
        >
          Wand hinzufügen
        </button>
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="text-sm text-zinc-300 font-semibold mb-2">
        Dateien (später für STEP etc.)
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          if (selectedFiles.length > 0) {
            void addFiles(selectedFiles);
          }
          e.currentTarget.value = "";
        }}
        className="text-sm text-zinc-300"
      />

      <ul className="mt-2 text-xs text-zinc-400 space-y-1 max-h-28 overflow-auto">
        {files.length === 0 ? (
          <li className="text-zinc-500">Noch keine Dateien geladen</li>
        ) : (
          files.map((file) => (
            <li key={file.id} className="truncate">
              {file.name}
            </li>
          ))
        )}
      </ul>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-500 space-y-1">
        <div>Massstab: {settings.scalePxPerM} px/m</div>
        <div>Snap: {settings.snapM} m</div>
        <div>
          Hülle:{" "}
          {boundary
            ? `${boundary.widthM} × ${boundary.depthM} m`
            : "noch nicht gesetzt"}
        </div>
        <div>Wände: {walls.length}</div>
      </div>
    </aside>
  );
}