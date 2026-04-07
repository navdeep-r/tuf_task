import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// ─────────────────────────────────────────────
// Fonts
// Inter: body text — clean, modern sans-serif
// Instrument Serif: headings — editorial feel
// ─────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Instrument Serif isn't in next/font/google for all versions,
// so we use a variable font via Google Fonts CDN as a fallback.
// If available via next/font/google, swap this out.
const instrumentSerif = localFont({
  src: [
    {
      path: "../fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Calendar — Editorial Collection",
  description:
    "An interactive editorial calendar that feels like a high-end physical artifact. Built with Next.js, Three.js, and Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Inline SVG noise filter — referenced by .paper-texture via filter: url(#paper-noise) */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="paper-noise" x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
          </defs>
        </svg>

        {children}
      </body>
    </html>
  );
}
