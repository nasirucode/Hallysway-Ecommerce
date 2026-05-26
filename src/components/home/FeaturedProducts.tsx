"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/erpnext/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Best sellers"
          title="Our most loved blends"
          description="Hand-picked favourites from the Hally's Way pantry."
          className="!max-w-2xl"
        />
        <Link href="/shop" className="btn-ghost w-fit">
          View all products
        </Link>
      </div>

      <div className="mt-12 grid-products">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
