"use client";

import { motion, Variants } from "framer-motion";

import { ReactNode } from "react";

type Direction = "left" | "right" | "up" | "down";

const makeVariants = (dir: Direction): Variants => {

  const distance = 80; // wie weit von der Seite reinfliegen

  let x = 0;

  let y = 0;

  if (dir === "left") x = -distance;

  if (dir === "right") x = distance;

  if (dir === "up") y = -distance;

  if (dir === "down") y = distance;

  return {

    hidden: {

      opacity: 0,

      x,

      y,

    },

    visible: {

      opacity: 1,

      x: 0,

      y: 0,

    },

  };

};

interface AnimatedSectionProps {

  children: ReactNode;

  /** von wo es einfliegen soll */

  direction?: Direction;

  /** Verzögerung in Sekunden (z.B. 0.2) */

  delay?: number;

  className?: string;

}

/**

 * Wickelt Inhalt ein, damit er beim Scrollen weich von der Seite einfliegt.

 */

export function AnimatedSection({

  children,

  direction = "up",

  delay = 0,

  className,

}: AnimatedSectionProps) {

  return (
<motion.section

      className={className}

      variants={makeVariants(direction)}

      initial="hidden"

      whileInView="visible"

      viewport={{ once: true, amount: 0.3 }}

      transition={{

        duration: 0.9, // hier kannst du es langsamer / schneller machen

        ease: "easeOut",

        delay,

      }}
>

      {children}
</motion.section>

  );

}
 