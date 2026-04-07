"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// MonthHeader — Month/Year title with nav
// Editorial serif typography with subtle
// parallax offset on the title text.
// ─────────────────────────────────────────────

interface MonthHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthHeader({ currentMonth, onPrev, onNext }: MonthHeaderProps) {
  const monthName = format(currentMonth, "MMMM");
  const year = format(currentMonth, "yyyy");

  return (
    <div className="flex items-center justify-between px-6 py-5">
      {/* Previous month button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="flex items-center justify-center w-10 h-10 rounded-full
                   hover:bg-[var(--accent-color-10)] transition-colors duration-200
                   text-[var(--text-secondary)]"
        aria-label="Previous month"
        id="btn-prev-month"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </motion.button>

      {/* Month + Year title */}
      <motion.div
        key={`${monthName}-${year}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-center select-none"
      >
        <h2
          className="text-3xl md:text-4xl font-normal tracking-wide text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
        >
          {monthName}
        </h2>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mt-0.5">
          {year}
        </p>
      </motion.div>

      {/* Next month button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="flex items-center justify-center w-10 h-10 rounded-full
                   hover:bg-[var(--accent-color-10)] transition-colors duration-200
                   text-[var(--text-secondary)]"
        aria-label="Next month"
        id="btn-next-month"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}
