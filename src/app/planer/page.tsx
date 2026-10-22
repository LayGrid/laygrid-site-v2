"use client";

import { useState } from "react";
import Topbar from "@/components/planner/Topbar";
import SidebarRight from "@/components/planner/SidebarRight";
import PlannerCanvas from "@/components/planner/Canvas";
import AIModal from "@/components/planner/AIModal";
import { usePlanner } from "@/store/planner";

export default function PlanerPage() {
  const { boundary } = usePlanner();
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden">
      <Topbar
        rightOpen={rightOpen}
        onToggleRight={() => setRightOpen((open) => !open)}
      />

      {!boundary && (
        <div className="border-b border-zinc-800 bg-amber-950/20 px-4 py-2 text-sm text-amber-300">
          Lege zuerst eine Gebäudehülle fest. Danach kannst du Wände, Maschinen
          und weitere Elemente platzieren.
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <PlannerCanvas />
        </div>

        <div
          className="shrink-0 overflow-hidden border-l border-zinc-800 bg-black transition-[width] duration-300"
          style={{ width: rightOpen ? "22rem" : "0rem" }}
        >
          {rightOpen && <SidebarRight />}
        </div>
      </div>

      <AIModal />
    </div>
  );
}