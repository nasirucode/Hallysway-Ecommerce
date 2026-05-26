"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Clock, GraduationCap, MoveRight, Sparkles } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  SCHOOL_COURSES,
  type ServiceCategory
} from "@/lib/services-data";
import { SchoolApplyModal } from "./SchoolApplyModal";
import { SITE } from "@/lib/site";

const ACCENT_MAP: Record<
  ServiceCategory["accent"],
  { glow: string; chip: string; dot: string; halo: string }
> = {
  navy: {
    glow: "from-brand-navy/30 via-brand-navy/0 to-brand-navy/0",
    chip: "bg-brand-navy text-white",
    dot: "bg-brand-navy",
    halo: "bg-brand-navy/20"
  },
  red: {
    glow: "from-brand-red/30 via-brand-red/0 to-brand-red/0",
    chip: "bg-brand-red text-white",
    dot: "bg-brand-red",
    halo: "bg-brand-red/25"
  },
  gold: {
    glow: "from-brand-gold/30 via-brand-gold/0 to-brand-gold/0",
    chip: "bg-brand-gold text-white",
    dot: "bg-brand-gold",
    halo: "bg-brand-gold/30"
  },
  green: {
    glow: "from-brand-tea/30 via-brand-tea/0 to-brand-tea/0",
    chip: "bg-brand-tea text-white",
    dot: "bg-brand-tea",
    halo: "bg-brand-tea/25"
  }
};

export function ServicesView() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [initialCourse, setInitialCourse] = useState<string | undefined>(undefined);

  const openApply = (course?: string) => {
    setInitialCourse(course);
    setApplyOpen(true);
  };

  return (
    <>
      <ServicesHero onApply={() => openApply()} />

      <div className="relative">
        {SERVICE_CATEGORIES.map((cat, i) => (
          <CategorySection
            key={cat.id}
            category={cat}
            index={i}
            onApply={() => openApply()}
          />
        ))}
      </div>

      <SchoolCourses onApply={(course) => openApply(course)} />

      <ServicesCTA onApply={() => openApply()} />

      <SchoolApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        initialCourse={initialCourse}
      />
    </>
  );
}

function ServicesHero({ onApply }: { onApply: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-brand-navy/10 bg-gradient-to-b from-brand-cream via-brand-cream to-brand-cream/0">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-red/15 blur-3xl"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.2 }}
        className="absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-brand-navy/15 blur-3xl"
      />

      <div className="container py-16 sm:py-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-red" />
          What we do beyond the shelf
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-4 h-display text-4xl sm:text-5xl lg:text-6xl text-balance max-w-3xl"
        >
          Our Services — crafted for homes, businesses & schools.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-5 max-w-2xl text-lg text-brand-navy/75"
        >
          Hally&apos;s Way Concept goes beyond tea and spices. From catering and event
          planning to fashion, beauty, IT and community development — we bring care,
          craft and culture to every project we touch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <button onClick={onApply} className="btn-primary px-6 py-3">
            <GraduationCap className="h-4 w-4" /> Enroll in a Course
          </button>
          <Link href="/contact" className="btn-ghost">
            Talk to our team <MoveRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-wrap gap-2"
        >
          {SERVICE_CATEGORIES.map((cat, i) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white/70 px-4 py-2 text-xs font-medium text-brand-navy/80 backdrop-blur transition hover:border-brand-red hover:text-brand-red"
            >
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " + ACCENT_MAP[cat.accent].dot
                }
              />
              {cat.eyebrow}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategorySection({
  category,
  index,
  onApply
}: {
  category: ServiceCategory;
  index: number;
  onApply: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const flipped = index % 2 === 1;
  const accent = ACCENT_MAP[category.accent];

  return (
    <section
      ref={ref}
      id={category.id}
      className="relative scroll-mt-24 py-20 first:pt-6 sm:py-24"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 1.4 }}
        className={
          "pointer-events-none absolute -z-10 h-[420px] w-[420px] rounded-full blur-3xl " +
          accent.halo +
          (flipped ? " right-0 top-0" : " left-0 top-0")
        }
      />

      <div className="container">
        <div
          className={
            "grid gap-10 lg:grid-cols-2 lg:items-center" +
            (flipped ? " lg:[&>*:first-child]:order-2" : "")
          }
        >
          <motion.div
            initial={{ opacity: 0, x: flipped ? 28 : -28, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[28px] shadow-soft">
              <motion.div style={{ y }} className="relative h-[420px] sm:h-[520px]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div
                  className={
                    "absolute inset-0 bg-gradient-to-tr " + accent.glow + " mix-blend-soft-light"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/55 via-brand-navy/0 to-brand-navy/0" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={
                  "absolute left-5 top-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-soft " +
                  accent.chip
                }
              >
                {category.eyebrow}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 px-5 py-3 backdrop-blur shadow-soft"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-navy/60">
                  {category.services.length} service{category.services.length === 1 ? "" : "s"} in this group
                </p>
                <p className="mt-1 font-display text-base text-brand-navy">{category.title}</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{category.eyebrow}</p>
            <h2 className="mt-3 h-display text-3xl sm:text-4xl text-balance">
              {category.title}
            </h2>
            <p className="mt-4 max-w-md text-brand-navy/75 leading-relaxed">
              {category.description}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {category.services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div
                    key={svc.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-soft transition"
                  >
                    <div
                      aria-hidden
                      className={
                        "absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition group-hover:opacity-100 " +
                        accent.halo
                      }
                    />
                    <div className="flex items-start gap-3">
                      <div
                        className={
                          "grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-soft text-white " +
                          accent.dot
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy">{svc.title}</p>
                        <p className="mt-1 text-sm text-brand-navy/65 leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {category.cta?.type === "school-apply" ? (
                <button onClick={onApply} className="btn-primary px-6 py-3">
                  <GraduationCap className="h-4 w-4" />
                  {category.cta.label}
                </button>
              ) : (
                <Link href="/contact" className="btn-secondary">
                  Request a quote <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                  `Hi Hally's Way Concept, I'd like to enquire about ${category.eyebrow}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SchoolCourses({ onApply }: { onApply: (course?: string) => void }) {
  const categories = Array.from(new Set(SCHOOL_COURSES.map((c) => c.category)));

  return (
    <section className="relative scroll-mt-24 py-6 sm:py-12" id="courses">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="eyebrow">Course catalog</span>
          <h2 className="mt-3 h-display text-3xl sm:text-4xl text-balance">
            Browse our current courses.
          </h2>
          <p className="mt-3 text-brand-navy/75">
            New cohorts open every few weeks — pick a course below and we&apos;ll let
            you know when the next one starts.
          </p>
        </motion.div>

        <div className="mt-10 space-y-12">
          {categories.map((cat) => {
            const courses = SCHOOL_COURSES.filter((c) => c.category === cat);
            return (
              <div key={cat}>
                <motion.h3
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-xl text-brand-navy/90"
                >
                  {cat}
                </motion.h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((c, i) => (
                    <motion.article
                      key={c.title}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ delay: i * 0.05, duration: 0.55 }}
                      whileHover={{ y: -4 }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-soft"
                    >
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-red/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-red">
                        <Clock className="h-3 w-3" />
                        {c.duration}
                      </span>
                      <h4 className="mt-3 font-display text-lg text-brand-navy">{c.title}</h4>
                      <p className="mt-1 text-sm text-brand-navy/65 leading-relaxed">
                        {c.description}
                      </p>
                      <button
                        onClick={() => onApply(c.title)}
                        className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-brand-red"
                      >
                        Enroll now
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </button>
                    </motion.article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesCTA({ onApply }: { onApply: () => void }) {
  return (
    <section className="container pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[32px] bg-brand-navy px-6 py-12 text-white sm:px-12 sm:py-16"
      >
        <motion.div
          aria-hidden
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-red/30 blur-3xl animate-blob"
        />
        <motion.div
          aria-hidden
          className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand-red-200">
              Hally&apos;s Way School
            </p>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl">
              Ready to learn a new skill?
            </h3>
            <p className="mt-3 max-w-xl text-white/75">
              Join one of our hands-on cohorts in catering, fashion, beauty or
              technology. Small classes, real projects and a Hally&apos;s Way certificate
              at the end.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row lg:flex-col lg:items-end">
            <button onClick={onApply} className="btn-primary px-6 py-3.5">
              <GraduationCap className="h-4 w-4" /> Enroll in a Course
            </button>
            <Link
              href="/contact"
              className="btn bg-white text-brand-navy px-6 py-3.5 hover:bg-brand-cream"
            >
              General enquiries <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
