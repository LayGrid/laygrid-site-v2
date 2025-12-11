"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

type Item = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

const M_PER_PX = 1 / 100;  // 100 px = 1 m
const SNAP_PX = 50;        // 0.5 m Raster
const snap = (n: number) => Math.round(n / SNAP_PX) * SNAP_PX;

export default function RoomPlanner() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragging = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const addItem = (w: number, h: number, label: string) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2);
    setItems(prev => [
      ...prev,
      { id, x: snap(100 + prev.length * 20), y: snap(100), w, h, label },
    ]);
    setSelectedId(id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems(prev => prev.filter(i => i.id !== selectedId));
    setSelectedId(null);
  };

  const gridLines = useMemo(() => {
    const W = 1200, H = 700;
    const lines: React.ReactNode[] = [];
    for (let x = 0; x <= W; x += SNAP_PX)
      lines.push(<line key={"vx" + x} x1={x} y1={0} x2={x} y2={H} stroke="#eee" />);
    for (let y = 0; y <= H; y += SNAP_PX)
      lines.push(<line key={"hz" + y} x1={0} y1={y} x2={W} y2={y} stroke="#eee" />);
    return lines;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGRectElement>, id: string) => {
      const svg = e.currentTarget.ownerSVGElement as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = pt.matrixTransform(ctm.inverse());
      const item = items.find(i => i.id === id);
      if (!item) return;
      dragging.current = { id, dx: p.x - item.x, dy: p.y - item.y };
      setSelectedId(id);
      (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    },
    [items]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = pt.matrixTransform(ctm.inverse());
    const { id, dx, dy } = dragging.current;
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, x: snap(p.x - dx), y: snap(p.y - dy) } : it
      )
    );
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const W = 1200, H = 700;

  return (
    <div className="grid gap-4 md:grid-cols-[280px,1fr]">
      <aside className="rounded-xl border p-4 grid gap-3 h-fit">
        <div className="font-semibold">Bausteine</div>
        <button className="rounded-lg border px-3 py-2" onClick={() => addItem(200, 100, "Maschine 2×1 m")}>Maschine 2×1 m</button>
        <button className="rounded-lg border px-3 py-2" onClick={() => addItem(100, 100, "Palette 1×1 m")}>Palette 1×1 m</button>
        <button className="rounded-lg border px-3 py-2" onClick={() => addItem(400, 100, "Wand 4×0.5 m")}>Wand 4×0.5 m</button>

        <div className="mt-4 font-semibold">Aktionen</div>
        <button disabled={!selectedId} className="rounded-lg border px-3 py-2 disabled:opacity-50" onClick={removeSelected}>
          Ausgewählten löschen
        </button>

        <div className="mt-4 text-sm text-gray-600">
          Maßstab: 1 m = 100 px<br />
          Snapping: 0.5 m
        </div>
      </aside>

      <div className="rounded-xl border overflow-hidden">
        <svg
          width="100%"
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <rect x={0} y={0} width={W} height={H} fill="#fff" />
          {gridLines}
          {items.map(it => (
            <g key={it.id}>
              <rect
                x={it.x}
                y={it.y}
                width={it.w}
                height={it.h}
                fill={selectedId === it.id ? "#3b82f6" : "#111"}
                opacity={0.9}
                onPointerDown={e => onPointerDown(e, it.id)}
                style={{ cursor: "move" }}
              />
              <text x={it.x + 6} y={it.y + 18} fontSize={12} fill="#fff">{it.label}</text>
              <text x={it.x + 6} y={it.y + it.h - 6} fontSize={10} fill="#fff">
                {(it.w * M_PER_PX).toFixed(1)}m × {(it.h * M_PER_PX).toFixed(1)}m
              </text>
            </g>
          ))}
          <rect x={0} y={0} width={W} height={H} fill="none" stroke="#ddd" strokeWidth={2} />
        </svg>
      </div>
    </div>
  );
}
