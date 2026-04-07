"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { format, isToday, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// DayCell — Individual day in the calendar grid
// Handles visual states: today, selected start/end,
// in-range, important, other-month. 2px hover lift.
// ─────────────────────────────────────────────

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isImportant: boolean;
  hasNotes: boolean;
  isHoverPreview: boolean;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}

export const DayCell = memo(function DayCell({
  date,
  currentMonth,
  isStart,
  isEnd,
  isInRange,
  isImportant,
  hasNotes,
  isHoverPreview,
  onClick,
  onMouseEnter,
}: DayCellProps) {
  const day = date.getDate();
  const today = isToday(date);
  const inMonth = isSameMonth(date, currentMonth);
  const dateStr = format(date, "yyyy-MM-dd");

  return (
    <motion.button
      onClick={() => onClick(date)}
      onMouseEnter={() => onMouseEnter(date)}
      className={cn(
        // Base styles — 44px min hit target for mobile
        "relative flex flex-col items-center justify-center",
        "min-h-[44px] min-w-[44px] h-12 md:h-14",
        "rounded-lg text-sm md:text-base font-medium",
        "transition-colors duration-150 cursor-pointer select-none",
        "day-lift",

        // Default state
        inMonth
          ? "text-[var(--text-primary)]"
          : "text-[var(--text-muted)] opacity-40",

        // Today
        today && !isStart && !isEnd &&
          "ring-1 ring-[var(--accent-color)] text-[var(--accent-color)] font-semibold",

        // Selected start / end
        (isStart || isEnd) &&
          "bg-[var(--accent-color)] text-[var(--text-inverse)] font-semibold shadow-md",

        // In-range (the bridge between start and end)
        isInRange && !isStart && !isEnd &&
          "bg-[var(--accent-color-10)]",

        // Hover preview for range extension
        isHoverPreview && !isStart && !isEnd && !isInRange &&
          "bg-[var(--accent-color-10)] opacity-60",

        // Important marker
        isImportant && !isStart && !isEnd &&
          "ring-1 ring-amber-400/60"
      )}
      aria-label={`${format(date, "EEEE, MMMM d, yyyy")}${today ? " (today)" : ""}${isImportant ? " (important)" : ""}`}
      aria-pressed={isStart || isEnd}
      id={`day-${dateStr}`}
      data-date={dateStr}
    >
      {/* Day number */}
      <span className="relative z-10">{day}</span>

      {/* Indicator dots */}
      <div className="flex gap-0.5 mt-0.5 h-1.5">
        {isImportant && !isStart && !isEnd && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        )}
        {hasNotes && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
        )}
      </div>

      {/* Range pill start/end cap — rounded edges on the bridge */}
      {isStart && (
        <div
          className="absolute inset-y-1 left-1/2 right-0 -z-10 rounded-l-lg bg-[var(--accent-color-10)]"
          style={{ display: isInRange || isEnd ? "block" : "none" }}
        />
      )}
      {isEnd && (
        <div
          className="absolute inset-y-1 left-0 right-1/2 -z-10 rounded-r-lg bg-[var(--accent-color-10)]"
          style={{ display: isInRange || isStart ? "block" : "none" }}
        />
      )}
    </motion.button>
  );
});
