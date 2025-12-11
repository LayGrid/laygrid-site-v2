import { NextResponse, NextRequest } from "next/server";

const PROTECTED_PATHS = ["/planer"]; // Hier kannst du später mehr Pfade ergänzen

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Nur schützen, wenn der Pfad betroffen ist
  const needsAuth = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // Cookie prüfen
  const session = req.cookies.get("lg_session")?.value;
  if (session) return NextResponse.next();

  // Kein Cookie: auf Login umleiten
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname + (req.nextUrl.search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/planer", "/planer/:path*"],
};
