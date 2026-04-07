"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { StickyNote, Link2, Link2Off, GripHorizontal } from "lucide-react";
import { NoteItem } from "./NoteItem";
import type { Note, DateRange } from "@/types/calendar";

// ─────────────────────────────────────────────
// NotesDrawer — Mobile bottom sheet for notes
// Pull-up handle with drag gesture.
// Snap points: collapsed, half, full.
// ─────────────────────────────────────────────

interface NotesDrawerProps {
  notes: Note[];
  selectedRange: DateRange;
  onAddNote: (note: Omit<Note, "id" | "createdAt">) => void;
  onDeleteNote: (id: string) => void;
}

type SnapPoint = "collapsed" | "half" | "full";

const SNAP_HEIGHTS: Record<SnapPoint, string> = {
  collapsed: "60px",
  half: "50vh",
  full: "85vh",
};

const SNAP_Y: Record<SnapPoint, number> = {
  collapsed: 0,
  half: -1, // computed dynamically
  full: -2,
};

export function NotesDrawer({
  notes,
  selectedRange,
  onAddNote,
  onDeleteNote,
}: NotesDrawerProps) {
  const [snap, setSnap] = useState<SnapPoint>("collapsed");
  const [text, setText] = useState("");
  const [linkToRange, setLinkToRange] = useState(false);
  const dragControls = useDragControls();

  const hasSelection = selectedRange.start && selectedRange.end;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      if (velocity < -300 || offset < -100) {
        // Swiped up
        setSnap((prev) =>
          prev === "collapsed" ? "half" : prev === "half" ? "full" : "full"
        );
      } else if (velocity > 300 || offset > 100) {
        // Swiped down
        setSnap((prev) =>
          prev === "full" ? "half" : prev === "half" ? "collapsed" : "collapsed"
        );
      }
    },
    []
  );

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
    <motion.div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30
                 rounded-t-2xl bg-[var(--paper-bg)] calendar-shadow
                 flex flex-col overflow-hidden"
      animate={{ height: SNAP_HEIGHTS[snap] }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      id="notes-drawer"
    >
      {/* Drag handle */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="flex items-center justify-center py-2.5 cursor-grab active:cursor-grabbing"
        onClick={() =>
          setSnap((prev) => (prev === "collapsed" ? "half" : "collapsed"))
        }
      >
        <GripHorizontal
          size={20}
          className="text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 border-b border-[var(--paper-border)]">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-[var(--accent-color)]" strokeWidth={1.5} />
          <h3
            className="text-base font-normal text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
          >
            Notes
          </h3>
          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--paper-bg-dark)] px-1.5 py-0.5 rounded-full">
            {notes.length}
          </span>
        </div>
      </div>

      {/* Content (only visible when expanded) */}
      {snap !== "collapsed" && (
        <>
          {/* Notes list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar ruled-paper">
            <AnimatePresence>
              {notes.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[var(--text-muted)] text-xs py-8 px-4 pl-12"
                >
                  No notes yet. Add one below.
                </motion.p>
              ) : (
                notes.map((note) => (
                  <NoteItem key={note.id} note={note} onDelete={onDeleteNote} />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Add note form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[var(--paper-border)] p-4 space-y-2"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a note..."
              rows={2}
              className="w-full resize-none text-sm bg-transparent border border-[var(--paper-border)]
                         rounded-lg px-3 py-2 text-[var(--text-primary)]
                         placeholder:text-[var(--text-muted)]
                         focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              id="drawer-note-textarea"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLinkToRange(!linkToRange)}
                disabled={!hasSelection}
                className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md
                           transition-colors ${
                             linkToRange && hasSelection
                               ? "text-[var(--accent-color)] bg-[var(--accent-color-10)]"
                               : "text-[var(--text-muted)]"
                           } ${!hasSelection ? "opacity-40" : ""}`}
                id="drawer-toggle-link"
              >
                {linkToRange ? <Link2 size={12} /> : <Link2Off size={12} />}
                Link to selection
              </button>

              <button
                type="submit"
                disabled={!text.trim()}
                className="text-xs px-4 py-1.5 rounded-lg
                           bg-[var(--accent-color)] text-[var(--text-inverse)]
                           hover:opacity-90 disabled:opacity-40"
                id="drawer-btn-add"
              >
                Add
              </button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}
