import { CalendarApp } from "@/components/CalendarApp";

// ─────────────────────────────────────────────
// Home Page — Server Component shell
// Renders the CalendarApp client component
// within semantic HTML.
// ─────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex-1">
      <CalendarApp />
    </main>
  );
}
