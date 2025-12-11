// src/lib/motion.ts
import { Variants, Transition } from "framer-motion";

export const defaultTransition: Transition = {
  duration: 1.1,
  ease: "easeOut",
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, ...defaultTransition },
  },
};
