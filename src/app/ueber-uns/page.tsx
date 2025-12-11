"use client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function AboutPage() {

  return (
<div className="text-white">

      {/* HERO SECTION */}
<section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
<Image

          src="/about-hero.jpg"

          alt="Über uns"

          fill

          className="object-cover opacity-60"

          priority

        />
<motion.div

          initial={{ opacity: 0, y: 40 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.8 }}

          className="relative z-10 max-w-3xl text-center px-4"
>
<h1 className="text-4xl sm:text-6xl font-bold">

            Wir machen Betriebsplanung greifbar.
</h1>
<p className="mt-4 text-lg text-gray-200">

            LayGrid verbindet physische Bausteine mit einem klaren Web-Planer,

            damit KMU schnell, verständlich und selbstständig planen können.
</p>
</motion.div>
</section>

      {/* CONTENT SECTION */}
<section className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {/* Mission */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}
>
<h2 className="text-3xl font-semibold mb-4">Unsere Mission</h2>
<p className="text-gray-300 leading-relaxed max-w-3xl">

            Planung muss verständlich, kollaborativ und schnell sein. 

            Mit LayGrid ermöglichen wir es KMU, ihre Betriebsflächen selbstständig zu gestalten – 

            ohne komplexe Tools oder lange Beratungsprozesse.
</p>
</motion.div>

        {/* Drei moderne Info-Blöcke */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}

          className="grid sm:grid-cols-3 gap-8"
>
<Card

            title="Einfach statt kompliziert"

            text="Physische Bauklötze und ein klarer Web-Planer schaffen Transparenz statt Überforderung."

          />
<Card

            title="Gemeinsam planen"

            text="Teams sehen dieselben Modelle – physisch und digital. Das beschleunigt Entscheidungen enorm."

          />
<Card

            title="Von der Idee bis zur Umsetzung"

            text="Modelle werden digital übernommen und können direkt für Partner, Offerten oder BIM genutzt werden."

          />
</motion.div>

        {/* Bild + Text Section */}
<motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7 }}

          className="grid md:grid-cols-2 gap-12 items-center"
>
<Image

            src="/about-1-1.jpeg"

            alt="Bauklötze"

            width={600}

            height={400}

            className="rounded-lg shadow-lg"

          />
<div>
<h3 className="text-2xl font-semibold mb-4">Warum LayGrid?</h3>
<p className="text-gray-300 leading-relaxed">

              Viele KMU kämpfen mit unübersichtlichen Plänen, schlecht

              dokumentierten Änderungen und fehlendem Überblick.  

              LayGrid bringt Ordnung in diesen Prozess und schafft ein System, das jeder versteht.
</p>
</div>
</motion.div>
</section>
</div>

  );

}

function Card({ title, text }: { title: string; text: string }) {

  return (
<div className="bg-[#4B4E53]/30 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
<h3 className="text-xl font-semibold mb-2">{title}</h3>
<p className="text-gray-300">{text}</p>
</div>

  );

}
 