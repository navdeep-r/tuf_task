"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Star, X, Plus } from "lucide-react";
import type { RadialAction } from "@/types/calendar";

// ─────────────────────────────────────────────
// RadialMenu — Orbital quick-action menu
// Radiates from the clicked day cell with a
// staggered scale-in orbit animation.
// ─────────────────────────────────────────────

interface RadialMenuProps {
  /** The date this menu is anchored to. */
  anchorDate: Date | null;
  /** Pixel position of the anchor cell center. */
  position: { x: number; y: number } | null;
  /** Whether the menu is open. */
  isOpen: boolean;
  /** Close handler. */
  onClose: () => void;
  /** Action handler. */
  onAction: (action: RadialAction, date: Date) => void;
}

const MENU_ITEMS: { action: RadialAction; label: string; Icon: typeof FileText }[] = [
  { action: "add-note", label: "Add Note", Icon: FileText },
  { action: "mark-important", label: "Mark Important", Icon: Star },
  { action: "clear", label: "Clear", Icon: X },
  { action: "add-event", label: "Add Event", Icon: Plus },
];

/** Orbital positions: 4 items at 0°, 90°, 180°, 270° */
const ORBIT_RADIUS = 64;
const ORBIT_ANGLES = [
  -Math.PI / 2,     // top
  0,                 // right
  Math.PI / 2,      // bottom
  Math.PI,           // left
];

export function RadialMenu({
  anchorDate,
  position,
  isOpen,
  onClose,
  onAction,
}: RadialMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Close on Escape ───────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Close on click outside ────────────────
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  if (!position || !anchorDate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: blurs the calendar grid behind the menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 blur-overlay"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Radial menu container */}
          <div
            ref={menuRef}
            className="fixed z-50"
            style={{
              left: position.x,
              top: position.y,
              transform: "translate(-50%, -50%)",
            }}
            role="menu"
            aria-label="Quick actions"
          >
            {/* Center dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-3 h-3 rounded-full bg-[var(--accent-color)]"
            />

            {/* Orbital items */}
            {MENU_ITEMS.map((item, i) => {
              const angle = ORBIT_ANGLES[i];
              const targetX = Math.cos(angle) * ORBIT_RADIUS;
              const targetY = Math.sin(angle) * ORBIT_RADIUS;

              return (
                <motion.button
                  key={item.action}
                  initial={{
                    opacity: 0,
                    scale: 0.2,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: targetX,
                    y: targetY,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.2,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                             flex items-center justify-center
                             w-11 h-11 rounded-full
                             bg-[var(--paper-bg)] shadow-lg border border-[var(--paper-border)]
                             hover:bg-[var(--accent-color)] hover:text-[var(--text-inverse)]
                             text-[var(--text-secondary)]
                             transition-colors duration-150 cursor-pointer"
                  onClick={() => onAction(item.action, anchorDate)}
                  role="menuitem"
                  aria-label={item.label}
                  id={`radial-${item.action}`}
                  title={item.label}
                >
                  <item.Icon size={18} strokeWidth={1.5} />
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
