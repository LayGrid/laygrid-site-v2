"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { exportZip } from "@/lib/plannerExport";
import { usePlanner, type WallOrientation } from "@/store/planner";

type Props = {
  rightOpen?: boolean;
  onToggleRight?: () => void;
};

const LIBRARY_ITEMS = [
  {
    name: "Maschine 2×1",
    wM: 2,
    dM: 1,
    hM: 2,
    color: "#3b82f6",
  },
  {
    name: "Palette 1×1",
    wM: 1,
    dM: 1,
    hM: 0.2,
    color: "#f59e0b",
  },
  {
    name: "Arbeitstisch",
    wM: 1.5,
    dM: 0.8,
    hM: 0.9,
    color: "#22c55e",
  },
  {
    name: "Regal",
    wM: 2,
    dM: 0.6,
    hM: 2.2,
    color: "#a855f7",
  },
];

export default function Topbar({
  rightOpen = true,
  onToggleRight,
}: Props) {
  const {
    settings,
    setSettings,
    boundary,
    setBoundary,
    blocks,
    walls,
    files,
    setAISolutions,
    setAIModal,
    addBlock,
    addWall,
  } = usePlanner();

  const [boundaryWidth, setBoundaryWidth] = useState(
    boundary ? String(boundary.widthM) : "20"
  );
  const [boundaryDepth, setBoundaryDepth] = useState(
    boundary ? String(boundary.depthM) : "12"
  );

  const [blockName, setBlockName] = useState("Maschine");
  const [blockW, setBlockW] = useState("2");
  const [blockD, setBlockD] = useState("1");
  const [blockH, setBlockH] = useState("2");
  const [blockColor, setBlockColor] = useState("#22c55e");

  const [wallName, setWallName] = useState("Wand");
  const [wallLength, setWallLength] = useState("6");
  const [wallThickness, setWallThickness] = useState("0.2");
  const [wallOrientation, setWallOrientation] =
    useState<WallOrientation>("horizontal");
  const [wallColor, setWallColor] = useState("#71717a");

  useEffect(() => {
    if (boundary) {
      setBoundaryWidth(String(boundary.widthM));
      setBoundaryDepth(String(boundary.depthM));
    }
  }, [boundary]);

  const customBlockValid = useMemo(() => {
    const w = parseFloat(blockW);
    const d = parseFloat(blockD);
    const h = parseFloat(blockH);

    return (
      blockName.trim().length > 0 &&
      Number.isFinite(w) &&
      w > 0 &&
      Number.isFinite(d) &&
      d > 0 &&
      Number.isFinite(h) &&
      h >= 0
    );
  }, [blockName, blockW, blockD, blockH]);

  const customWallValid = useMemo(() => {
    const length = parseFloat(wallLength);
    const thickness = parseFloat(wallThickness);

    return (
      wallName.trim().length > 0 &&
      Number.isFinite(length) &&
      length > 0 &&
      Number.isFinite(thickness) &&
      thickness > 0
    );
  }, [wallName, wallLength, wallThickness]);

  const boundaryValid = useMemo(() => {
    const width = parseFloat(boundaryWidth);
    const depth = parseFloat(boundaryDepth);

    return (
      Number.isFinite(width) &&
      width > 0 &&
      Number.isFinite(depth) &&
      depth > 0
    );
  }, [boundaryWidth, boundaryDepth]);

  const exportAll = () => {
    const project = {
      settings,
      boundary,
      blocks,
      walls,
      files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    exportZip(project);
  };

  const applyBoundary = () => {
    const width = parseFloat(boundaryWidth);
    const depth = parseFloat(boundaryDepth);

    if (!Number.isFinite(width) || width <= 0) return;
    if (!Number.isFinite(depth) || depth <= 0) return;

    setBoundary({
      type: "rect",
      widthM: width,
      depthM: depth,
      locked: true,
    });
  };

  const runAI = async () => {
    try {
      const payload = {
        project: { settings, boundary, blocks, files },
        flows: [],
        constraints: {
          minClearanceM: 0.5,
          noGos: [],
          media: [],
          keepInsideBoundary: true,
          rotationAllowed: true,
        },
        preferences: {
          weightFlow: 50,
          weightPath: 10,
          weightClearance: 1000,
          weightMedia: 10,
          weightRotation: 1,
        },
        variants: 3,
        timeBudgetMs: 800,
      };

      const res = await fetch("/api/ai/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`AI request failed: ${res.status}`);
      }

      const data = await res.json();
      setAISolutions(data?.solutions || []);
      setAIModal(true);
    } catch (error) {
      console.error("Fehler bei KI-Vorschlägen:", error);
      setAISolutions([]);
      setAIModal(true);
    }
  };

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
    if (!customBlockValid) return;

    addBlock({
      name: blockName.trim(),
      wM: parseFloat(blockW),
      dM: parseFloat(blockD),
      hM: parseFloat(blockH),
      xM: 0,
      yM: 0,
      rotationDeg: 0,
      color: blockColor,
    });
  };

  const handleAddWall = () => {
    if (!customWallValid) return;

    addWall({
      name: wallName.trim(),
      xM: 0,
      yM: 0,
      lengthM: parseFloat(wallLength),
      thicknessM: parseFloat(wallThickness),
      orientation: wallOrientation,
      color: wallColor,
    });
  };

  return (
    <div className="border-b border-zinc-800 bg-black px-4 py-3">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-base font-semibold text-white">LayGrid Planer</div>

          <div className="text-xs text-zinc-500">
            Blöcke: {blocks.length} · Wände: {walls.length} · Dateien: {files.length}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleRight}
              className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
            >
              {rightOpen ? "Eigenschaften: an" : "Eigenschaften: aus"}
            </button>

            <button
              onClick={runAI}
              className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
            >
              KI-Vorschläge
            </button>

            <button
              onClick={exportAll}
              className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
            >
              Export ZIP
            </button>

            <Link
              href="/api/logout"
              className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
            >
              Abmelden
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-400">Projekt</div>

          <label className="text-xs text-zinc-400">
            Scale px/m
            <input
              type="number"
              min="10"
              max="500"
              step="10"
              className="ml-2 w-24 rounded border border-zinc-700 bg-black px-2 py-1"
              value={settings.scalePxPerM}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!Number.isFinite(value)) return;
                setSettings({ scalePxPerM: value });
              }}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Snap m
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              className="ml-2 w-24 rounded border border-zinc-700 bg-black px-2 py-1"
              value={settings.snapM}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!Number.isFinite(value)) return;
                setSettings({ snapM: value });
              }}
            />
          </label>

          <label className="text-xs text-zinc-400 flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enforceBoundary}
              onChange={(e) =>
                setSettings({ enforceBoundary: e.target.checked })
              }
            />
            Grenze erzwingen
          </label>

          <label className="text-xs text-zinc-400">
            Breite
            <input
              type="number"
              min="1"
              step="0.1"
              className="ml-2 w-20 rounded border border-zinc-700 bg-black px-2 py-1"
              value={boundaryWidth}
              onChange={(e) => setBoundaryWidth(e.target.value)}
            />
          </label>

          <label className="text-xs text-zinc-400">
            Tiefe
            <input
              type="number"
              min="1"
              step="0.1"
              className="ml-2 w-20 rounded border border-zinc-700 bg-black px-2 py-1"
              value={boundaryDepth}
              onChange={(e) => setBoundaryDepth(e.target.value)}
            />
          </label>

          <button
            onClick={applyBoundary}
            disabled={!boundaryValid}
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            Hülle setzen
          </button>

          <div className="text-xs text-zinc-500">
            {boundary
              ? `Aktuell: ${boundary.widthM} × ${boundary.depthM} m`
              : "Keine Hülle gesetzt"}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-400 mr-1">Standardblöcke</div>

          {LIBRARY_ITEMS.map((item) => (
            <button
              key={item.name}
              onClick={() => addLibraryBlock(item)}
              className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-zinc-800 pt-3">
          <div className="text-xs text-zinc-400">Eigener Block</div>

          <input
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            className="w-32 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="Name"
          />

          <input
            type="number"
            min="0.1"
            step="0.1"
            value={blockW}
            onChange={(e) => setBlockW(e.target.value)}
            className="w-20 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="B"
          />

          <input
            type="number"
            min="0.1"
            step="0.1"
            value={blockD}
            onChange={(e) => setBlockD(e.target.value)}
            className="w-20 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="T"
          />

          <input
            type="number"
            min="0"
            step="0.1"
            value={blockH}
            onChange={(e) => setBlockH(e.target.value)}
            className="w-20 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="H"
          />

          <input
            type="color"
            value={blockColor}
            onChange={(e) => setBlockColor(e.target.value)}
          />

          <button
            onClick={addCustomBlock}
            disabled={!customBlockValid}
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            Block hinzufügen
          </button>

          <div className="mx-2 h-6 w-px bg-zinc-800" />

          <div className="text-xs text-zinc-400">Wand</div>

          <input
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
            className="w-28 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="Wandname"
          />

          <input
            type="number"
            min="0.1"
            step="0.1"
            value={wallLength}
            onChange={(e) => setWallLength(e.target.value)}
            className="w-20 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="Länge"
          />

          <input
            type="number"
            min="0.05"
            step="0.05"
            value={wallThickness}
            onChange={(e) => setWallThickness(e.target.value)}
            className="w-20 rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
            placeholder="Dicke"
          />

          <select
            value={wallOrientation}
            onChange={(e) =>
              setWallOrientation(e.target.value as WallOrientation)
            }
            className="rounded border border-zinc-700 bg-black px-2 py-1 text-sm"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertikal</option>
          </select>

          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
          />

          <button
            onClick={handleAddWall}
            disabled={!customWallValid}
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900 disabled:opacity-50"
          >
            Wand hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}