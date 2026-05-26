"use client";

import { Leaf } from "lucide-react";

const words = [
  "Tea Blends",
  "Spicy Tanji",
  "Catering",
  "Wellness",
  "Honey & Ginger",
  "Hand-mixed",
  "100% Natural",
  "Award winning"
];

export function Marquee() {
  return (
    <section aria-label="Highlights" className="border-y border-brand-navy/10 bg-brand-navy text-white">
      <div className="flex overflow-hidden">
        <div className="flex min-w-full shrink-0 items-center justify-around gap-12 animate-marquee py-5">
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap font-display text-lg sm:text-2xl">
              {w}
              <Leaf className="h-4 w-4 text-brand-red" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
