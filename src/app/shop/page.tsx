import { ShopHeader } from "@/components/shop/ShopHeader";
import { Filters } from "@/components/shop/Filters";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories, getProducts } from "@/lib/erpnext/service";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { category?: string; q?: string; sort?: string };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: searchParams.category, search: searchParams.q, limit: 60 })
  ]);

  const sorted = [...products];
  if (searchParams.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (searchParams.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (searchParams.sort === "newest") sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const activeCategory = categories.find((c) => c.slug === searchParams.category)?.name;

  return (
    <>
      <ShopHeader
        title={activeCategory || "The Hally's Way Collection"}
        description={
          activeCategory
            ? `Explore our ${activeCategory.toLowerCase()} — slow-crafted in small batches with love.`
            : "Curated tea blends, signature spices and wellness essentials, hand-mixed in Maiduguri."
        }
        count={sorted.length}
      />
      <section className="container py-10">
        <Suspense fallback={null}>
          <Filters categories={categories} activeCategory={searchParams.category} />
        </Suspense>

        {sorted.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-3xl border border-dashed border-brand-navy/20 py-20 text-center">
            <p className="font-display text-2xl text-brand-navy">No products match your filters.</p>
            <p className="mt-2 text-sm text-brand-navy/60">Try clearing search or selecting a different category.</p>
          </div>
        ) : (
          <div className="mt-10 grid-products">
            {sorted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
