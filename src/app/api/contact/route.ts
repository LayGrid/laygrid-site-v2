import { NextResponse } from "next/server";

import { Resend } from "resend";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {

      firstName,

      lastName,

      email,

      company,

      message,

    } = body;

    if (!email || !message || !firstName || !lastName) {

      return NextResponse.json(

        { error: "Pflichtfelder fehlen" },

        { status: 400 }

      );

    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({

      from: "LayGrid <onboarding@resend.dev>", // WICHTIG

      to: "laygrid@outlook.com",               // deine echte Zieladresse

      replyTo: email,                          // Antworten gehen an Absender

      subject: "Neue Kontaktanfrage über LayGrid",

      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
<h2>Neue Kontaktanfrage</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>E-Mail:</strong> ${email}</p>
<p><strong>Firma:</strong> ${company || "-"}</p>
<p><strong>Nachricht:</strong></p>
<p>${message.replace(/\n/g, "<br />")}</p>
<hr />
<p style="font-size:12px;color:#666;">

            Diese Nachricht wurde über das Kontaktformular von laygrid.ch gesendet.
</p>
</div>

      `,

    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("Kontaktformular Fehler:", error);

    return NextResponse.json(

      { error: "E-Mail konnte nicht gesendet werden" },

      { status: 500 }

    );

  }

}