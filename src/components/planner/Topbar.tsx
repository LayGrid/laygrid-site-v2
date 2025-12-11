"use client";

import { usePlanner } from "@/store/planner";

import { exportZip } from "@/lib/plannerExport";

type Props = {

  rightOpen?: boolean;

  onToggleRight?: () => void;

};

export default function Topbar({ rightOpen = true, onToggleRight }: Props) {

  const { settings, setSettings, boundary, setBoundary, blocks, files, setAISolutions, setAIModal } =

    usePlanner();

  const exportAll = () => {

    const project = {

      settings,

      boundary,

      blocks,

      files,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),

    };

    exportZip(project);

  };

  const runAI = async () => {

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

    const data = await res.json();

    setAISolutions(data?.solutions || []);

    setAIModal(true);

  };

  return (
<div className="w-full border border-zinc-800 rounded-xl p-3 bg-black flex flex-wrap items-center gap-3">
<div className="text-sm text-zinc-300 font-semibold">Projekt</div>
<div className="h-6 w-px bg-zinc-800" />
<label className="text-xs text-zinc-400">

        Scale px/m
<input

          type="number"

          className="ml-2 w-20 rounded border border-zinc-700 bg-black px-2 py-1"

          value={settings.scalePxPerM}

          onChange={(e) => setSettings({ scalePxPerM: parseFloat(e.target.value) || 100 })}

        />
</label>
<label className="text-xs text-zinc-400">

        Snap m
<input

          type="number"

          step="0.1"

          className="ml-2 w-20 rounded border border-zinc-700 bg-black px-2 py-1"

          value={settings.snapM}

          onChange={(e) => setSettings({ snapM: parseFloat(e.target.value) || 0.5 })}

        />
</label>
<label className="text-xs text-zinc-400 flex items-center gap-2 ml-2">
<input

          type="checkbox"

          checked={settings.enforceBoundary}

          onChange={(e) => setSettings({ enforceBoundary: e.target.checked })}

        />

        Grenze erzwingen
</label>
<div className="h-6 w-px bg-zinc-800" />
<div className="text-xs text-zinc-400">

        Hülle: {boundary ? `${boundary.widthM}×${boundary.depthM} m` : "keine"}
</div>
<button

        onClick={() => {

          const width = parseFloat(prompt("Gebäudebreite (m):", "20") || "0");

          const depth = parseFloat(prompt("Gebäudetiefe (m):", "12") || "0");

          if (width > 0 && depth > 0)

            setBoundary({ type: "rect", widthM: width, depthM: depth, locked: true });

        }}

        className="ml-2 rounded border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-900"
>

        Hülle setzen
</button>
<div className="ml-auto flex items-center gap-2">

        {/* Toggle rechte Sidebar */}
<button

          onClick={onToggleRight}

          className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"

          title="Rechtes Panel ein/aus"
>

          {rightOpen ? "Rechtes Panel: an" : "Rechtes Panel: aus"}
</button>
<button

          onClick={runAI}

          className="rounded border border-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-900"
>

          KI-Vorschläge
</button>
<button

          onClick={exportAll}

          className="rounded bg-red-500 text-white px-3 py-1.5 text-sm hover:bg-red-600"
>

          Export ZIP
</button>
</div>
</div>

  );

}
 