"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useCalendar } from "@/hooks/useCalendar";
import { CalendarCard } from "@/components/calendar/CalendarCard";
import { RadialMenu } from "@/components/calendar/RadialMenu";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NotesDrawer } from "@/components/notes/NotesDrawer";
import { MountAnimation } from "@/components/ui/MountAnimation";
import type { RadialAction } from "@/types/calendar";

// ─────────────────────────────────────────────
// CalendarApp — Top-level client component
// Composes everything: Calendar + Notes + Radial.
// Manages global state via useCalendar hook.
// Sets --accent-color CSS variable dynamically.
// ─────────────────────────────────────────────

export function CalendarApp() {
  const {
    currentMonth,
    nextMonth,
    prevMonth,
    selectedRange,
    selectDate,
    clearSelection,
    notes,
    addNote,
    removeNote,
    getNotesForDate,
    importantDates,
    toggleImportant,
    isImportant,
    accentColor,
    setAccentColor,
  } = useCalendar();

  // ── Radial menu state ─────────────────────
  const [radialDate, setRadialDate] = useState<Date | null>(null);
  const [radialPos, setRadialPos] = useState<{ x: number; y: number } | null>(null);
  const [radialOpen, setRadialOpen] = useState(false);

  // ── Note input for radial "Add Note" ──────
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteInputDate, setNoteInputDate] = useState<Date | null>(null);
  const [noteInputText, setNoteInputText] = useState("");
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  // ── Set accent color on document ──────────
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
    // Derive light variant
    // Parse rgb and add alpha
    const match = accentColor.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match;
      document.documentElement.style.setProperty(
        "--accent-color-light",
        `rgba(${r}, ${g}, ${b}, 0.25)`
      );
      document.documentElement.style.setProperty(
        "--accent-color-10",
        `rgba(${r}, ${g}, ${b}, 0.10)`
      );
      document.documentElement.style.setProperty(
        "--accent-color-20",
        `rgba(${r}, ${g}, ${b}, 0.20)`
      );
    }
  }, [accentColor]);

  // ── Handle day click → open radial menu ───
  const handleDayAction = useCallback((date: Date) => {
    // Find the DOM element for this day cell
    const dateStr = format(date, "yyyy-MM-dd");
    const el = document.getElementById(`day-${dateStr}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setRadialPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setRadialDate(date);
    setRadialOpen(true);
  }, []);

  // ── Handle radial menu action ─────────────
  const handleRadialAction = useCallback(
    (action: RadialAction, date: Date) => {
      setRadialOpen(false);

      switch (action) {
        case "add-note":
          setNoteInputDate(date);
          setShowNoteInput(true);
          setTimeout(() => noteInputRef.current?.focus(), 100);
          break;

        case "mark-important":
          toggleImportant(date);
          break;

        case "clear":
          clearSelection();
          break;

        case "add-event":
          // Treat as selecting the date for a range start
          selectDate(date);
          break;
      }
    },
    [toggleImportant, clearSelection, selectDate]
  );

  // ── Submit inline note from radial ────────
  const handleNoteSubmit = useCallback(() => {
    if (!noteInputText.trim() || !noteInputDate) return;
    addNote({
      text: noteInputText.trim(),
      date: noteInputDate,
    });
    setNoteInputText("");
    setShowNoteInput(false);
    setNoteInputDate(null);
  }, [noteInputText, noteInputDate, addNote]);

  return (
    <MountAnimation>
      <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12">
        {/* Main content area */}
        <div className="w-full max-w-[var(--max-width)] flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Calendar Card */}
          <CalendarCard
            currentMonth={currentMonth}
            selectedRange={selectedRange}
            importantDates={importantDates}
            notes={notes}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onDayClick={selectDate}
            onDayAction={handleDayAction}
            onColorExtracted={setAccentColor}
            isImportant={isImportant}
            getNotesForDate={getNotesForDate}
          />

          {/* Notes Sidebar (Desktop) */}
          <NotesSidebar
            notes={notes}
            selectedRange={selectedRange}
            onAddNote={addNote}
            onDeleteNote={removeNote}
          />
        </div>

        {/* Radial Menu */}
        <RadialMenu
          anchorDate={radialDate}
          position={radialPos}
          isOpen={radialOpen}
          onClose={() => setRadialOpen(false)}
          onAction={handleRadialAction}
        />

        {/* Notes Drawer (Mobile) */}
        <NotesDrawer
          notes={notes}
          selectedRange={selectedRange}
          onAddNote={addNote}
          onDeleteNote={removeNote}
        />

        {/* Inline note input triggered by radial "Add Note" */}
        {showNoteInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowNoteInput(false)}
            />
            <div className="relative w-full max-w-md bg-[var(--paper-bg)] paper-texture rounded-xl calendar-shadow p-6 space-y-4">
              <h3
                className="text-lg text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
              >
                Add Note — {noteInputDate ? format(noteInputDate, "MMMM d") : ""}
              </h3>
              <textarea
                ref={noteInputRef}
                value={noteInputText}
                onChange={(e) => setNoteInputText(e.target.value)}
                placeholder="Write your note..."
                rows={3}
                className="w-full resize-none text-sm bg-transparent border border-[var(--paper-border)]
                           rounded-lg px-3 py-2 text-[var(--text-primary)]
                           placeholder:text-[var(--text-muted)]
                           focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                id="inline-note-textarea"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="text-xs px-4 py-1.5 rounded-lg text-[var(--text-muted)]
                             hover:bg-[var(--paper-bg-dark)] transition-colors"
                  id="btn-cancel-note"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoteSubmit}
                  disabled={!noteInputText.trim()}
                  className="text-xs px-4 py-1.5 rounded-lg
                             bg-[var(--accent-color)] text-[var(--text-inverse)]
                             hover:opacity-90 disabled:opacity-40"
                  id="btn-submit-note"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MountAnimation>
  );
}
