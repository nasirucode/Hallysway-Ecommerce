"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import type { Category } from "@/lib/erpnext/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  activeCategory?: string;
}

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" }
];

export function Filters({ categories, activeCategory }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`/shop?${next.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => update("category")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            !activeCategory
              ? "border-brand-navy bg-brand-navy text-white"
              : "border-brand-navy/15 bg-white text-brand-navy hover:border-brand-navy"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => update("category", c.slug)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              activeCategory === c.slug
                ? "border-brand-red bg-brand-red text-white"
                : "border-brand-navy/15 bg-white text-brand-navy hover:border-brand-navy"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update("q", search || undefined);
          }}
          className="relative flex w-full max-w-xs items-center"
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blends, spices..."
            className="input pl-9"
          />
        </form>
        <div className="relative inline-flex items-center gap-2 rounded-full border border-brand-navy/15 bg-white px-3 py-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-navy/60" />
          <select
            value={params.get("sort") || "featured"}
            onChange={(e) => update("sort", e.target.value === "featured" ? undefined : e.target.value)}
            className="bg-transparent text-sm text-brand-navy outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-brand-navy/60"
        >
          Updating…
        </motion.span>
      )}
    </div>
  );
}
