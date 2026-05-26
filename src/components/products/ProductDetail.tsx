"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, Leaf } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/erpnext/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <section className="container py-12">
      <nav className="text-sm text-brand-navy/60">
        <a href="/" className="hover:text-brand-red">Home</a>
        <span className="mx-1">/</span>
        <a href="/shop" className="hover:text-brand-red">Shop</a>
        <span className="mx-1">/</span>
        <span className="text-brand-navy">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-soft"
          >
            <Image
              src={product.images[active] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {hasDiscount && (
              <span className="absolute left-4 top-4 pill bg-brand-red text-white border-brand-red">
                Save {discount}%
              </span>
            )}
          </motion.div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border transition ${
                    i === active ? "border-brand-red" : "border-brand-navy/15 hover:border-brand-navy/40"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <span className="eyebrow">{product.category}</span>
          )}
          <h1 className="mt-2 h-display text-4xl lg:text-5xl text-balance">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating ?? 5) ? "fill-brand-gold text-brand-gold" : "text-brand-navy/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-brand-navy/70">
              {product.rating?.toFixed(1) ?? "5.0"} · {product.ratingCount ?? 0} reviews
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-3xl text-brand-navy">{formatCurrency(product.price)}</p>
            {hasDiscount && (
              <p className="pb-1 text-sm text-brand-navy/40 line-through">
                {formatCurrency(product.compareAtPrice!)}
              </p>
            )}
            {product.weight && <span className="ml-2 pill">{product.weight}</span>}
          </div>

          <p className="mt-6 text-brand-navy/75 leading-relaxed">{product.description || product.shortDescription}</p>

          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-brand-navy/15 bg-white">
              <button
                aria-label="Decrease"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center text-brand-navy hover:text-brand-red"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                aria-label="Increase"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center text-brand-navy hover:text-brand-red"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                add(product, qty);
                toast.success(`${qty} × ${product.name} added`);
              }}
              className="btn-primary flex-1 py-3.5"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart · {formatCurrency(product.price * qty)}
            </motion.button>

            <button
              onClick={() => toast.success("Saved")}
              className="btn-icon h-11 w-11"
              aria-label="Save to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Leaf, label: "100% Natural" },
              { icon: ShieldCheck, label: "NAFDAC compliant" },
              { icon: Truck, label: "Fast nationwide ship" }
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 rounded-2xl border border-brand-navy/10 bg-white px-3 py-2.5 text-sm text-brand-navy/80">
                <f.icon className="h-4 w-4 text-brand-red" />
                {f.label}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {product.stock !== undefined && product.stock < 10 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-sm text-brand-red"
              >
                Only {product.stock} left in stock — order soon.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
