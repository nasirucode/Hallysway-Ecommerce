"use client";

import Image from "next/image";
import Link from "next/link";

export function Logo({ small = false, light = false }: { small?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span
        className={`relative ${small ? "h-8 w-8" : "h-10 w-10"} grid place-items-center rounded-xl bg-white shadow-sm overflow-hidden`}
        aria-hidden
      >
        <Image src="/brand/logo.png" alt="Hally's Way" width={64} height={64} className="object-contain" />
      </span>
      <span className="leading-none">
        <span className={`block font-display ${small ? "text-base" : "text-lg"} ${light ? "text-white" : "text-brand-navy"} tracking-tight`}>
          Hally&apos;s Way
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.28em] ${light ? "text-white/70" : "text-brand-red"}`}>
          Concept
        </span>
      </span>
    </Link>
  );
}
