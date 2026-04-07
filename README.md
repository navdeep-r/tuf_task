# Editorial Calendar Concept

A high-fidelity, interactive web calendar designed to feel like a premium physical artifact. This application moves away from standard functional SaaS UI and introduces materiality, serene aesthetics, and engaging micro-interactions.

## Overview

The **Editorial Calendar** bridges the gap between digital utility and physical presence. Built around an atmospheric, parallax-driven landscape header, the calendar grid feels like textured physical paper suspended on a wire spiral binder. Every interaction—from flipping months to tagging important dates—is coupled with fluid physics-based motion.

A secondary notes system acts as a digital scratchpad, seamlessly interacting with the selected dates without breaking immersion.

### Key Features
- **Tactile Materiality:** Emulates a physical wall calendar using SVG noise filters, soft multi-layered shadows, and crisp editorial typography (Instrument Serif).
- **Parallax Hero Interface:** A Three.js driven header creates an immersive 3D parallax effect that tracks mouse movement (desktop) and scroll position (mobile).
- **Intelligent Date Selection:** Stable date range selection logic leveraging core `date-fns` math, featuring hover-preview bridges and multi-tap range extension.
- **Orbital Radial Menu:** Contextual actions (Add Note, Mark Important, Select Range, Clear) are revealed through an orbital pop-up menu that appears precisely at the point of interaction.
- **Notes System & Persistence:** Tactile note cards synced automatically via `localStorage`. Notes can be general memos or bound specifically to date ranges.
- **3D Page Flips:** Swapping between months executes a hardware-accelerated 3D page flip animation utilizing CSS `preserve-3d`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (with native CSS custom properties and inline `@theme`)
- **Animation:** Framer Motion (Orchestration, Layout Transitions, Gestures)
- **3D & Parallax:** Three.js
- **Date Math:** `date-fns`
- **Icons:** Lucide React
- **State Management:** React Hooks (`useCalendar` custom hook synced with `localStorage`)

---

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx         # Root HTML, Fonts, and SVG Noise filter injection
│   ├── page.tsx           # Home container with immersive background
│   └── globals.css        # Core design tokens, textures, and keyframes
├── components/
│   ├── calendar/          # Grid logic, Day Cells, Spiral Binder, Parallax Header
│   ├── notes/             # Sidebar, Mobile Drawer, and Note Items
│   ├── ui/                # Shared Mount orchestrators and animations
│   └── CalendarApp.tsx    # Primary composition and state orchestrator
├── hooks/
│   └── useCalendar.ts     # Central state (selections, notes) & localStorage sync
├── lib/
│   ├── utils.ts           # clsx / tailwind-merge helper
│   └── colorExtractor.ts  # Canvas-based dominant color extraction
└── types/                 # Pure TypeScript definitions
```

---

## Getting Started

### Prerequisites
- Node.js (v18.x or above)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/navdeep-r/tuf_task.git
   cd tuf_task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## Design Decisions

### Why Texture over Flat Design?
Modern digital tools often prioritize aggressive functional minimalism. By injecting subtle imperfections—like the generated SVG fractal noise (`feTurbulence`) mapped across the `.paper-texture`—the interface lowers visual fatigue and introduces warmth.

### Responsive UX
- **Desktop:** Features a wide, fixed calendar card with a side-by-side persistent notes sidebar.
- **Mobile:** Replaces the sidebar with a fluid, bottom-sheet style drag drawer (`NotesDrawer.tsx`) to maximize screen property for the physical calendar object.

### Animation Philosophy
Animations are explicitly constructed using custom easing curves (`[0.22, 1, 0.36, 1]`) instead of standard linear transitions. This replicates the snapping physics of flipping heavy paper or dropping a physical object onto a desk.

---

## Future Enhancements
- **Color Extraction:** Extend the `extractDominantColor` hook to completely re-theme the accent variables dynamically based on a user-uploaded hero image.
- **Cloud Sync:** Map the localized `useCalendar` hook state to a user-authenticated remote database (e.g., Supabase or Firebase).
- **Time Zones:** Add explicit time zone awareness for globally distributed teams planning editorial events across dates.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
