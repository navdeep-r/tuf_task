// ─────────────────────────────────────────────
// Shared Types for the Editorial Calendar
// ─────────────────────────────────────────────

/** A date range with start and optional end. */
export interface DateRange {
  start: Date;
  end: Date | null;
}

/** A note that can be general or linked to a date/range. */
export interface Note {
  id: string;
  text: string;
  createdAt: string; // ISO 8601
  dateRange?: DateRange;
  date?: Date;
}

/** The actions available in the radial quick-action menu. */
export type RadialAction = "add-note" | "mark-important" | "clear" | "add-event";

/** A single item rendered in the radial orbital menu. */
export interface RadialMenuItem {
  action: RadialAction;
  label: string;
  icon: string; // Lucide icon name
}

/** The visual state of a single day cell. */
export type DayCellState =
  | "default"
  | "today"
  | "selected-start"
  | "selected-end"
  | "in-range"
  | "important"
  | "has-note"
  | "other-month";

/** Global calendar state managed by the useCalendar hook. */
export interface CalendarState {
  currentMonth: Date;
  selectedRange: DateRange;
  notes: Note[];
  importantDates: string[]; // ISO date strings (YYYY-MM-DD)
  accentColor: string;
}
