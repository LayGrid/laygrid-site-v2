"use client";

import { usePlanner } from "@/store/planner";

export default function SidebarRight() {
  const { blocks, selectedId, updateBlock, deleteBlock, settings } = usePlanner();
  const b = blocks.find((x) => x.id === selectedId) || null;

  if (!b) {
    return (
      <aside className="w-80 shrink-0 border border-zinc-800 rounded-xl p-3 bg-black text-sm text-zinc-400">
        Nichts ausgewählt
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 border border-zinc-800 rounded-xl p-3 bg-black text-sm">
      <div className="text-zinc-300 font-semibold mb-2">Eigenschaften</div>
      <div className="grid gap-2">
        <input className="rounded border border-zinc-700 bg-black px-2 py-1"
          value={b.name} onChange={(e)=>updateBlock(b.id, { name: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs text-zinc-400">B (m)
            <input type="number" step="0.1" className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.wM} onChange={(e)=>updateBlock(b.id, { wM: parseFloat(e.target.value) || 0 })}/>
          </label>
          <label className="text-xs text-zinc-400">T (m)
            <input type="number" step="0.1" className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.dM} onChange={(e)=>updateBlock(b.id, { dM: parseFloat(e.target.value) || 0 })}/>
          </label>
          <label className="text-xs text-zinc-400">H (m)
            <input type="number" step="0.1" className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.hM || 0} onChange={(e)=>updateBlock(b.id, { hM: parseFloat(e.target.value) || 0 })}/>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs text-zinc-400">X (m)
            <input type="number" step={settings.snapM} className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.xM} onChange={(e)=>updateBlock(b.id, { xM: parseFloat(e.target.value) || 0 })}/>
          </label>
          <label className="text-xs text-zinc-400">Y (m)
            <input type="number" step={settings.snapM} className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.yM} onChange={(e)=>updateBlock(b.id, { yM: parseFloat(e.target.value) || 0 })}/>
          </label>
          <label className="text-xs text-zinc-400">Rot (°)
            <input type="number" step={0.1} className="w-full rounded border border-zinc-700 bg-black px-2 py-1"
              value={b.rotationDeg} onChange={(e)=>updateBlock(b.id, { rotationDeg: parseFloat(e.target.value) || 0 })}/>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Farbe</span>
          <input type="color" value={b.color} onChange={(e)=>updateBlock(b.id, { color: e.target.value })}/>
          <button
            onClick={()=>updateBlock(b.id, { rotationDeg: 0 })}
            className="ml-auto rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-900"
          >
            Rotation 0°
          </button>
        </div>

        <button
          onClick={()=>deleteBlock(b.id)}
          className="mt-2 rounded border border-red-600 text-red-400 px-3 py-1 hover:bg-red-900/20"
        >
          Löschen
        </button>
      </div>
    </aside>
  );
}
