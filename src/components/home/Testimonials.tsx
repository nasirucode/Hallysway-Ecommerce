"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Aisha M.",
    location: "Maiduguri",
    quote:
      "The signature blend is now part of my morning routine. So warm, so smooth — and the packaging is gorgeous.",
    rating: 5
  },
  {
    name: "Tunde A.",
    location: "Lagos",
    quote:
      "The Spicy Chilli Tanji is dangerously addictive! Perfect on grilled fish and suya. Shipped in just two days.",
    rating: 5
  },
  {
    name: "Hauwa S.",
    location: "Abuja",
    quote:
      "Ordered the wellness kit for my mum. The ginger and honey combination is everything. Real, honest products.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 text-white">
      <div className="absolute inset-0 opacity-30 bg-grain" />
      <div className="container relative">
        <div className="max-w-2xl">
          <span className="eyebrow text-brand-red">Loved by sippers</span>
          <h2 className="mt-3 h-display text-4xl lg:text-5xl text-white text-balance">
            Real stories from our community.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur"
            >
              <Quote className="absolute -top-4 left-6 h-9 w-9 text-brand-red" />
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <blockquote className="mt-3 text-lg leading-relaxed text-white/90">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-red font-display text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{r.name}</p>
                  <p className="text-xs text-white/60">{r.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
