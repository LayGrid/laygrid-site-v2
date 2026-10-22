// src/app/api/login/route.ts

import { NextResponse } from "next/server";
import {
  createSessionToken,
  isValidEmail,
  normalizeEmail,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email ?? "");
    const password = String(body?.password ?? "");

    const accessPassword = process.env.LAYGRID_ACCESS_PASSWORD;
    const sessionSecret = process.env.LAYGRID_SESSION_SECRET;

    if (!accessPassword || !sessionSecret) {
      return NextResponse.json(
        { error: "Server-Konfiguration fehlt." },
        { status: 500 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Bitte eine gültige E-Mail-Adresse eingeben." },
        { status: 400 }
      );
    }

    if (password !== accessPassword) {
      return NextResponse.json(
        { error: "Passwort ist falsch." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(email, sessionSecret);

    console.log(
      `[LayGrid Login] ${new Date().toISOString()} | ${email}`
    );

    const response = NextResponse.json({ ok: true });

    response.cookies.set("laygrid_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login-Fehler:", error);

    return NextResponse.json(
      { error: "Login konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}