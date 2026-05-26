"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/erpnext/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const add = useCart((s) => s.add);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-soft">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="pill bg-brand-navy text-white border-brand-navy">New</span>
            )}
            {hasDiscount && (
              <span className="pill bg-brand-red text-white border-brand-red">-{discount}%</span>
            )}
          </div>

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Saved to wishlist");
            }}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-navy opacity-0 transition-all duration-300 hover:bg-brand-red hover:text-white group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>

          <motion.div
            initial={false}
            className="absolute inset-x-3 bottom-3 flex translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                add(product, 1);
                toast.success(`${product.name} added to cart`);
              }}
              className="btn-primary flex-1 text-sm py-2.5"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
          </motion.div>
        </div>

        <div className="mt-4 px-1">
          <div className="flex items-center gap-1 text-xs text-brand-navy/60">
            <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
            <span>{product.rating?.toFixed(1) ?? "4.8"}</span>
            {product.category && (
              <>
                <span aria-hidden>·</span>
                <span className="truncate">{product.category}</span>
              </>
            )}
          </div>
          <h3 className="mt-1 font-display text-lg text-brand-navy group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-semibold text-brand-navy">{formatCurrency(product.price)}</p>
            {hasDiscount && (
              <p className="text-xs text-brand-navy/40 line-through">
                {formatCurrency(product.compareAtPrice!)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
