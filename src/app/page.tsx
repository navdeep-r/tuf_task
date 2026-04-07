import { CalendarApp } from "@/components/CalendarApp";

// ─────────────────────────────────────────────
// Home Page — Server Component shell
// Renders the CalendarApp client component
// within semantic HTML.
// ─────────────────────────────────────────────

export default function Home() {
  return (
    <main className="relative flex-1 min-h-screen">
      {/* Subtle Blissful Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/bg-landscape.png')" }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        <CalendarApp />
      </div>
    </main>
  );
}
