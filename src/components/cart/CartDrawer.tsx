"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const cart = useCart();
  const subtotal = cart.subtotal();
  const empty = cart.items.length === 0;

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/40"
          onClick={cart.close}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-brand-cream shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-brand-navy/10 px-6 py-5">
              <div>
                <p className="eyebrow">Your bag</p>
                <h2 className="font-display text-2xl text-brand-navy">
                  {empty ? "Empty for now" : `${cart.count()} item${cart.count() === 1 ? "" : "s"}`}
                </h2>
              </div>
              <button onClick={cart.close} className="btn-icon" aria-label="Close cart">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {empty ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-soft">
                      <ShoppingBag className="h-6 w-6 text-brand-red" />
                    </div>
                    <p className="mt-4 font-display text-xl text-brand-navy">Your bag is empty</p>
                    <p className="mt-1 text-sm text-brand-navy/60">Start exploring our blends.</p>
                    <Link href="/shop" onClick={cart.close} className="btn-primary mt-6 inline-flex">
                      Shop teas
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="grid gap-4">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft"
                      >
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={cart.close}
                          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-cream"
                        >
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={cart.close}
                            className="font-medium text-brand-navy hover:text-brand-red transition leading-tight"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-brand-navy/60">{formatCurrency(item.price)} each</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-brand-navy/15 bg-white">
                              <button
                                aria-label="Decrease"
                                onClick={() => cart.setQty(item.productId, item.quantity - 1)}
                                className="grid h-8 w-8 place-items-center text-brand-navy hover:text-brand-red"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                aria-label="Increase"
                                onClick={() => cart.setQty(item.productId, item.quantity + 1)}
                                className="grid h-8 w-8 place-items-center text-brand-navy hover:text-brand-red"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => cart.remove(item.productId)}
                              className="text-brand-navy/40 hover:text-brand-red transition"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {!empty && (
              <footer className="border-t border-brand-navy/10 bg-white/70 px-6 py-5 backdrop-blur">
                <dl className="flex items-center justify-between text-sm text-brand-navy/70">
                  <dt>Subtotal</dt>
                  <dd className="text-base font-semibold text-brand-navy">{formatCurrency(subtotal)}</dd>
                </dl>
                <p className="mt-1 text-xs text-brand-navy/50">Shipping & taxes calculated at checkout.</p>
                <div className="mt-5 grid gap-2">
                  <Link href="/checkout" onClick={cart.close} className="btn-primary w-full">
                    Checkout
                  </Link>
                  <Link href="/shop" onClick={cart.close} className="btn-ghost w-full justify-center">
                    Continue shopping
                  </Link>
                </div>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
