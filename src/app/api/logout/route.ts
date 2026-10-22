// src/app/api/logout/route.ts

import { NextResponse } from "next/server";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set("laygrid_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST() {
  return clearSessionCookie(NextResponse.json({ ok: true }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = new URL("/login", url.origin);
  return clearSessionCookie(NextResponse.redirect(target));
}