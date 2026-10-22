
"use client";

import { FormEvent, useState } from "react";

type StatusState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function KontaktPage() {
  const [status, setStatus] = useState<StatusState>({
    type: "idle",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const form = e.currentTarget;

    const formData = {
      firstName: (
        form.elements.namedItem("firstName") as HTMLInputElement
      ).value,
      lastName: (
        form.elements.namedItem("lastName") as HTMLInputElement
      ).value,
      company: (
        form.elements.namedItem("company") as HTMLInputElement
      ).value,
      email: (
        form.elements.namedItem("email") as HTMLInputElement
      ).value,
      message: (
        form.elements.namedItem("message") as HTMLTextAreaElement
      ).value,
      consent: (
        form.elements.namedItem("consent") as HTMLInputElement
      ).checked,
    };

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.company.trim() ||
      !formData.email.trim() ||
      !formData.message.trim() ||
      !formData.consent
    ) {
      setStatus({
        type: "error",
        message:
          "Bitte füllen Sie alle Felder aus und bestätigen Sie die Einwilligung.",
      });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Unbekannter Fehler");
      }

      setStatus({ type: "success" });
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "Das Absenden ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-16 text-white">

      {/* EINLEITUNG */}
      <section className="space-y-4">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FF6037] uppercase">
          Kontakt
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Nehmen Sie Kontakt mit uns auf.
        </h1>

        <p className="text-base md:text-lg text-gray-300 max-w-3xl">
          Sie interessieren sich für LayGrid oder möchten
          mehr über digitale Produktionsplanung,
          Lean Management und unsere
          Beratungsleistungen erfahren?
          Wir freuen uns auf Ihre Nachricht.
        </p>
      </section>

      {/* KONTAKTFORMULAR */}
      <section className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-gray-800 bg-black/40 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium"
              >
                Vorname
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-[#FF6037] focus:outline-none focus:ring-1 focus:ring-[#FF6037]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium"
              >
                Nachname
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-[#FF6037] focus:outline-none focus:ring-1 focus:ring-[#FF6037]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-sm font-medium"
            >
              Firma
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-[#FF6037] focus:outline-none focus:ring-1 focus:ring-[#FF6037]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-[#FF6037] focus:outline-none focus:ring-1 focus:ring-[#FF6037]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium"
            >
              Nachricht
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-[#FF6037] focus:outline-none focus:ring-1 focus:ring-[#FF6037]"
              required
            />
          </div>

          {/* DATENSCHUTZ */}
          <div className="flex items-start gap-2">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-700 bg-black/60 text-[#FF6037] focus:ring-[#FF6037]"
              required
            />

            <label
              htmlFor="consent"
              className="text-xs text-gray-300"
            >
              Sie erklären sich damit einverstanden,
              dass Ihre Daten zur Bearbeitung Ihres
              Anliegens verwendet werden.
              Weitere Informationen finden Sie in der{" "}
              <a
                href="/datenschutz"
                className="underline decoration-dotted underline-offset-2 hover:text-[#FF6037]"
              >
                Datenschutzerklärung
              </a>
              .
            </label>
          </div>

          {/* STATUS */}
          {status.type === "error" && (
            <p className="text-sm text-red-400">
              {status.message}
            </p>
          )}

          {status.type === "success" && (
            <p className="text-sm text-emerald-400">
              Vielen Dank! Ihre Nachricht wurde
              erfolgreich versendet.
            </p>
          )}

          {/* ABSENDEN */}
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="inline-flex min-w-[160px] justify-center rounded-lg bg-[#FF6037] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#733635] hover:text-white disabled:opacity-60"
          >
            {status.type === "loading"
              ? "Senden ..."
              : "Nachricht senden"}
          </button>
        </form>
      </section>

      {/* KONTAKTDATEN */}
      <section className="border-t border-white/10 pt-10">
        <h2 className="text-2xl font-semibold mb-6">
          Unsere Kontaktdaten
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#4B4E53]/20 p-6">
            <p className="text-sm text-gray-400 mb-2">
              E-Mail
            </p>

            <a
              href="mailto:laygrid@outlook.com"
              className="text-base font-medium text-white hover:text-[#FF6037] transition-colors break-all"
            >
              laygrid@outlook.com
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#4B4E53]/20 p-6">
            <p className="text-sm text-gray-400 mb-2">
              Telefon
            </p>

            <a
              href="tel:+41789401663"
              className="text-base font-medium text-white hover:text-[#FF6037] transition-colors"
            >
              +41 78 940 16 63
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
