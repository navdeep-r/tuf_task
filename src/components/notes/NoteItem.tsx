"use client";

import { motion } from "framer-motion";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@/types/calendar";

// ─────────────────────────────────────────────
// NoteItem — A single note display card
// Shows the note text, linked date/range,
// creation time, and a delete button.
// ─────────────────────────────────────────────

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const createdDate = new Date(note.createdAt);
  const timeLabel = format(createdDate, "MMM d, h:mm a");

  const linkedLabel = note.dateRange?.start
    ? note.dateRange.end
      ? `${format(note.dateRange.start, "MMM d")} — ${format(note.dateRange.end, "MMM d")}`
      : format(note.dateRange.start, "MMM d")
    : note.date
      ? format(note.date, "MMM d")
      : null;

  // Stable pseudo-random rotation based on the note ID
  const hash = note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rotationClass = hash % 2 === 0 ? '-rotate-1' : 'rotate-1';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, rotate: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={`group relative mx-4 mb-3 p-3.5 pl-4 
                  bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/40
                  ${rotationClass} hover:rotate-0 transition-transform duration-300`}
    >
      {/* Note text */}
      <p className="text-[13px] md:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
        {note.text}
      </p>

      {/* Metadata row */}
      <div className="flex items-center gap-3 mt-1.5">
        {/* Timestamp */}
        <span className="text-[10px] text-[var(--text-muted)] tracking-wide">
          {timeLabel}
        </span>

        {/* Linked date badge */}
        {linkedLabel && (
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--accent-color)] bg-[var(--accent-color-10)] px-2 py-0.5 rounded-full">
            <Calendar size={10} strokeWidth={1.5} />
            {linkedLabel}
          </span>
        )}
      </div>

      {/* Delete button — appears on hover */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(note.id)}
        className="absolute top-3 right-3 p-1.5 rounded-full
                   opacity-0 group-hover:opacity-100
                   text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50
                   transition-all duration-150"
        aria-label={`Delete note: ${note.text.substring(0, 30)}`}
        id={`delete-note-${note.id}`}
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </motion.button>
    </motion.div>
  );
}
