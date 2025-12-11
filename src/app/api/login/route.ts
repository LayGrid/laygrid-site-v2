import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/");

  // Simplifizierte Login-Logik: akzeptiert jede Eingabe
  const ok = username.length > 0 && password.length > 0;

  const res = NextResponse.redirect(
    new URL(ok ? next : `/login?error=1&next=${encodeURIComponent(next)}`, req.url)
  );

  if (ok) {
    res.cookies.set("lg_session", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Tage gültig
    });
  }

  return res;
}

