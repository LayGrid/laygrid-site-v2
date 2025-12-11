"use client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function ProduktPage() {

  return (
<div className="text-white">

   {/* HERO SECTION – Bild + Animation wie Über uns */}
<section className="relative w-full h-[55vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">

  {/* Hintergrundbild */}
<Image

    src="/prod-hero.jpg"

    alt="Produkt Hero"

    fill

    priority

    className="object-cover object-center"

  />

  {/* Overlay */}
<div className="absolute inset-0 bg-black/50" />

  {/* Animierter Inhalt */}
<div className="absolute inset-0 flex items-center justify-center px-6 text-center">
<motion.div

      initial={{ opacity: 0, y: 40 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.8, ease: "easeOut" }}

      className="max-w-3xl"
>
<h1 className="text-4xl sm:text-5xl font-bold mb-4">

        LayGrid <br /> Das modulare Planungssystem
</h1>
<p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">

        Physische Modelle kombiniert mit einem digitalen Web-Planer für klare,

        schnelle und intuitive Betriebsplanung.
</p>
</motion.div>
</div>
</section>
 
 

      {/* CONTENT SECTION */}
<section className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {/* Überblick */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}
>
<h2 className="text-3xl font-semibold mb-4">Das Produkt</h2>
<p className="text-gray-300 leading-relaxed max-w-3xl">

            LayGrid besteht aus zwei Elementen: den <strong>physischen 3D-Bausteinen</strong>

            und dem <strong>digitalen Web-Planer</strong>.

            Beide Systeme greifen nahtlos ineinander und machen Planung intuitiv,

            schnell und teamfähig.
</p>
</motion.div>

        {/* Drei Info-Blöcke */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}

          className="grid sm:grid-cols-3 gap-8"
>
<Card

            title="Physische Modelle"

            text="Masstabsgerecht, robust und ideal für Workshops. Maschinen & Layouts sofort sichtbar."

          />
<Card

            title="Digitaler Web-Planer"

            text="Raster, Snapping, Masse, STEP-Import & Export. Klar, schnell und ohne Installation."

          />
<Card

            title="Nahtlose Übergabe"

            text="Vom physischen Modell direkt in den Web-Planer. Export für Partner, Offerten & BIM."

          />
</motion.div>

        {/* Bild + Text Section – 3D Bausteine */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}

          className="border border-white/10 rounded-2xl p-10 bg-[#4B4E53]/20 backdrop-blur-sm grid md:grid-cols-2 gap-12 items-center"
>
<Image

            src="/about-1.jpg"

            alt="3D-Bausteine"

            width={700}

            height={500}

            className="rounded-xl shadow-lg"

          />
<div>
<h3 className="text-3xl font-semibold mb-4 text-white">

              Physische 3D-Bausteine
</h3>
<p className="text-gray-200 text-lg leading-relaxed">

              Wir vermessen Ihre Maschinen und fertigen masstabsgerechte Bausteine,

              die sich perfekt für Workshops und die interne Planung eignen. Entscheidungen

              werden schneller, klarer und für alle greifbar.
</p>
</div>
</motion.div>

        {/* Bild + Text Section – Web-Planer */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}

          className="border border-white/10 rounded-2xl p-10 bg-[#4B4E53]/20 backdrop-blur-sm grid md:grid-cols-2 gap-12 items-center"
>
<div>
<h3 className="text-3xl font-semibold mb-4 text-white">

              Digitaler Web-Planer
</h3>
<p className="text-gray-200 text-lg leading-relaxed">

              Der Web-Planer übernimmt automatisch das physische Layout. Dort können Sie

              Masse anpassen, Elemente drehen, STEP-Dateien importieren und den Plan

              direkt an Partner, Offerten oder BIM-Prozesse weitergeben.
</p>
</div>
<Image

            src="/about-2.jpg"

            alt="Web-Planer"

            width={700}

            height={500}

            className="rounded-xl shadow-lg"

          />
</motion.div>
</section>
</div>

  );

}

/* Reusable Card Component */

function Card({ title, text }: { title: string; text: string }) {

  return (
<div className="bg-[#4B4E53]/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
<h3 className="text-xl font-semibold mb-2">{title}</h3>
<p className="text-gray-300">{text}</p>
</div>

  );

}
 