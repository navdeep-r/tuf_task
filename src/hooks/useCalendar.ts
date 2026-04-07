"use client";

import { useState, useEffect, useCallback } from "react";
import { addMonths, subMonths, format } from "date-fns";
import type { Note, DateRange } from "@/types/calendar";

// ─────────────────────────────────────────────
// useCalendar — Central state management hook
// ─────────────────────────────────────────────

const STORAGE_KEY_NOTES = "calendar_notes";
const STORAGE_KEY_IMPORTANT = "calendar_important_dates";

/** Serialize dates in notes for localStorage. */
function serializeNotes(notes: Note[]): string {
  return JSON.stringify(notes);
}

/** Deserialize notes from localStorage, reviving Date objects. */
function deserializeNotes(raw: string): Note[] {
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((n: Record<string, unknown>) => ({
      ...n,
      dateRange: n.dateRange
        ? {
            start: new Date((n.dateRange as Record<string, string>).start),
            end: (n.dateRange as Record<string, string>).end
              ? new Date((n.dateRange as Record<string, string>).end)
              : null,
          }
        : undefined,
      date: n.date ? new Date(n.date as string) : undefined,
    }));
  } catch {
    return [];
  }
}

export function useCalendar() {
  // ── Month navigation ──────────────────────
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ── Date range selection ──────────────────
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: new Date(),
    end: null,
  });

  // ── Notes ─────────────────────────────────
  const [notes, setNotes] = useState<Note[]>([]);

  // ── Important dates ───────────────────────
  const [importantDates, setImportantDates] = useState<string[]>([]);

  // ── Accent color (from hero image) ────────
  const [accentColor, setAccentColor] = useState("#8B6F47");

  // ── Hydrate from localStorage ─────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
    if (savedNotes) {
      setNotes(deserializeNotes(savedNotes));
    }

    const savedImportant = localStorage.getItem(STORAGE_KEY_IMPORTANT);
    if (savedImportant) {
      try {
        setImportantDates(JSON.parse(savedImportant));
      } catch {
        /* ignore corrupt data */
      }
    }
  }, []);

  // ── Persist notes ─────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_NOTES, serializeNotes(notes));
  }, [notes]);

  // ── Persist important dates ───────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_IMPORTANT, JSON.stringify(importantDates));
  }, [importantDates]);

  // ── Month navigation ─────────────────────
  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  // ── Date selection ────────────────────────
  const selectDate = useCallback(
    (date: Date) => {
      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        // Start a new selection
        setSelectedRange({ start: date, end: null });
      } else if (date < selectedRange.start) {
        // If the new click is before the start, swap
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        // Complete the range
        setSelectedRange({ ...selectedRange, end: date });
      }
    },
    [selectedRange]
  );

  const clearSelection = useCallback(() => {
    setSelectedRange({ start: new Date(), end: null });
  }, []);

  // ── Notes CRUD ────────────────────────────
  const addNote = useCallback((note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (date: Date): Note[] => {
      const dateStr = format(date, "yyyy-MM-dd");
      return notes.filter((n) => {
        if (n.date && format(n.date, "yyyy-MM-dd") === dateStr) return true;
        if (n.dateRange && n.dateRange.start && n.dateRange.end) {
          return date >= n.dateRange.start && date <= n.dateRange.end;
        }
        return false;
      });
    },
    [notes]
  );

  // ── Important dates ───────────────────────
  const toggleImportant = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setImportantDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  }, []);

  const isImportant = useCallback(
    (date: Date): boolean => {
      return importantDates.includes(format(date, "yyyy-MM-dd"));
    },
    [importantDates]
  );

  return {
    // Month
    currentMonth,
    nextMonth,
    prevMonth,
    // Selection
    selectedRange,
    setSelectedRange,
    selectDate,
    clearSelection,
    // Notes
    notes,
    addNote,
    removeNote,
    getNotesForDate,
    // Important
    importantDates,
    toggleImportant,
    isImportant,
    // Accent
    accentColor,
    setAccentColor,
  };
}
