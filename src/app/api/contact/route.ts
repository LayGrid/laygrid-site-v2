import { NextResponse } from "next/server";

import { Resend } from "resend";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    if (!process.env.RESEND_API_KEY) {

      console.error("RESEND_API_KEY is missing");

      return NextResponse.json(

        { ok: false, error: "Mail service not configured" },

        { status: 500 }

      );

    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({

      from: "LayGrid <no-reply@laygrid.ch>",

      to: ["laygrid@outlook.com"],

      replyTo: body.email,

      subject: "Neue Kontaktanfrage",

      html: `
<strong>Name:</strong> ${body.firstName} ${body.lastName}<br/>
<strong>Firma:</strong> ${body.company}<br/>
<strong>E-Mail:</strong> ${body.email}<br/><br/>
<strong>Nachricht:</strong><br/>

        ${body.message}

      `,

    });

    return NextResponse.json({ ok: true });

  } catch (err) {

    console.error("Contact error:", err);

    return NextResponse.json(

      { ok: false, error: "Mailversand fehlgeschlagen" },

      { status: 500 }

    );

  }

}
 