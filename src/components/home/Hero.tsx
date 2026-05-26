"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-6 pb-24 lg:pb-32">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[80vh] bg-grain opacity-[0.4]" />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute -left-24 top-32 -z-10 h-72 w-72 rounded-full bg-brand-red/15 blur-3xl animate-blob"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        className="absolute -right-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-brand-navy/15 blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />

      <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pill"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-red" />
            100% natural · hand-mixed in Maiduguri
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-5 font-display text-[44px] sm:text-6xl lg:text-7xl tracking-tight text-brand-navy leading-[1.02] text-balance"
          >
            Brewed with{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-red via-brand-red-600 to-brand-navy bg-clip-text text-transparent">
                intention.
              </span>
              <motion.svg
                viewBox="0 0 320 18"
                fill="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-brand-red"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                <motion.path
                  d="M3 14 C 80 4, 160 4, 240 10 S 312 14, 317 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
            <br />
            Sipped with joy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-brand-navy/70"
          >
            Discover Hally&apos;s Way signature tea blends, fiery Tanji spice and wellness rituals — crafted in small batches and delivered to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/shop" className="btn-primary group">
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="btn-ghost">
              Our story
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-md"
          >
            {[
              { v: "12k+", k: "Happy cups" },
              { v: "100%", k: "Natural" },
              { v: "Award", k: "Best Entrepreneur" }
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-2xl text-brand-navy">{s.v}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-brand-navy/60">{s.k}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative h-[460px] sm:h-[520px] lg:h-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="absolute left-0 top-6 h-[380px] w-[78%] rounded-[28px] bg-white shadow-soft overflow-hidden"
          >
            <Image
              src="/lifestyle/steaming-tea.jpg"
              alt="Hot tea cup"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5 text-white">
              <p className="eyebrow text-white/80">Signature</p>
              <p className="font-display text-2xl leading-tight">Hally&apos;s Tea Blend</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="absolute right-0 bottom-0 h-[300px] w-[60%] rounded-[28px] bg-white shadow-soft overflow-hidden"
          >
            <Image
              src="/products/hally-tea-blend.jpg"
              alt="Hally's tea blend packs"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur p-3 pr-5 shadow-soft"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tea/15 text-brand-tea">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-brand-navy/60">Plant-based</p>
              <p className="font-display text-base text-brand-navy">Botanical blends</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 200 }}
            className="absolute right-4 top-10 flex items-center gap-3 rounded-2xl bg-brand-navy text-white p-3 pr-5 shadow-soft"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <ShieldCheck className="h-5 w-5 text-brand-red" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">NAFDAC</p>
              <p className="font-display text-base">Quality certified</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
