"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  description?: string;
  count?: number;
}

export function ShopHeader({ title, description, count }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-brand-navy/10 bg-gradient-to-b from-brand-cream to-brand-cream/0">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-red/15 blur-3xl"
      />
      <div className="container py-14 sm:py-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          Shop
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-3 h-display text-4xl sm:text-5xl lg:text-6xl text-balance"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-2xl text-brand-navy/70 text-lg"
          >
            {description}
          </motion.p>
        )}
        {typeof count === "number" && (
          <p className="mt-6 text-sm text-brand-navy/60">
            Showing <span className="font-medium text-brand-navy">{count}</span>{" "}
            {count === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </div>
  );
}
