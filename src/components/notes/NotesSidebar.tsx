"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Link2, Link2Off } from "lucide-react";
import { NoteItem } from "./NoteItem";
import { sidebarVariants } from "@/components/ui/MountAnimation";
import type { Note, DateRange } from "@/types/calendar";

// ─────────────────────────────────────────────
// NotesSidebar — Desktop notes panel
// Ruled-paper background. Supports general notes
// and notes linked to the selected date range.
// ─────────────────────────────────────────────

interface NotesSidebarProps {
  notes: Note[];
  selectedRange: DateRange;
  onAddNote: (note: Omit<Note, "id" | "createdAt">) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSidebar({
  notes,
  selectedRange,
  onAddNote,
  onDeleteNote,
}: NotesSidebarProps) {
  const [text, setText] = useState("");
  const [linkToRange, setLinkToRange] = useState(false);
  const [filter, setFilter] = useState<"all" | "selection">("all");

  const hasSelection = selectedRange.start && selectedRange.end;

  // ── Filter notes ──────────────────────────
  const filteredNotes =
    filter === "all"
      ? notes
      : notes.filter((n) => {
          if (!n.dateRange || !n.dateRange.start || !selectedRange.start || !selectedRange.end) return false;
          return (
            n.dateRange.start >= selectedRange.start &&
            (n.dateRange.end ? n.dateRange.end <= selectedRange.end : true)
          );
        });

  // ── Submit handler ────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim()) return;

      const note: Omit<Note, "id" | "createdAt"> = {
        text: text.trim(),
        ...(linkToRange && hasSelection
          ? { dateRange: { start: selectedRange.start!, end: selectedRange.end } }
          : {}),
      };

      onAddNote(note);
      setText("");
    },
    [text, linkToRange, hasSelection, selectedRange, onAddNote]
  );

  return (
    <motion.aside
      variants={sidebarVariants}
      className="hidden lg:flex flex-col w-[var(--sidebar-width)] min-h-[500px]
                 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)]
                 bg-[var(--paper-bg)]/70 backdrop-blur-2xl border border-white/40"
      id="notes-sidebar"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <StickyNote size={16} className="text-[var(--accent-color)]" strokeWidth={1.5} />
          <h3
            className="text-lg font-normal text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
          >
            Notes
          </h3>
        </div>

        {/* Filter toggle */}
        <div className="flex gap-1 bg-[var(--paper-bg-dark)] rounded-lg p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={`text-[10px] px-2.5 py-1 rounded-md transition-colors ${
              filter === "all"
                ? "bg-[var(--paper-bg)] shadow-sm text-[var(--text-primary)]"
                : "text-[var(--text-muted)]"
            }`}
            id="filter-all"
          >
            All
          </button>
          <button
            onClick={() => setFilter("selection")}
            className={`text-[10px] px-2.5 py-1 rounded-md transition-colors ${
              filter === "selection"
                ? "bg-[var(--paper-bg)] shadow-sm text-[var(--text-primary)]"
                : "text-[var(--text-muted)]"
            }`}
            id="filter-selection"
            disabled={!hasSelection}
          >
            Selection
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar linen-texture py-2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--paper-bg)]/40 to-transparent pointer-events-none h-8 z-10" />
        <AnimatePresence>
          {filteredNotes.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[var(--text-muted)] text-xs py-12 px-4 pl-12"
            >
              {filter === "selection"
                ? "No notes for this date range."
                : "No notes yet. Add one below."}
            </motion.p>
          ) : (
            filteredNotes.map((note) => (
              <NoteItem key={note.id} note={note} onDelete={onDeleteNote} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add note form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 pt-3 space-y-3 bg-gradient-to-t from-[var(--paper-bg)]/80 to-transparent"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          rows={2}
          className="w-full resize-none text-[13px] md:text-sm bg-white/50 backdrop-blur-sm
                     border border-white/50 shadow-inner
                     rounded-xl px-4 py-3 text-[var(--text-primary)]
                     placeholder:text-[var(--text-muted)]
                     focus:outline-none focus:bg-white/80 focus:ring-1 focus:ring-[var(--accent-color)]/30
                     transition-all duration-200"
          id="note-textarea"
        />
        <div className="flex items-center justify-between">
          {/* Link to selection toggle */}
          <button
            type="button"
            onClick={() => setLinkToRange(!linkToRange)}
            disabled={!hasSelection}
            className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md
                       transition-colors ${
                         linkToRange && hasSelection
                           ? "text-[var(--accent-color)] bg-[var(--accent-color-10)]"
                           : "text-[var(--text-muted)]"
                       } ${!hasSelection ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            id="toggle-link-range"
          >
            {linkToRange ? <Link2 size={12} /> : <Link2Off size={12} />}
            Link to selection
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim()}
            className="text-xs px-4 py-1.5 rounded-lg
                       bg-[var(--accent-color)] text-[var(--text-inverse)]
                       hover:opacity-90 disabled:opacity-40
                       transition-opacity duration-150"
            id="btn-add-note"
          >
            Add
          </button>
        </div>
      </form>
    </motion.aside>
  );
}
