import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const next = String(form?.get("next") || "/");

  const res = NextResponse.redirect(new URL(next, req.url));
  // Cookie invalidieren
  res.cookies.set("lg_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
