
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProduktPage() {
  return (
    <div className="bg-black text-white">

      {/* HERO SECTION */}
      <section className="relative w-full h-[55vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">

        {/* Hintergrund */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#351E1C] via-[#150E0E] to-black" />

        <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#733635]/20 blur-3xl" />

        {/* Animierter Inhalt */}
        <div className="relative z-10 flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FF6037] uppercase mb-5">
              LayGrid Software
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Produktionsflächen einfach
              <br />
              digital planen.
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
              Eine intuitive Software zur Planung und
              Optimierung von Produktionsflächen.
              Entwickelt für Unternehmen, die ihre
              Layouts einfach und flexibel gestalten möchten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {/* SOFTWARE ÜBERBLICK */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold mb-4">
            Die Software
          </h2>

          <p className="text-gray-300 leading-relaxed max-w-3xl">
            LayGrid ermöglicht die digitale Darstellung
            und Gestaltung von Produktionsflächen.
            Maschinen und Arbeitsbereiche lassen sich
            flexibel anordnen, um verschiedene
            Layoutvarianten zu entwickeln und
            bestehende Flächen besser zu nutzen.
          </p>
        </motion.div>

        {/* DREI INFORMATIONSKARTEN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid sm:grid-cols-3 gap-8"
        >
          <Card
            title="Einfach digital planen"
            text="Produktionsflächen und Maschinen übersichtlich darstellen und Layouts direkt im Browser gestalten."
          />

          <Card
            title="Varianten vergleichen"
            text="Unterschiedliche Anordnungen testen und passende Lösungen für bestehende oder neue Produktionsflächen entwickeln."
          />

          <Card
            title="Effizienter produzieren"
            text="Flächennutzung, Materialflüsse und Arbeitswege bei der Planung berücksichtigen und Optimierungspotenziale erkennen."
          />
        </motion.div>

        {/* SOFTWARE UND LAYOUTDARSTELLUNG */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-white/10 rounded-2xl p-6 sm:p-10 bg-[#4B4E53]/20 backdrop-blur-sm grid md:grid-cols-2 gap-12 items-center"
        >

          {/* SCHEMATISCHE SOFTWAREDARSTELLUNG */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] p-5 sm:p-7 shadow-lg">

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5 gap-3">
                <p className="text-xs uppercase tracking-[0.15em] text-[#FF6037]">
                  Layoutplanung
                </p>

                <span className="text-xs text-gray-400">
                  Beispielansicht
                </span>
              </div>

              <div className="rounded-xl border border-white/20 bg-black/75 p-4 sm:p-5">

                <div className="grid grid-cols-6 gap-3">

                  <div className="col-span-2 h-24 rounded-lg border border-[#FF6037]/60 bg-[#FF6037]/20 flex items-center justify-center px-2">
                    <span className="text-xs text-center">
                      Maschine A
                    </span>
                  </div>

                  <div className="col-span-2 h-24 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center px-2">
                    <span className="text-xs text-center">
                      Montage
                    </span>
                  </div>

                  <div className="col-span-2 h-24 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center px-2">
                    <span className="text-xs text-center">
                      Lager
                    </span>
                  </div>

                  <div className="col-span-6 h-10 rounded-lg border border-dashed border-[#FF6037]/50 flex items-center justify-center">
                    <span className="text-xs text-gray-300">
                      Materialfluss
                    </span>
                  </div>

                  <div className="col-span-3 h-20 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-center">
                      Maschine B
                    </span>
                  </div>

                  <div className="col-span-3 h-20 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-center">
                      Arbeitsplätze
                    </span>
                  </div>

                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Vereinfachte Darstellung einer Produktionsfläche
              </p>
            </div>
          </div>

          {/* BESCHREIBUNG */}
          <div>
            <h3 className="text-3xl font-semibold mb-4">
              Der digitale Webplaner
            </h3>

            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-5">
              Mit LayGrid können Produktionsflächen
              digital gestaltet und unterschiedliche
              Anordnungen von Maschinen und
              Arbeitsbereichen ausprobiert werden.
            </p>

            <p className="text-gray-300 leading-relaxed mb-5">
              Die browserbasierte Lösung soll den
              Planungsaufwand reduzieren und
              Unternehmen ermöglichen, ihre
              Produktionslayouts selbstständig
              weiterzuentwickeln.
            </p>

            <p className="text-sm text-gray-400 leading-relaxed">
              Ein erster Softwareprototyp ist bereits
              vorhanden und wird laufend
              weiterentwickelt.
            </p>
          </div>

        </motion.div>

        {/* PRODUKTIONSOPTIMIERUNG */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#FF6037] uppercase mb-4">
              Lean Management
            </p>

            <h3 className="text-3xl font-semibold mb-5">
              Bestehende Produktionen optimieren.
            </h3>

            <p className="text-gray-300 leading-relaxed mb-5">
              Eine durchdachte Produktionsgestaltung
              kann unnötige Wege reduzieren,
              Materialflüsse verbessern und
              vorhandene Flächen effizienter nutzen.
            </p>

            <p className="text-gray-300 leading-relaxed">
              LayGrid verbindet digitale Layoutplanung
              mit den Grundgedanken des Lean Managements,
              um Verbesserungsmöglichkeiten sichtbar
              und nachvollziehbar zu machen.
            </p>
          </div>

          <div className="grid gap-4">
            <BenefitCard
              number="01"
              title="Flächen effizient nutzen"
              text="Bestehende Produktionsbereiche neu gestalten und vorhandenen Platz besser einsetzen."
            />

            <BenefitCard
              number="02"
              title="Materialflüsse verbessern"
              text="Anordnungen hinterfragen und Möglichkeiten für kürzere Transportwege erkennen."
            />

            <BenefitCard
              number="03"
              title="Abläufe vereinfachen"
              text="Produktionsstrukturen übersichtlich darstellen und Verbesserungen gezielt vorbereiten."
            />
          </div>
        </motion.div>

        {/* BERATUNG */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-white/10 rounded-2xl p-8 sm:p-10 bg-[#4B4E53]/20 backdrop-blur-sm"
        >
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#FF6037] uppercase mb-4">
              Ergänzende Dienstleistungen
            </p>

            <h3 className="text-3xl font-semibold mb-5">
              Persönliche Beratung nach Bedarf.
            </h3>

            <p className="text-gray-300 leading-relaxed mb-7">
              Neben unserer Software unterstützen wir
              Unternehmen bei der Analyse, Planung und
              Optimierung ihrer Produktionsflächen.
              Dabei stehen praxisnahe Lösungen,
              effiziente Abläufe und die individuellen
              Anforderungen des Unternehmens
              im Mittelpunkt.
            </p>

            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-[#FF6037] text-black hover:bg-[#733635] hover:text-white transition-colors"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </motion.div>

      </section>
    </div>
  );
}

/* INFORMATIONSKARTEN */

function Card({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#4B4E53]/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

/* OPTIMIERUNGSKARTEN */

function BenefitCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5 rounded-xl border border-white/10 bg-[#4B4E53]/20 p-5 backdrop-blur-sm">

      <span className="text-2xl font-bold text-[#FF6037]">
        {number}
      </span>

      <div>
        <h4 className="text-lg font-semibold mb-2">
          {title}
        </h4>

        <p className="text-sm text-gray-300 leading-relaxed">
          {text}
        </p>
      </div>

    </div>
  );
}
