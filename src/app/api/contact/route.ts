import { NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { firstName, lastName, company, email, message, consent } = body;

    // Serverseitige Validierung

    if (

      !firstName?.trim() ||

      !lastName?.trim() ||

      !company?.trim() ||

      !email?.trim() ||

      !message?.trim() ||

      !consent

    ) {

      return NextResponse.json(

        { ok: false, error: "Ungültige Eingaben." },

        { status: 400 }

      );

    }

    // Apple-clean + LayGrid-Branding HTML Template

    const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#f5f5f7; padding:32px;">
<div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
<h2 style="color:#FF6037; margin-top:0; font-size:24px; font-weight:600;">

            Neue Kontaktanfrage
</h2>
<p style="font-size:16px; color:#333; margin-bottom:18px;">

            Jemand hat das Kontaktformular auf der LayGrid-Website ausgefüllt.
</p>
<div style="border-top:1px solid #eee; margin:24px 0;"></div>
<p style="margin:0 0 12px; font-size:15px;">
<strong style="color:#111;">Vorname:</strong> ${firstName}
</p>
<p style="margin:0 0 12px; font-size:15px;">
<strong style="color:#111;">Nachname:</strong> ${lastName}
</p>
<p style="margin:0 0 12px 0; font-size:15px;">
<strong style="color:#111;">Firma:</strong> ${company}
</p>
<p style="margin:0 0 12px 0; font-size:15px;">
<strong style="color:#111;">E-Mail:</strong> ${email}
</p>
<div style="border-top:1px solid #eee; margin:24px 0;"></div>
<p style="margin:0 0 8px; font-size:15px;">
<strong style="color:#111;">Nachricht:</strong>
</p>
<div style="background:#fafafa; padding:16px; border-radius:10px; font-size:15px; line-height:1.7; color:#333; border:1px solid #eee;">

            ${message.replace(/\n/g, "<br>")}
</div>
<p style="margin-top:32px; font-size:13px; color:#999;">

            Diese Nachricht wurde automatisch vom LayGrid Webformular generiert.
</p>
</div>
</div>

    `;

    console.log("📤 Sende E-Mail über Resend...");

    console.log("📨 Payload:", body);

    const result = await resend.emails.send({

      from: "LayGrid Kontakt <onboarding@resend.dev>",   // kostenlos & sofort valid

      to: "laygrid@outlook.com",                         // Zieladresse

      replyTo: email,                                    // Antwort geht an Besucher

      subject: `Neue Anfrage – ${firstName} ${lastName}`,

      html,

    });

    console.log("📩 Resend Antwort:", result);

    if (result.error) {

      console.error("❌ Resend Fehler:", result.error);

      return NextResponse.json(

        { ok: false, error: "Fehler beim Senden über Resend." },

        { status: 500 }

      );

    }

    return NextResponse.json({ ok: true });

  } catch (error) {

    console.error("❌ Kontaktformular-Fehler:", error);

    return NextResponse.json(

      { ok: false, error: "Mailversand fehlgeschlagen." },

      { status: 500 }

    );

  }

}
 