"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import { usePlanner } from "@/store/planner";
import {
  clampBlockCenterToBoundary,
  clampWallCenterToBoundary,
  getRotatedFootprint,
  getWallFootprint,
  normalizeRotation,
  snapValue,
} from "@/lib/plannerGeometry";

export default function PlannerCanvas() {
  const {
    settings,
    boundary,
    blocks,
    walls,
    previewBlocks,
    camera,
    setCamera,
    selected,
    setSelected,
    moveBlock,
    moveWall,
  } = usePlanner();

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const centeredBoundaryRef = useRef<string | null>(null);
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

useEffect(() => {
  if (!boundary) {
    centeredBoundaryRef.current = null;
    return;
  }

  if (size.w <= 0 || size.h <= 0) return;

  const boundaryKey = `${boundary.widthM}x${boundary.depthM}`;

  if (centeredBoundaryRef.current === boundaryKey) return;

  setCamera({
    x: size.w / 2,
    y: size.h / 2,
    scale: 1,
  });

  centeredBoundaryRef.current = boundaryKey;
}, [boundary, size.w, size.h, setCamera]);

  const scalePxPerM = settings.scalePxPerM;
  const snapM = settings.snapM > 0 ? settings.snapM : 0.5;

  const blockById = useMemo(() => {
    return new Map(blocks.map((b) => [b.id, b]));
  }, [blocks]);

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const stepPx = snapM * scalePxPerM;
    const ext = 3 * Math.max(size.w, size.h);

    for (let x = -ext; x <= ext; x += stepPx) {
      lines.push(
        <Line
          key={`vx-${x}`}
          points={[x, -ext, x, ext]}
          stroke="#27272a"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    for (let y = -ext; y <= ext; y += stepPx) {
      lines.push(
        <Line
          key={`hz-${y}`}
          points={[-ext, y, ext, y]}
          stroke="#27272a"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    return lines;
  }, [size, scalePxPerM, snapM]);

  const setCursor = (cursor: string) => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.cursor = cursor;
  };

  const onWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const oldScale = camera.scale;
    const scaleBy = 1.05;
    const nextScale =
      e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const mousePointTo = {
      x: (pointer.x - camera.x) / oldScale,
      y: (pointer.y - camera.y) / oldScale,
    };

    setCamera({
      scale: nextScale,
      x: pointer.x - mousePointTo.x * nextScale,
      y: pointer.y - mousePointTo.y * nextScale,
    });
  };

  const onMouseDown = (e: any) => {
    const stage = e.target.getStage();
    if (!stage) return;

    if (e.target === stage) {
      setSelected(null);

      const pos = stage.getPointerPosition();
      if (!pos) return;

      dragStartRef.current = {
        x: pos.x - camera.x,
        y: pos.y - camera.y,
      };

      setCursor("grabbing");
    }
  };

  const onMouseMove = (e: any) => {
    const stage = e.target.getStage();
    if (!stage || !dragStartRef.current) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setCamera({
      x: pos.x - dragStartRef.current.x,
      y: pos.y - dragStartRef.current.y,
    });
  };

  const onMouseUp = () => {
    dragStartRef.current = null;
    setCursor("default");
  };

  const dragBoundForBlock =
    (wM: number, dM: number, rotationDeg: number) =>
    (pos: { x: number; y: number }) => {
      if (!boundary || !settings.enforceBoundary) return pos;

      const xM = pos.x / scalePxPerM;
      const yM = pos.y / scalePxPerM;

      const clamped = clampBlockCenterToBoundary(
        { xM, yM },
        { wM, dM, rotationDeg },
        boundary
      );

      return {
        x: clamped.xM * scalePxPerM,
        y: clamped.yM * scalePxPerM,
      };
    };

  const dragBoundForWall =
    (
      lengthM: number,
      thicknessM: number,
      orientation: "horizontal" | "vertical"
    ) =>
    (pos: { x: number; y: number }) => {
      if (!boundary || !settings.enforceBoundary) return pos;

      const xM = pos.x / scalePxPerM;
      const yM = pos.y / scalePxPerM;

      const clamped = clampWallCenterToBoundary(
        { xM, yM },
        { lengthM, thicknessM, orientation },
        boundary
      );

      return {
        x: clamped.xM * scalePxPerM,
        y: clamped.yM * scalePxPerM,
      };
    };

  const handleDragStart = () => {
    setCursor("grabbing");
  };

  const handleBlockDragEnd = (
    id: string,
    wM: number,
    dM: number,
    rotationDeg: number,
    e: any
  ) => {
    let xM = e.target.x() / scalePxPerM;
    let yM = e.target.y() / scalePxPerM;

    xM = snapValue(xM, snapM);
    yM = snapValue(yM, snapM);

    if (boundary && settings.enforceBoundary) {
      const clamped = clampBlockCenterToBoundary(
        { xM, yM },
        { wM, dM, rotationDeg },
        boundary
      );

      xM = clamped.xM;
      yM = clamped.yM;
    }

    moveBlock(id, xM, yM);

    e.target.position({
      x: xM * scalePxPerM,
      y: yM * scalePxPerM,
    });

    setCursor("grab");
  };

  const handleWallDragEnd = (
    id: string,
    lengthM: number,
    thicknessM: number,
    orientation: "horizontal" | "vertical",
    e: any
  ) => {
    let xM = e.target.x() / scalePxPerM;
    let yM = e.target.y() / scalePxPerM;

    xM = snapValue(xM, snapM);
    yM = snapValue(yM, snapM);

    if (boundary && settings.enforceBoundary) {
      const clamped = clampWallCenterToBoundary(
        { xM, yM },
        { lengthM, thicknessM, orientation },
        boundary
      );

      xM = clamped.xM;
      yM = clamped.yM;
    }

    moveWall(id, xM, yM);

    e.target.position({
      x: xM * scalePxPerM,
      y: yM * scalePxPerM,
    });

    setCursor("grab");
  };

  return (
    <div
      ref={wrapRef}
      className="w-full h-full overflow-hidden bg-black"
    >
      <Stage
        width={size.w}
        height={size.h}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Layer
          x={camera.x}
          y={camera.y}
          scaleX={camera.scale}
          scaleY={camera.scale}
        >
          <Group listening={false}>{gridLines}</Group>

          {boundary && (
            <Group listening={false}>
              <Rect
                x={-(boundary.widthM * scalePxPerM) / 2}
                y={-(boundary.depthM * scalePxPerM) / 2}
                width={boundary.widthM * scalePxPerM}
                height={boundary.depthM * scalePxPerM}
                fill="#0a0a0a"
                stroke="#3f3f46"
                strokeWidth={2}
              />
            </Group>
          )}

          <Group>
            {walls.map((wall) => {
              const footprint = getWallFootprint({
                lengthM: wall.lengthM,
                thicknessM: wall.thicknessM,
                orientation: wall.orientation,
              });

              const widthPx = footprint.widthM * scalePxPerM;
              const heightPx = footprint.depthM * scalePxPerM;
              const xPx = wall.xM * scalePxPerM;
              const yPx = wall.yM * scalePxPerM;
              const isSelected =
                selected?.type === "wall" && selected.id === wall.id;

              return (
                <Group
                  key={wall.id}
                  x={xPx}
                  y={yPx}
                  offsetX={widthPx / 2}
                  offsetY={heightPx / 2}
                  draggable
                  dragBoundFunc={dragBoundForWall(
                    wall.lengthM,
                    wall.thicknessM,
                    wall.orientation
                  )}
                  onClick={() => setSelected({ type: "wall", id: wall.id })}
                  onTap={() => setSelected({ type: "wall", id: wall.id })}
                  onDragStart={handleDragStart}
                  onDragEnd={(e) =>
                    handleWallDragEnd(
                      wall.id,
                      wall.lengthM,
                      wall.thicknessM,
                      wall.orientation,
                      e
                    )
                  }
                  onMouseEnter={() => setCursor("grab")}
                  onMouseLeave={() => {
                    if (!dragStartRef.current) setCursor("default");
                  }}
                >
                  <Rect
                    width={widthPx}
                    height={heightPx}
                    cornerRadius={2}
                    fill={wall.color}
                    opacity={0.95}
                    stroke={isSelected ? "#ef4444" : "#3f3f46"}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                </Group>
              );
            })}
          </Group>

          <Group>
            {blocks.map((b) => {
              const wPx = b.wM * scalePxPerM;
              const dPx = b.dM * scalePxPerM;
              const xPx = b.xM * scalePxPerM;
              const yPx = b.yM * scalePxPerM;
              const isSelected =
                selected?.type === "block" && selected.id === b.id;
              const footprint = getRotatedFootprint({
                wM: b.wM,
                dM: b.dM,
                rotationDeg: b.rotationDeg,
              });

              return (
                <Group
                  key={b.id}
                  x={xPx}
                  y={yPx}
                  rotation={b.rotationDeg}
                  offsetX={wPx / 2}
                  offsetY={dPx / 2}
                  draggable
                  dragBoundFunc={dragBoundForBlock(b.wM, b.dM, b.rotationDeg)}
                  onClick={() => setSelected({ type: "block", id: b.id })}
                  onTap={() => setSelected({ type: "block", id: b.id })}
                  onDragStart={handleDragStart}
                  onDragEnd={(e) =>
                    handleBlockDragEnd(b.id, b.wM, b.dM, b.rotationDeg, e)
                  }
                  onMouseEnter={() => setCursor("grab")}
                  onMouseLeave={() => {
                    if (!dragStartRef.current) setCursor("default");
                  }}
                >
                  <Rect
                    width={wPx}
                    height={dPx}
                    cornerRadius={4}
                    fill={b.color || "#999"}
                    stroke={isSelected ? "#ef4444" : "#18181b"}
                    strokeWidth={isSelected ? 2 : 1}
                    shadowForStrokeEnabled={false}
                  />

                  {isSelected && (
                    <Rect
                      x={-(footprint.widthM * scalePxPerM - wPx) / 2}
                      y={-(footprint.depthM * scalePxPerM - dPx) / 2}
                      width={footprint.widthM * scalePxPerM}
                      height={footprint.depthM * scalePxPerM}
                      stroke="#52525b"
                      strokeWidth={1}
                      dash={[4, 4]}
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}
          </Group>

          {previewBlocks && previewBlocks.length > 0 && (
            <Group opacity={0.5} listening={false}>
              {previewBlocks.map((pb) => {
                const orig = blockById.get(pb.id);
                if (!orig) return null;

                const wPx = orig.wM * scalePxPerM;
                const dPx = orig.dM * scalePxPerM;
                const xPx = pb.xM * scalePxPerM;
                const yPx = pb.yM * scalePxPerM;
                const rotationDeg = normalizeRotation(pb.rotationDeg);

                return (
                  <Group
                    key={`preview-${pb.id}`}
                    x={xPx}
                    y={yPx}
                    rotation={rotationDeg}
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