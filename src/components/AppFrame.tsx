"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type AppFrameProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export default function AppFrame({
  header,
  footer,
  children,
}: AppFrameProps) {
  const pathname = usePathname();
  const isPlannerRoute = pathname.startsWith("/planer");

  if (isPlannerRoute) {
    return (
      <main className="h-screen overflow-hidden bg-black text-white">
        {children}
      </main>
    );
  }

  return (
    <>
      {header}
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      {footer}
    </>
  );
}