"use client";

import Topbar from "@/components/planner/Topbar";

import SidebarLeft from "@/components/planner/SidebarLeft";

import SidebarRight from "@/components/planner/SidebarRight";

import PlannerCanvas from "@/components/planner/Canvas";

import { useEffect, useState } from "react";

import { usePlanner } from "@/store/planner";

export default function PlanerPage() {

  const { boundary, setBoundary } = usePlanner();

  const [rightOpen, setRightOpen] = useState(true);

  useEffect(() => {

    if (!boundary) {

      const w = parseFloat(prompt("Gebäudebreite (m):", "20") || "0");

      const d = parseFloat(prompt("Gebäudetiefe (m):", "12") || "0");

      if (w > 0 && d > 0) setBoundary({ type: "rect", widthM: w, depthM: d, locked: true });

    }

  }, [boundary, setBoundary]);

  return (
<section className="bg-bg text-text pt-16">
<div className="w-full px-4 md:px-6 pb-8">
<Topbar rightOpen={rightOpen} onToggleRight={() => setRightOpen(o => !o)} />

        {/* Layout: links fix, Mitte flexibel, rechts ein-/ausklappbar */}
<div className="mt-4 flex flex-col lg:flex-row gap-4 items-stretch">

          {/* links */}
<div className="w-full lg:w-[14rem]">
<SidebarLeft />
</div>

          {/* mitte */}
<div className="flex-1">
<PlannerCanvas />
</div>

          {/* rechts: animierte Breite */}
<div

            className={`w-full lg:transition-[width] lg:duration-300 overflow-hidden`}

            style={{ width: rightOpen ? "16rem" : "0rem" }}
>

            {rightOpen && <SidebarRight />}
</div>
</div>
</div>
</section>

  );

}
 