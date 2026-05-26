import { ShopHeader } from "@/components/shop/ShopHeader";
import { Categories } from "@/components/home/Categories";
import { getCategories } from "@/lib/erpnext/service";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <>
      <ShopHeader
        title="Explore our categories"
        description="From signature blends to wellness essentials and fiery Tanji — find your favourite corner of the Hally's Way pantry."
        count={categories.length}
      />
      <Categories categories={categories} />
    </>
  );
}
