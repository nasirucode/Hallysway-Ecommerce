// Local seed data used as a fallback when ERPNext credentials are not configured.
// Mirrors the shape returned by our normalization layer.

import type { Product, Category } from "./types";

export const seedCategories: Category[] = [
  {
    slug: "tea-blends",
    name: "Tea Blends",
    description: "100% natural Hally's Way signature herbal tea blends.",
    image: "/products/hally-tea-blend.jpg"
  },
  {
    slug: "spices",
    name: "Spices & Tanji",
    description: "Hand-mixed chilli, spice mixes and pantry essentials.",
    image: "/products/honey-ginger.jpg"
  },
  {
    slug: "wellness",
    name: "Wellness",
    description: "Honey, ginger, lemon — wellness shots and supplements.",
    image: "/lifestyle/golde-blends.jpg"
  },
  {
    slug: "catering",
    name: "Catering Packs",
    description: "Ready-to-serve catering bundles for events and gatherings.",
    image: "/lifestyle/cozy-mug.jpg"
  }
];

export const seedProducts: Product[] = [
  {
    id: "HW-TEA-001",
    name: "Hally's Signature Tea Blend",
    slug: "hally-signature-tea-blend",
    shortDescription: "Our flagship blend — earthy, floral, deeply soothing.",
    description:
      "A hand-mixed signature herbal blend made from carefully sourced leaves and botanicals. Steep for 5–7 minutes and enjoy a calming, antioxidant-rich cup any time of day.",
    price: 4500,
    compareAtPrice: 5500,
    currency: "NGN",
    images: ["/products/hally-tea-blend.jpg", "/lifestyle/steaming-tea.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 48,
    rating: 4.9,
    ratingCount: 132,
    tags: ["bestseller", "natural"],
    isFeatured: true,
    isNew: false,
    weight: "120g",
    unit: "jar"
  },
  {
    id: "HW-TEA-002",
    name: "Peppermint & Lemon Tea",
    slug: "peppermint-lemon-tea",
    shortDescription: "Bright, cooling and aromatic — a refreshing daily lift.",
    description:
      "Cool peppermint and zesty lemon combine for a sparkling, palate-cleansing cup. Caffeine free and naturally invigorating.",
    price: 3800,
    currency: "NGN",
    images: ["/products/peppermint-lemon.jpg", "/lifestyle/herbal-blends.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 32,
    rating: 4.7,
    ratingCount: 84,
    tags: ["citrus", "caffeine-free"],
    isFeatured: true,
    weight: "100g"
  },
  {
    id: "HW-TEA-003",
    name: "Ginger Wellness Tea",
    slug: "ginger-wellness-tea",
    shortDescription: "Warming ginger to support immunity and digestion.",
    description:
      "Sun-dried ginger root with cardamom and cinnamon — a warming wellness ritual to start the day.",
    price: 4200,
    currency: "NGN",
    images: ["/products/ginger-tea.jpg", "/products/honey-ginger.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 64,
    rating: 4.8,
    ratingCount: 56,
    tags: ["wellness"],
    isNew: true,
    weight: "120g"
  },
  {
    id: "HW-TEA-004",
    name: "Lemon Spice Tea",
    slug: "lemon-spice-tea",
    shortDescription: "Lemon, mint, cinnamon and warm spices.",
    description: "Citrus brightness layered over rich spice — comforting and refreshing in equal measure.",
    price: 4000,
    currency: "NGN",
    images: ["/products/lemon-spice-tea.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 22,
    rating: 4.6,
    ratingCount: 41,
    weight: "100g"
  },
  {
    id: "HW-TEA-005",
    name: "Honey Ginger Wellness Kit",
    slug: "honey-ginger-kit",
    shortDescription: "Honey, lemon and ginger — a complete wellness kit.",
    description:
      "A curated wellness kit pairing pure honey, dried ginger and lemon for the perfect morning shot or hot infusion.",
    price: 8200,
    compareAtPrice: 9500,
    currency: "NGN",
    images: ["/products/honey-ginger.jpg", "/lifestyle/golde-blends.jpg"],
    category: "Wellness",
    categorySlug: "wellness",
    stock: 18,
    rating: 5.0,
    ratingCount: 22,
    tags: ["gift", "bundle"],
    isFeatured: true,
    weight: "Kit"
  },
  {
    id: "HW-TEA-006",
    name: "Herbal Tea Collection",
    slug: "herbal-tea-collection",
    shortDescription: "Six botanical blends in one tasting box.",
    description:
      "Explore six of our most-loved botanical blends — perfect for gifting or discovering your new favourite cup.",
    price: 12500,
    currency: "NGN",
    images: ["/products/herbal-collection.jpg", "/lifestyle/herbal-blends.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 9,
    rating: 4.9,
    ratingCount: 19,
    tags: ["gift", "discovery"],
    isFeatured: true,
    weight: "Box"
  },
  {
    id: "HW-TEA-007",
    name: "Apple Spice Tea",
    slug: "apple-spice-tea",
    shortDescription: "Apple, hibiscus and warm spices.",
    description: "A fruit-forward herbal infusion with a cosy spice finish. Equally lovely hot or iced.",
    price: 3600,
    currency: "NGN",
    images: ["/products/apple-spice-tea.jpg"],
    category: "Tea Blends",
    categorySlug: "tea-blends",
    stock: 40,
    rating: 4.5,
    ratingCount: 33,
    weight: "100g"
  },
  {
    id: "HW-SPC-001",
    name: "Spicy Chilli Tanji",
    slug: "spicy-chilli-tanji",
    shortDescription: "Our signature dry chilli mix — bold and aromatic.",
    description:
      "Hally's hand-mixed chilli Tanji is roasted, ground and blended in small batches. Use as a finishing seasoning, marinade or dipping spice.",
    price: 2800,
    currency: "NGN",
    images: ["/products/loose-leaf.png", "/products/strainer-tea.jpg"],
    category: "Spices & Tanji",
    categorySlug: "spices",
    stock: 75,
    rating: 4.8,
    ratingCount: 91,
    tags: ["bestseller"],
    isFeatured: true,
    weight: "200g"
  }
];

export function seedFindBySlug(slug: string) {
  return seedProducts.find((p) => p.slug === slug);
}
