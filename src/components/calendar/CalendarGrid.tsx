"use client";

import { useState, useCallback, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  format,
} from "date-fns";
import { DayCell } from "./DayCell";
import type { DateRange, Note } from "@/types/calendar";

// ─────────────────────────────────────────────
// CalendarGrid — 7-column date grid
// Handles range selection with hover preview.
// Grid remains 100% stable — no parallax.
// ─────────────────────────────────────────────

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentMonth: Date;
  selectedRange: DateRange;
  importantDates: string[];
  notes: Note[];
  onDayClick: (date: Date) => void;
  onDayAction: (date: Date) => void; // triggers radial menu
  isImportant: (date: Date) => boolean;
  getNotesForDate: (date: Date) => Note[];
}

export function CalendarGrid({
  currentMonth,
  selectedRange,
  onDayClick,
  onDayAction,
  isImportant,
  getNotesForDate,
}: CalendarGridProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // ── Compute the 6-row grid of dates ───────
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // ── Check if a date is in the selected range ─
  const isInRange = useCallback(
    (date: Date): boolean => {
      if (!selectedRange.start || !selectedRange.end) return false;
      return isWithinInterval(date, {
        start: selectedRange.start,
        end: selectedRange.end,
      });
    },
    [selectedRange]
  );

  // ── Check if date is in hover preview range ─
  const isHoverPreview = useCallback(
    (date: Date): boolean => {
      if (!selectedRange.start || selectedRange.end || !hoveredDate) return false;
      const start = selectedRange.start;
      const end = hoveredDate;
      if (end <= start) return false;
      return isWithinInterval(date, { start, end });
    },
    [selectedRange, hoveredDate]
  );

  // ── Handle day click — single click opens radial ─
  const handleDayClick = useCallback(
    (date: Date) => {
      onDayAction(date);
    },
    [onDayAction]
  );

  const handleMouseEnter = useCallback((date: Date) => {
    setHoveredDate(date);
  }, []);

  return (
    <div className="px-4 md:px-6 pb-6" id="calendar-grid">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] md:text-xs font-medium tracking-[0.15em] uppercase text-[var(--text-muted)] py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div
        className="grid grid-cols-7 gap-1"
        onMouseLeave={() => setHoveredDate(null)}
      >
        {days.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isStart = selectedRange.start
            ? isSameDay(date, selectedRange.start)
            : false;
          const isEnd =
            selectedRange.end ? isSameDay(date, selectedRange.end) : false;

          return (
            <DayCell
              key={dateStr}
              date={date}
              currentMonth={currentMonth}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={isInRange(date)}
              isImportant={isImportant(date)}
              hasNotes={getNotesForDate(date).length > 0}
              isHoverPreview={isHoverPreview(date)}
              onClick={handleDayClick}
              onMouseEnter={handleMouseEnter}
            />
          );
        })}
      </div>
    </div>
  );
}
