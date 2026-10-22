// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionSecret = process.env.LAYGRID_SESSION_SECRET;

  if (!sessionSecret) {
    return NextResponse.next();
  }

  const token = req.cookies.get("laygrid_session")?.value;
  const isProtectedPlannerRoute = pathname.startsWith("/planer");
  const isLoginRoute = pathname === "/login";

  let sessionValid = false;

  if (token) {
    const result = await verifySessionToken(token, sessionSecret);
    sessionValid = result.valid;
  }

  if (isProtectedPlannerRoute && !sessionValid) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + (req.nextUrl.search || ""));
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && sessionValid) {
    return NextResponse.redirect(new URL("/planer", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/planer/:path*", "/login"],
};