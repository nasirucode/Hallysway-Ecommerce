"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Coffee, HeartHandshake } from "lucide-react";

const POINTS = [
  {
    icon: HeartHandshake,
    title: "Hand-mixed in small batches",
    desc: "Every jar is blended by hand in our Maiduguri kitchen — for freshness you can taste."
  },
  {
    icon: Coffee,
    title: "Carefully sourced botanicals",
    desc: "Leaves, roots and spices selected for flavour, aroma and traditional benefits."
  },
  {
    icon: Award,
    title: "Award-winning quality",
    desc: "Recognised at The Food Expo Maiduguri as Best Entrepreneur — 1st Runner Up."
  }
];

export function Story() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="relative h-[460px] overflow-hidden rounded-[28px] shadow-soft"
          >
            <Image
              src="/lifestyle/cozy-mug.jpg"
              alt="A quiet moment with Hally's Way tea"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="absolute -bottom-8 -right-6 hidden h-56 w-44 overflow-hidden rounded-2xl shadow-soft md:block"
          >
            <Image
              src="/brand/award.jpg"
              alt="Merit Award — Best Entrepreneur"
              fill
              sizes="200px"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            Our story
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 h-display text-4xl lg:text-5xl text-balance"
          >
            A taste of tradition, brewed for today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-xl text-brand-navy/70 text-lg"
          >
            Hally&apos;s Way Concept was born from a love for natural ingredients, generous hospitality and the rituals that make every day a little more soulful. From hand-mixed tea blends to fiery Tanji and full catering services — we&apos;re honouring tradition with a modern touch.
          </motion.p>

          <div className="mt-10 grid gap-5">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-brand-navy">{p.title}</h3>
                  <p className="text-sm text-brand-navy/70">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex gap-3">
            <Link href="/about" className="btn-secondary">
              Read our story
            </Link>
            <Link href="/contact" className="btn-ghost">
              Catering enquiries
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
