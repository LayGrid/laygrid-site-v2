
"use client";

import Link from "next/link";
import RippleGrid from "@/components/RippleGrid";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-black">

        {/* Animierter Hintergrund */}
        <RippleGrid />

        {/* Inhalt */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FF6037] uppercase">
              LayGrid | Digitale Produktionsplanung
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Produktionsflächen digital
              <br />
              planen und optimieren.
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-neutral-200">
              LayGrid entwickelt eine einfache Planungssoftware,
              mit der kleine und mittlere Produktionsunternehmen
              ihre Betriebsflächen optimieren, neue Layouts
              testen und Verbesserungspotenziale sichtbar
              machen können.
            </p>

            <p className="max-w-xl text-sm text-neutral-400">
              Ein erster Softwareprototyp ist bereits vorhanden
              und wird laufend weiterentwickelt.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-[#FF6037] text-black hover:bg-[#733635] transition-colors"
              >
                Mehr erfahren
              </Link>

              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-white/40 text-white hover:bg-white/10 transition-colors"
              >
                Kontakt aufnehmen
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section
        id="features"
        className="bg-black border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-3"
          >

            <FeatureCard
              title="Digitale Layoutplanung"
              text="Produktionsflächen digital gestalten, Maschinen flexibel anordnen und verschiedene Layoutvarianten einfach testen."
            />

            <FeatureCard
              title="Produktionsoptimierung"
              text="Bestehende Produktionslayouts analysieren, Flächen effizienter nutzen und Verbesserungspotenziale bei Materialflüssen und Arbeitswegen erkennen."
            />

            <FeatureCard
              title="Beratung & Unterstützung"
              text="Wir unterstützen Unternehmen bei der Planung und Optimierung ihrer Produktionsflächen mit individuellen Lösungen und einem Fokus auf Lean Management."
            />

          </motion.div>
        </div>
      </section>

    </div>
  );
}

type FeatureProps = {
  title: string;
  text: string;
};

function FeatureCard({ title, text }: FeatureProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-5 py-6 sm:px-6 sm:py-7 backdrop-blur">

      <h3 className="text-base sm:text-lg font-semibold mb-3">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
        {text}
      </p>

    </div>
  );
}
