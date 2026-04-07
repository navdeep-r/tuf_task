"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// SpiralBinder — Wire-ring binder visual
// Emulates the top spiral binding of a physical
// wall calendar using staggered rounded divs.
// ─────────────────────────────────────────────

interface SpiralBinderProps {
  /** Number of rings to display. Default 14. */
  ringCount?: number;
}

const ringVariants = {
  hidden: {
    scaleY: 0,
    opacity: 0,
  },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      delay: 0.4 + i * 0.04, // staggered after hero drops
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function SpiralBinder({ ringCount = 14 }: SpiralBinderProps) {
  return (
    <div className="relative w-full flex items-center justify-center py-3 z-10">
      {/* Shadow line behind the rings */}
      <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.08)] to-transparent -translate-y-1/2" />

      {/* Wire rings */}
      <div className="flex items-center justify-between w-full px-6">
        {Array.from({ length: ringCount }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={ringVariants}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center"
            style={{ transformOrigin: "center bottom" }}
          >
            {/* Top arc (above the "paper edge") */}
            <div
              className="w-[14px] h-[18px] rounded-t-full border-2 border-b-0"
              style={{
                borderColor: "#9A9A9A",
                background: "linear-gradient(180deg, #C0C0C0 0%, #A0A0A0 100%)",
              }}
            />
            {/* Bottom stub (below paper, hidden by paper) */}
            <div
              className="w-[14px] h-[6px] border-2 border-t-0 rounded-b-sm"
              style={{
                borderColor: "#888",
                background: "#999",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
