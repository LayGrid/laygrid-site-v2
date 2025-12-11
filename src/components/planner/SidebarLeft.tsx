"use client";

import { usePlanner } from "@/store/planner";
import { useState } from "react";

export default function SidebarLeft() {
  const { addBlock, addFiles, files, settings } = usePlanner();
  const [w, setW] = useState(2);
  const [d, setD] = useState(1);
  const [h, setH] = useState(2);
  const [name, setName] = useState("Maschine");
  const [color, setColor] = useState("#22c55e");

  return (
    <aside className="w-72 shrink-0 border border-zinc-800 rounded-xl p-3 bg-black">
      <div className="text-sm text-zinc-300 font-semibold mb-2">Bibliothek</div>
      <div className="grid gap-2">
        <button
          onClick={() =>
            addBlock({ name: "Maschine 2×1", wM: 2, dM: 1, hM: 2, xM: 0, yM: 0, rotationDeg: 0, color: "#3b82f6" })
          }
          className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900"
        >
          Maschine 2×1 m
        </button>
        <button
          onClick={() =>
            addBlock({ name: "Palette 1×1", wM: 1, dM: 1, hM: 0.2, xM: 0, yM: 0, rotationDeg: 0, color: "#f59e0b" })
          }
          className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900"
        >
          Palette 1×1 m
        </button>
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="text-sm text-zinc-300 font-semibold mb-2">Eigenen Block anlegen</div>
      <div className="grid gap-2 text-sm">
        <input className="rounded border border-zinc-700 bg-black px-2 py-1" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" />
        <div className="grid grid-cols-3 gap-2">
          <input type="number" step="0.1" className="rounded border border-zinc-700 bg-black px-2 py-1" value={w} onChange={(e)=>setW(parseFloat(e.target.value))} placeholder="Breite (m)"/>
          <input type="number" step="0.1" className="rounded border border-zinc-700 bg-black px-2 py-1" value={d} onChange={(e)=>setD(parseFloat(e.target.value))} placeholder="Tiefe (m)"/>
          <input type="number" step="0.1" className="rounded border border-zinc-700 bg-black px-2 py-1" value={h} onChange={(e)=>setH(parseFloat(e.target.value))} placeholder="Höhe (m)"/>
        </div>
        <div className="flex items-center gap-2">
          <span>Farbe</span>
          <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} />
        </div>
        <button
          onClick={() =>
            addBlock({ name, wM: w, dM: d, hM: h, xM: 0, yM: 0, rotationDeg: 0, color })
          }
          className="rounded-lg border border-zinc-700 px-3 py-2 text-left hover:bg-zinc-900"
        >
          Hinzufügen
        </button>
      </div>

      <div className="h-px bg-zinc-800 my-3" />

      <div className="text-sm text-zinc-300 font-semibold mb-2">Dateien (STEP etc.)</div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          const fs = Array.from(e.target.files || []);
          if (fs.length) addFiles(fs);
        }}
        className="text-sm"
      />
      <ul className="mt-2 text-xs text-zinc-400 space-y-1 max-h-28 overflow-auto">
        {files.map((f) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>

      <div className="h-px bg-zinc-800 my-3" />
      <div className="text-xs text-zinc-500">
        Maßstab: {settings.scalePxPerM} px/m • Snap: {settings.snapM} m
      </div>
    </aside>
  );
}
