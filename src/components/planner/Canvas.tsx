"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";

import { Stage, Layer, Group, Rect, Line } from "react-konva";

import { usePlanner } from "@/store/planner";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function PlannerCanvas() {

  const {

    settings,

    boundary,

    blocks,

    previewBlocks,

    camera,

    setCamera,

    selectedId,

    setSelected,

    moveBlock,

  } = usePlanner();

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {

    const el = wrapRef.current;

    if (!el) return;

    const obs = new ResizeObserver(() => {

      setSize({ w: el.clientWidth, h: el.clientHeight });

    });

    obs.observe(el);

    setSize({ w: el.clientWidth, h: el.clientHeight });

    return () => obs.disconnect();

  }, []);

  const scale = settings.scalePxPerM;

  // Grid

  const gridLines = useMemo(() => {

    const lines: JSX.Element[] = [];

    const stepM = settings.snapM > 0 ? settings.snapM : 0.5;

    const stepPx = stepM * scale;

    const ext = 3 * Math.max(size.w, size.h);

    for (let x = -ext; x <= ext; x += stepPx) {

      lines.push(
<Line key={`vx-${x}`} points={[x, -ext, x, ext]} stroke="#27272a" strokeWidth={1} />

      );

    }

    for (let y = -ext; y <= ext; y += stepPx) {

      lines.push(
<Line key={`hz-${y}`} points={[-ext, y, ext, y]} stroke="#27272a" strokeWidth={1} />

      );

    }

    return lines;

  }, [size, scale, settings.snapM]);

  // Stage Zoom

  const onWheel = (e: any) => {

    e.evt.preventDefault();

    const stage = e.target.getStage();

    const oldScale = camera.scale;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {

      x: (pointer.x - camera.x) / oldScale,

      y: (pointer.y - camera.y) / oldScale,

    };

    const scaleBy = 1.05;

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const newPos = {

      x: pointer.x - mousePointTo.x * newScale,

      y: pointer.y - mousePointTo.y * newScale,

    };

    setCamera({ scale: newScale, x: newPos.x, y: newPos.y });

  };

  // Stage Panning (nur wenn nichts gezogen wird!)

  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: any) => {

    const stage = e.target.getStage();

    if (stage.isDragging()) return; // Block-Drag hat Priorität

    if (e.target === stage) {

      setSelected(null);

      const pos = stage.getPointerPosition();

      dragStart.current = { x: pos.x - camera.x, y: pos.y - camera.y };

      stage.container().style.cursor = "grabbing";

    }

  };

  const onMouseMove = (e: any) => {

    const stage = e.target.getStage();

    if (stage.isDragging()) return; // nicht pannen, wenn Node dragged

    if (!dragStart.current) return;

    const pos = stage.getPointerPosition();

    setCamera({ x: pos.x - dragStart.current.x, y: pos.y - dragStart.current.y });

  };

  const onMouseUp = (e: any) => {

    dragStart.current = null;

    const stage = e.target.getStage();

    stage.container().style.cursor = "default";

  };

  // Snap

  const snapM = settings.snapM > 0 ? settings.snapM : 0.5;

  const snap = (vM: number) => Math.round(vM / snapM) * snapM;

  // Drag-Bounds für Block (Mittelpunkt beachten)

  const dragBoundFor = (wM: number, dM: number) => (pos: { x: number; y: number }) => {

    if (!boundary) return pos;

    const xM = pos.x / scale;

    const yM = pos.y / scale;

    const minX = -boundary.widthM / 2 + wM / 2;

    const maxX = boundary.widthM / 2 - wM / 2;

    const minY = -boundary.depthM / 2 + dM / 2;

    const maxY = boundary.depthM / 2 - dM / 2;

    const clampedXM = clamp(xM, minX, maxX);

    const clampedYM = clamp(yM, minY, maxY);

    return { x: clampedXM * scale, y: clampedYM * scale };

  };

  // Block-Handlers

  const handleSelect = (id: string) => setSelected(id);

  const handleDragStart = (e: any) => {

    const stage = e.target.getStage();

    stage.container().style.cursor = "grabbing";

  };

  const handleDragEnd = (id: string, wM: number, dM: number, e: any) => {

    const stage = e.target.getStage();

    let xM = e.target.x() / scale;

    let yM = e.target.y() / scale;

    // Snap

    xM = snap(xM);

    yM = snap(yM);

    // In Hülle halten

    if (boundary) {

      const minX = -boundary.widthM / 2 + wM / 2;

      const maxX = boundary.widthM / 2 - wM / 2;

      const minY = -boundary.depthM / 2 + dM / 2;

      const maxY = boundary.depthM / 2 - dM / 2;

      xM = clamp(xM, minX, maxX);

      yM = clamp(yM, minY, maxY);

    }

    // Zustand aktualisieren

    moveBlock(id, xM, yM);

    // Node sofort auf die gesnappte Pixel-Position setzen

    e.target.position({ x: xM * scale, y: yM * scale });

    // Drag sauber beenden + Cursor zurück

    e.target.stopDrag();

    stage.container().style.cursor = "grab";

  };

  return (
<div

      ref={wrapRef}

      className="w-full h-[90vh] rounded-xl border border-zinc-800 overflow-hidden bg-black"
>
<Stage

        width={size.w}

        height={size.h}

        onWheel={onWheel}

        onMouseDown={onMouseDown}

        onMouseMove={onMouseMove}

        onMouseUp={onMouseUp}
>
<Layer x={camera.x} y={camera.y} scaleX={camera.scale} scaleY={camera.scale}>

          {/* Grid */}
<Group listening={false}>{gridLines}</Group>

          {/* Hülle */}

          {boundary && (
<Group listening={false}>
<Rect

                x={-(boundary.widthM * scale) / 2}

                y={-(boundary.depthM * scale) / 2}

                width={boundary.widthM * scale}

                height={boundary.depthM * scale}

                fill="#0a0a0a"

                stroke="#3f3f46"

                strokeWidth={2}

              />
</Group>

          )}

          {/* Blöcke */}
<Group>

            {blocks.map((b) => {

              const wPx = b.wM * scale;

              const dPx = b.dM * scale;

              const xPx = b.xM * scale;

              const yPx = b.yM * scale;

              const isSel = b.id === selectedId;

              return (
<Group

                  key={b.id}

                  x={xPx}

                  y={yPx}

                  rotation={b.rotationDeg}

                  offsetX={wPx / 2}

                  offsetY={dPx / 2}

                  draggable

                  dragBoundFunc={dragBoundFor(b.wM, b.dM)}

                  onClick={() => handleSelect(b.id)}

                  onTap={() => handleSelect(b.id)}

                  onDragStart={handleDragStart}

                  onDragEnd={(e) => handleDragEnd(b.id, b.wM, b.dM, e)}

                  onMouseEnter={(e) => {

                    const c = e.target.getStage()?.container();

                    if (c) c.style.cursor = "grab";

                  }}

                  onMouseLeave={(e) => {

                    const c = e.target.getStage()?.container();

                    if (c && !e.target.getStage()?.isDragging()) c.style.cursor = "default";

                  }}
>
<Rect

                    width={wPx}

                    height={dPx}

                    cornerRadius={4}

                    fill={b.color || "#999"}

                    stroke={isSel ? "#ef4444" : "#18181b"}

                    strokeWidth={isSel ? 2 : 1}

                    shadowForStrokeEnabled={false}

                  />
</Group>

              );

            })}
</Group>

          {/* KI-Preview */}

          {previewBlocks && previewBlocks.length > 0 && (
<Group opacity={0.5} listening={false}>

              {previewBlocks.map((pb) => {

                const orig = blocks.find((x) => x.id === pb.id);

                if (!orig) return null;

                const wPx = orig.wM * scale;

                const dPx = orig.dM * scale;

                const xPx = pb.xM * scale;

                const yPx = pb.yM * scale;

                return (
<Group

                    key={`preview-${pb.id}`}

                    x={xPx}

                    y={yPx}

                    rotation={pb.rotationDeg}

                    offsetX={wPx / 2}

                    offsetY={dPx / 2}
>
<Rect

                      width={wPx}

                      height={dPx}

                      cornerRadius={4}

                      fill={orig.color || "#888"}

                      opacity={0.35}

                      stroke="#ef4444"

                      strokeWidth={2}

                      dash={[6, 4]}

                    />
</Group>

                );

              })}
</Group>

          )}
</Layer>
</Stage>
</div>

  );

}
 