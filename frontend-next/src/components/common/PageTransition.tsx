"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 8 },
  enter: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.25, ease },
  },
  exit: {
    opacity: 0, scale: 0.98,
    transition: { duration: 0.15, ease },
  },
};

const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
