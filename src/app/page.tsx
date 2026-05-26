import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Story } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { getCategories, getFeaturedProducts } from "@/lib/erpnext/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedProducts products={products} />
      <Categories categories={categories} />
      <Story />
      <Testimonials />
      <Newsletter />
    </>
  );
}
