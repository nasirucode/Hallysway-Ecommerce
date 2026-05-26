"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const cart = useCart();
  const subtotal = cart.subtotal();
  const shipping = subtotal > 15000 || subtotal === 0 ? 0 : 1500;
  const total = subtotal + shipping;

  return (
    <section className="container py-14">
      <h1 className="h-display text-4xl sm:text-5xl">Your bag</h1>
      <p className="mt-2 text-brand-navy/60">Review your selections before checking out.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-navy/20 p-16 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-soft">
                <ShoppingBag className="h-6 w-6 text-brand-red" />
              </div>
              <p className="mt-4 font-display text-2xl">Your bag is empty</p>
              <p className="mt-1 text-sm text-brand-navy/60">Time to discover your next favourite blend.</p>
              <Link href="/shop" className="btn-primary mt-6 inline-flex">
                Browse shop
              </Link>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex gap-5 rounded-2xl bg-white p-4 shadow-soft"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-brand-cream"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/shop/${item.slug}`} className="font-display text-xl text-brand-navy hover:text-brand-red transition">
                      {item.name}
                    </Link>
                    <p className="text-sm text-brand-navy/60">{formatCurrency(item.price)} each</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-brand-navy/15 bg-white">
                        <button
                          onClick={() => cart.setQty(item.productId, item.quantity - 1)}
                          className="grid h-9 w-9 place-items-center text-brand-navy hover:text-brand-red"
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => cart.setQty(item.productId, item.quantity + 1)}
                          className="grid h-9 w-9 place-items-center text-brand-navy hover:text-brand-red"
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        onClick={() => cart.remove(item.productId)}
                        className="text-brand-navy/40 hover:text-brand-red transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-soft lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-brand-navy/70">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-brand-navy/70">Shipping</dt>
              <dd className="font-medium">{shipping ? formatCurrency(shipping) : "Free"}</dd>
            </div>
            <div className="border-t border-brand-navy/10 pt-3 flex items-center justify-between">
              <dt className="font-display text-lg">Total</dt>
              <dd className="font-display text-lg">{formatCurrency(total)}</dd>
            </div>
          </dl>
          <Link
            href={cart.items.length ? "/checkout" : "/shop"}
            className={`btn-primary mt-6 w-full ${cart.items.length === 0 && "pointer-events-none opacity-60"}`}
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 text-xs text-brand-navy/50">Secure checkout · Pay on delivery or with card.</p>
        </aside>
      </div>
    </section>
  );
}
