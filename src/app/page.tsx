"use client";

import Link from "next/link";

import RippleGrid from "@/components/RippleGrid";

import { motion } from "framer-motion";

const HERO_BG = "/hero-bg.png"; // ← Falls dein Bild anders heisst, hier anpassen

export default function HomePage() {

  return (
<div className="bg-black text-white min-h-screen">

     <section className="relative h-screen w-full overflow-hidden bg-black">

  {/* RippleGrid Hintergrund */}
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

         LayGrid – Wenn Planung sichtbar wird
</p>
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">

        Planen Sie Ihre Betriebsflächen
<br />

        und Maschinen selbst.
</h1>
<p className="max-w-xl text-base sm:text-lg text-neutral-200">

        Physisch planen, digital weiterarbeiten.

        LayGrid macht Betriebsplanung klar und greifbar

        von der Idee bis zur Umsetzung.
</p>
<div className="flex flex-wrap gap-3 pt-2">
<Link

          href="/produkt"

          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-[#FF6037] text-black hover:bg-[#733635] transition-colors"
>

          Mehr erfahren
</Link>
<Link

          href="/kontakt"

          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium border border-white/40 text-white hover:bg-white/10 transition-colors"
>

          Demo anfragen
</Link>
</div>
</motion.div>
</div>
</section>
 

      {/* FEATURES: kommen erst nach Scroll unterhalb des Heros */}
<section id="features" className="bg-black border-t border-white/5">
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
<motion.div

            initial={{ opacity: 0, y: 24 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true, amount: 0.3 }}

            transition={{ duration: 0.6, ease: "easeOut" }}

            className="grid gap-6 md:grid-cols-3"
>
<FeatureCard

              title="Schneller Start"

              text="Wir vermessen Ihre Maschinen, fertigen 3D-Bauklötze im Massstab und legen gemeinsam den Grundriss an – vom ersten Workshop bis zur Freigabe."

            />
<FeatureCard

              title="Eigenständig planen"

              text="Sie platzieren Anlagen wie auf einem Spielbrett, testen Varianten und passen Layouts ohne lange externe Beratungsschleifen an."

            />
<FeatureCard

              title="Teilen & Übergabe"

              text="Exportieren Sie Ergebnisse für Partner, interne Dokumentation oder spätere BIM-Schritte – klar nachvollziehbar und versionierbar."

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
<h3 className="text-base sm:text-lg font-semibold mb-3">{title}</h3>
<p className="text-sm sm:text-base text-neutral-200 leading-relaxed">

        {text}
</p>
</div>

  );

}
 