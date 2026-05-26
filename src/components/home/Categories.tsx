"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Category } from "@/lib/erpnext/types";

export function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="container py-20">
      <SectionHeader
        eyebrow="Shop by category"
        title="A pantry of natural goodness"
        description="From slow-steeped herbal infusions to fiery Tanji and ready-to-serve catering packs — find your ritual."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link
              href={`/shop?category=${c.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-brand-navy text-white"
            >
              <Image
                src={c.image || "/products/hally-tea-blend.jpg"}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-5">
                <span className="pill bg-white/10 border-white/20 text-white">{c.count ?? "Shop"}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight">{c.name}</h3>
                  <p className="mt-1 text-sm text-white/75 line-clamp-2">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                    Explore
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
