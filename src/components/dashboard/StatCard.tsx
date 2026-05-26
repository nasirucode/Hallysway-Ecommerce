"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
  accent?: "red" | "navy" | "tea" | "gold";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  red: "bg-brand-red/10 text-brand-red",
  navy: "bg-brand-navy/10 text-brand-navy",
  tea: "bg-brand-tea/15 text-brand-tea",
  gold: "bg-brand-gold/20 text-brand-gold"
};

export function StatCard({ label, value, icon: Icon, delay = 0, accent = "navy" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft"
    >
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${ACCENTS[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-brand-navy/60">{label}</p>
        <p className="font-display text-2xl text-brand-navy">{value}</p>
      </div>
    </motion.div>
  );
}
