"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[#351E1C] via-[#150E0E] to-black" />
        <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#733635]/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl text-center px-4"
        >
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FF6037] uppercase mb-5">
            Über LayGrid
          </p>

          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            Wir machen Produktionsplanung einfacher.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-200 leading-relaxed">
            Mit LayGrid entwickeln wir eine Software, die
            Unternehmen dabei unterstützt, ihre
            Produktionsflächen digital zu planen und
            bestehende Abläufe gezielt zu verbessern.
          </p>
        </motion.div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-20">
        {/* MISSION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold mb-4">
            Unsere Mission
          </h2>

          <p className="text-gray-300 leading-relaxed max-w-3xl">
            Produktionsplanung soll einfach, verständlich und
            für jedes Unternehmen zugänglich sein.
            LayGrid verbindet digitale Layoutplanung
            mit den Prinzipien des Lean Managements,
            um Flächen effizienter zu nutzen und
            Produktionsprozesse nachhaltig zu verbessern.
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
            text="Produktionsflächen übersichtlich gestalten, Maschinen flexibel anordnen und unterschiedliche Layoutvarianten testen."
          />

          <Card
            title="Bestehendes verbessern"
            text="Materialflüsse, Arbeitswege und Flächennutzung analysieren und Optimierungspotenziale mit Lean Management erkennen."
          />

          <Card
            title="Persönlich unterstützen"
            text="Wir begleiten Unternehmen bei der Planung und Optimierung ihrer Produktionsflächen mit individuellen Beratungsleistungen."
          />
        </motion.div>

        {/* WARUM LAYGRID */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* SCHEMATISCHE LAYOUTDARSTELLUNG */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#161616] p-6 sm:p-8 shadow-lg">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#FF6037] mb-5">
                Digitale Flächenplanung
              </p>

              <div className="rounded-xl border border-white/20 bg-black/70 p-5">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="h-24 rounded-lg border border-[#FF6037]/60 bg-[#FF6037]/20 flex items-center justify-center">
                    <span className="text-xs text-center text-white">
                      Produktion
                    </span>
                  </div>

                  <div className="h-24 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-center text-white">
                      Montage
                    </span>
                  </div>

                  <div className="h-24 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center">
                    <span className="text-xs text-center text-white">
                      Lager
                    </span>
                  </div>
                </div>

                <div className="h-8 rounded-lg border border-dashed border-[#FF6037]/40 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    Materialfluss
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="h-12 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center">
                    <span className="text-xs text-gray-300">
                      Arbeitsplatz A
                    </span>
                  </div>

                  <div className="h-12 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center">
                    <span className="text-xs text-gray-300">
                      Arbeitsplatz B
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Schematische Darstellung einer Produktionsfläche
              </p>
            </div>
          </div>

          {/* TEXT */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Warum LayGrid?
            </h3>

            <p className="text-gray-300 leading-relaxed mb-5">
              Gerade kleinere Produktionsunternehmen benötigen
              einfache Lösungen, um bestehende Flächen
              anzupassen, Prozesse zu verbessern und neue
              Ideen ohne grossen Planungsaufwand zu prüfen.
            </p>

            <p className="text-gray-300 leading-relaxed mb-5">
              LayGrid verbindet eine benutzerfreundliche Software
              mit praxisorientierter Produktionsoptimierung.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              Ein erster Softwareprototyp ist bereits vorhanden.
              Die Lösung wird laufend weiterentwickelt.
            </p>
          </div>
        </motion.div>

        {/* HINTER LAYGRID */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border border-white/10 rounded-2xl bg-[#4B4E53]/20 backdrop-blur-sm p-6 sm:p-10"
        >
          <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-10 items-center">
            <div className="w-full max-w-[220px] mx-auto md:mx-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <Image
                src="/katarina-petrovic.png"
                alt="Porträt von Katarina Petrovic"
                width={700}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#FF6037] uppercase mb-4">
                Hinter LayGrid
              </p>

              <h3 className="text-3xl font-semibold mb-2">
                Katarina Petrovic
              </h3>

              <p className="text-lg text-gray-300 mb-6">
              Initiatorin  von LayGrid
              </p>

              <p className="text-gray-300 leading-relaxed mb-4">
                Mit meinem technischen Hintergrund und
                meiner Erfahrung in der Produktionsplanung
                möchte ich die Planung und Optimierung von
                Produktionsflächen einfacher und zugänglicher gestalten.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Aus dieser Idee ist LayGrid entstanden.
                Mein Ziel ist es, Unternehmen mit einer
                benutzerfreundlichen Software und praxisnahen
                Lösungen bei der Produktionsplanung und
                Optimierung zu unterstützen.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

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