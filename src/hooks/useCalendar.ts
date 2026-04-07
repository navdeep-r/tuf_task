import { useState, useEffect } from "react";
import { addMonths, subMonths, isSameDay } from "date-fns";

export type Note = {
  id: string;
  text: string;
  dateRange?: { start: Date; end: Date }; // if linked to a range
  date?: Date; // if linked to a single date
  isMarkedImportant?: boolean;
};

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);
  const [accentColor, setAccentColor] = useState<string>("#8B5E3C"); // fallback

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("calendar_notes");
      if (savedNotes) {
        try {
          const parsed = JSON.parse(savedNotes).map((n: any) => ({
            ...n,
            dateRange: n.dateRange ? { start: new Date(n.dateRange.start), end: new Date(n.dateRange.end) } : undefined,
            date: n.date ? new Date(n.date) : undefined,
          }));
          setNotes(parsed);
        } catch(e) {}
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("calendar_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectDate = (date: Date) => {
    // Range logic: if start is null, pick start.
    // if start is present but end is null, pick end.
    // if both present, start fresh.
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else if (date < selectedRange.start) {
       setSelectedRange({ start: date, end: selectedRange.start });
    } else {
      setSelectedRange({ ...selectedRange, end: date });
    }
  };

  const clearSelection = () => setSelectedRange({ start: null, end: null });

  const addNote = (note: Omit<Note, 'id'>) => {
    setNotes((prev) => [...prev, { ...note, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter(n => n.id !== id));
  };

  return {
    currentMonth,
    nextMonth,
    prevMonth,
    selectedRange,
    setSelectedRange,
    selectDate,
    clearSelection,
    notes,
    addNote,
    removeNote,
    accentColor,
    setAccentColor,
  };
}
