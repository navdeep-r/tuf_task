"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// MountAnimation — Staggered entry orchestrator
// Sequence: Hero drops → Binder rings scale →
// Grid unfurls vertically like a released page.
// ─────────────────────────────────────────────

interface MountAnimationProps {
  children: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/** Hero image — drops from above */
export const heroVariants = {
  hidden: {
    opacity: 0,
    y: -40,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Binder section — fades in after hero */
export const binderVariants = {
  hidden: {
    opacity: 0,
    scaleX: 0.8,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Grid — unfurls vertically like a released page */
export const gridVariants = {
  hidden: {
    opacity: 0,
    scaleY: 0,
    transformOrigin: "top center",
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "top center",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Sidebar / drawer — slides in from the side */
export const sidebarVariants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function MountAnimation({ children }: MountAnimationProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
