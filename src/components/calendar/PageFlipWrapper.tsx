"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// PageFlipWrapper — 3D page flip transition
// Wraps the CalendarGrid in a preserve-3d
// container. On month change, the outgoing grid
// rotates out and the incoming grid flips in.
// ─────────────────────────────────────────────

interface PageFlipWrapperProps {
  /** Unique key per month (triggers animation). */
  monthKey: string;
  children: ReactNode;
}

const flipVariants = {
  initial: {
    rotateX: 90,
    opacity: 0,
    transformOrigin: "center top",
  },
  animate: {
    rotateX: 0,
    opacity: 1,
    transformOrigin: "center top",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    rotateX: -90,
    opacity: 0,
    transformOrigin: "center top",
    transition: {
      duration: 0.3,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

export function PageFlipWrapper({ monthKey, children }: PageFlipWrapperProps) {
  return (
    <div className="perspective-container relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          variants={flipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
