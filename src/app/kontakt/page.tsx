"use client";

import { FormEvent, useState } from "react";

type StatusState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function KontaktPage() {
  const [status, setStatus] = useState<StatusState>({ type: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const form = e.currentTarget;

    const formData = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement)
        ?.value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement)?.value,
      company: (form.elements.namedItem("company") as HTMLInputElement)?.value,
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        ?.value,
      consent: (form.elements.namedItem("consent") as HTMLInputElement)?.checked,
    };

    // einfache Client-Validierung
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Unbekannter Fehler");
      }

      setStatus({ type: "success" });
      form.reset();
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Das Absenden ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-16">
      {/* Titel + Einleitung */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Kontaktformular</h1>
        <p className="text-base md:text-lg text-gray-300">
          Haben Sie Fragen, ein konkretes Projekt oder möchten einfach mehr über
          LayGrid erfahren? Wir freuen uns auf den Austausch mit Ihnen!
        </p>
        <p className="text-sm md:text-base text-gray-400">
          Schreiben Sie uns oder rufen Sie an. Lassen Sie uns gemeinsam die
          beste Lösung für Ihre Anforderungen finden.
        </p>
      </section>

      {/* Formular */}
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
                className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium">
              Firma
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-Mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
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
              className="w-full rounded-md border border-gray-700 bg-black/60 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-700 bg-black/60 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="consent" className="text-xs text-gray-300">
              Sie erklären sich damit einverstanden, dass Ihre Daten zur
              Bearbeitung Ihres Anliegens verwendet werden. Weitere
              Informationen und Widerrufshinweise finden Sie in der{" "}
              <a
                href="/datenschutz"
                className="underline decoration-dotted underline-offset-2 hover:text-orange-400"
              >
                Datenschutzerklärung
              </a>
              .
            </label>
          </div>

          {status.type === "error" && (
            <p className="text-sm text-red-400">{status.message}</p>
          )}
          {status.type === "success" && (
            <p className="text-sm text-emerald-400">
              Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.
            </p>
          )}

          <button
            type="submit"
            disabled={status.type === "loading"}
            className="inline-flex min-w-[160px] justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-60"
          >
            {status.type === "loading" ? "Senden ..." : "Absenden"}
          </button>
        </form>
      </section>

      {/* Adresse + Google Maps */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start">
        <div className="space-y-2 text-sm">
          <h2 className="text-lg font-semibold mb-2">Adresse</h2>
          <p>LayGrid</p>
          <p>Feldlistrasse 31</p>
          <p>9000 St. Gallen</p>

          <div className="mt-4 space-y-1">
            <p>
              E-Mail:{" "}
              <a
                href="mailto:laygrid@outlook.com"
                className="underline decoration-dotted underline-offset-2 hover:text-orange-400"
              >
                laygrid@outlook.com
              </a>
            </p>
            <p>
              Telefon:{" "}
              <a
                href="tel:+41789401663"
                className="underline decoration-dotted underline-offset-2 hover:text-orange-400"
              >
                +41 78 940 16 63
              </a>
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-800 bg-black/60">
          <iframe
            title="LayGrid Standort"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2765.88415014542!2d9.375!3d47.423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sFeldlistrasse%2031%2C%209000%20St.%20Gallen!5e0!3m2!1sde!2sch!4v1700000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[260px] w-full"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
