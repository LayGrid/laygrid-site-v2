"use client";

import { useEffect, useMemo } from "react";

import { usePlanner } from "@/store/planner";

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

  // Hooks müssen immer aufgerufen werden – daher useMemo VOR dem Early-Return:

  const blockById = useMemo(() => new Map(blocks.map((b) => [b.id, b])), [blocks]);

  // Beim Schließen Preview zurücksetzen

  useEffect(() => {

    if (!showAIModal) setPreviewBlocks(null);

  }, [showAIModal, setPreviewBlocks]);

  if (!showAIModal) return null;

  return (
<div className="fixed inset-0 z-[60]">

      {/* Backdrop */}
<div

        className="absolute inset-0 bg-black/70"

        onClick={() => {

          setPreviewBlocks(null);

          setAIModal(false);

        }}

      />

      {/* Dialog */}
<div className="absolute left-1/2 top-14 -translate-x-1/2 w-[min(980px,calc(100vw-2rem))] rounded-xl border border-zinc-800 bg-black p-4">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold text-white">KI-Vorschläge</h3>
<button

            onClick={() => {

              setPreviewBlocks(null);

              setAIModal(false);

            }}

            className="rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-900"
>

            Schliessen
</button>
</div>

        {(!boundary || aiSolutions.length === 0) ? (
<div className="text-zinc-400 text-sm mt-6">

            {boundary ? "Keine Lösungen gefunden." : "Keine Hülle gesetzt – Vorschau nicht möglich."}
</div>

        ) : (
<div className="grid md:grid-cols-3 gap-3 mt-4">

            {aiSolutions.map((sol, i) => (
<div

                key={i}

                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex flex-col"

                onMouseEnter={() => setPreviewBlocks(sol.blocks)}

                onMouseLeave={() => setPreviewBlocks(null)}
>
<div className="text-sm text-zinc-300">Variante {i + 1}</div>
<div className="text-xs text-zinc-400 mt-1">

                  Score: {Number.isFinite(sol.score) ? sol.score.toFixed(1) : "–"}
</div>
<div className="mt-3 aspect-[4/3] rounded border border-zinc-800 overflow-hidden">
<MiniPreview

                    boundary={{ w: boundary.widthM, d: boundary.depthM }}

                    solution={sol.blocks}

                    blockById={blockById}

                  />
</div>
<div className="mt-3 flex items-center gap-2">
<button

                    onClick={() => applyAISolution(i)}

                    className="rounded bg-red-500 text-white px-3 py-1.5 text-sm hover:bg-red-600"
>

                    Übernehmen
</button>
<button

                    onClick={() => setAIModal(false)}

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

  solution: Array<{ id: string; xM: number; yM: number; rotationDeg: number }>;

  blockById: Map<string, any>;

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

      {solution.map((b, idx) => {

        const orig = blockById.get(b.id);

        if (!orig) return null;

        const w = orig.wM * scale;

        const d = orig.dM * scale;

        const cx = toX(b.xM);

        const cy = toY(b.yM);

        const rot = b.rotationDeg || 0;

        return (
<g key={idx} transform={`translate(${cx},${cy}) rotate(${rot})`}>
<rect

              x={-w / 2}

              y={-d / 2}

              width={w}

              height={d}

              rx={4}

              fill={orig.color || "#999"}

              opacity={0.9}

              stroke="#18181b"

            />
</g>

        );

      })}
</svg>

  );

}
 