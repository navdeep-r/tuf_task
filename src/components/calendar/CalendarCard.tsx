"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { HeroParallax } from "./HeroParallax";
import { SpiralBinder } from "./SpiralBinder";
import { MonthHeader } from "./MonthHeader";
import { CalendarGrid } from "./CalendarGrid";
import { PageFlipWrapper } from "./PageFlipWrapper";
import {
  heroVariants,
  binderVariants,
  gridVariants,
} from "@/components/ui/MountAnimation";
import type { DateRange, Note } from "@/types/calendar";

// ─────────────────────────────────────────────
// CalendarCard — The "wall calendar" container
// Composes: Hero → Binder → MonthHeader → Grid
// Paper texture background with multi-layer
// shadow for depth. preserve-3d for page flip.
// ─────────────────────────────────────────────

interface CalendarCardProps {
  currentMonth: Date;
  selectedRange: DateRange;
  importantDates: string[];
  notes: Note[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (date: Date) => void;
  onDayAction: (date: Date) => void;
  onColorExtracted: (color: string) => void;
  isImportant: (date: Date) => boolean;
  getNotesForDate: (date: Date) => Note[];
}

export function CalendarCard({
  currentMonth,
  selectedRange,
  importantDates,
  notes,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onDayAction,
  onColorExtracted,
  isImportant,
  getNotesForDate,
}: CalendarCardProps) {
  const monthKey = format(currentMonth, "yyyy-MM");

  return (
    <div className="w-full max-w-[700px] mx-auto">
      {/* Hero image with parallax */}
      <motion.div variants={heroVariants}>
        <HeroParallax
          imageSrc="/hero.png"
          onColorExtracted={onColorExtracted}
        />
      </motion.div>

      {/* Spiral binder */}
      <motion.div variants={binderVariants}>
        <div className="paper-texture calendar-shadow rounded-b-2xl overflow-hidden">
          <SpiralBinder ringCount={14} />

          {/* Month header */}
          <MonthHeader
            currentMonth={currentMonth}
            onPrev={onPrevMonth}
            onNext={onNextMonth}
          />

          {/* Divider line */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[var(--paper-border)] to-transparent" />

          {/* Calendar grid with page flip animation */}
          <motion.div variants={gridVariants}>
            <PageFlipWrapper monthKey={monthKey}>
              <CalendarGrid
                currentMonth={currentMonth}
                selectedRange={selectedRange}
                importantDates={importantDates}
                notes={notes}
                onDayClick={onDayClick}
                onDayAction={onDayAction}
                isImportant={isImportant}
                getNotesForDate={getNotesForDate}
              />
            </PageFlipWrapper>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
