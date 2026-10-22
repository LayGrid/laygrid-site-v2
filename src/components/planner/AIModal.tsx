"use client";

import { useEffect, useMemo } from "react";
import { usePlanner } from "@/store/planner";
import { normalizeRotation } from "@/lib/plannerGeometry";

type PreviewMove = {
  id: string;
  xM: number;
  yM: number;
  rotationDeg: number;
};

export default function AIModal() {
  const {
    aiSolutions,
    showAIModal,
    setAIModal,
    applyAISolution,
    boundary,
    blocks,
    setPreviewBlocks,
  } = usePlanner();

  const blockById = useMemo(() => {
    return new Map(blocks.map((block) => [block.id, block]));
  }, [blocks]);

  useEffect(() => {
    if (!showAIModal) {
      setPreviewBlocks(null);
    }
  }, [showAIModal, setPreviewBlocks]);

  if (!showAIModal) return null;

  const closeModal = () => {
    setPreviewBlocks(null);
    setAIModal(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={closeModal}
      />

      <div className="absolute left-1/2 top-14 -translate-x-1/2 w-[min(980px,calc(100vw-2rem))] rounded-xl border border-zinc-800 bg-black p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">KI-Vorschläge</h3>

          <button
            onClick={closeModal}
            className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-900"
          >
            Schliessen
          </button>
        </div>

        {!boundary ? (
          <div className="mt-6 text-sm text-zinc-400">
            Keine Hülle gesetzt. Vorschläge sind ohne Gebäudehülle nicht sinnvoll.
          </div>
        ) : aiSolutions.length === 0 ? (
          <div className="mt-6 text-sm text-zinc-400">
            Keine Lösungen gefunden.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {aiSolutions.map((solution, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex flex-col"
                onMouseEnter={() => setPreviewBlocks(solution.blocks)}
                onMouseLeave={() => setPreviewBlocks(null)}
              >
                <div className="text-sm text-zinc-300">
                  Variante {index + 1}
                </div>

                <div className="mt-1 text-xs text-zinc-400">
                  Score:{" "}
                  {Number.isFinite(solution.score)
                    ? solution.score.toFixed(1)
                    : "–"}
                </div>

                <div className="mt-3 aspect-[4/3] overflow-hidden rounded border border-zinc-800">
                  <MiniPreview
                    boundary={{ w: boundary.widthM, d: boundary.depthM }}
                    solution={solution.blocks}
                    blockById={blockById}
                  />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => applyAISolution(index)}
                    className="rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
                  >
                    Übernehmen
                  </button>

                  <button
                    onClick={closeModal}
                    className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
                  >
                    Später
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniPreview({
  boundary,
  solution,
  blockById,
}: {
  boundary: { w: number; d: number };
  solution: PreviewMove[];
  blockById: Map<string, { wM: number; dM: number; color: string }>;
}) {
  const viewW = 400;
  const viewH = 300;
  const pad = 12;

  const scale = Math.min(
    (viewW - 2 * pad) / boundary.w,
    (viewH - 2 * pad) / boundary.d
  );

  const toX = (xM: number) => viewW / 2 + xM * scale;
  const toY = (yM: number) => viewH / 2 + yM * scale;

  return (
    <svg viewBox={`0 0 ${viewW} ${viewH}`} width="100%" height="100%">
      <rect x="0" y="0" width={viewW} height={viewH} fill="#0a0a0a" />

      <rect
        x={viewW / 2 - (boundary.w * scale) / 2}
        y={viewH / 2 - (boundary.d * scale) / 2}
        width={boundary.w * scale}
        height={boundary.d * scale}
        fill="#0f0f10"
        stroke="#27272a"
      />

      {solution.map((block, index) => {
        const original = blockById.get(block.id);
        if (!original) return null;

        const w = original.wM * scale;
        const d = original.dM * scale;
        const cx = toX(block.xM);
        const cy = toY(block.yM);
        const rot = normalizeRotation(block.rotationDeg);

        return (
          <g key={index} transform={`translate(${cx},${cy}) rotate(${rot})`}>
            <rect
              x={-w / 2}
              y={-d / 2}
              width={w}
              height={d}
              rx={4}
              fill={original.color || "#999"}
              opacity={0.9}
              stroke="#18181b"
            />
          </g>
        );
      })}
    </svg>
  );
}