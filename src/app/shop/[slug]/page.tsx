import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProductBySlug, getProducts } from "@/lib/erpnext/service";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription || product.description
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = (await getProducts({ categorySlug: product.categorySlug, limit: 8 })).filter(
    (p) => p.id !== product.id
  );

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="container pb-20">
          <SectionHeader eyebrow="You may also love" title="More from Hally's Way" />
          <div className="mt-10 grid-products">
            {related.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
