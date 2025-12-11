"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerLogin />
    </Suspense>
  );
}

function InnerLogin() {
  const params = useSearchParams();

  // HIER deinen bisherigen Inhalt der Login-Seite einsetzen:
  // also das JSX, das vorher in deinem `export default function Page()` drin war.

  return (
    <div>
      {/* dein bisheriges Login-Layout */}
    </div>
  );
}
