"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/erpnext/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (product, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              isOpen: true,
              items: s.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
              )
            };
          }
          return {
            isOpen: true,
            items: [
              ...s.items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images?.[0] || "/products/hally-tea-blend.jpg",
                quantity: qty
              }
            ]
          };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
            .filter((i) => i.quantity > 0)
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0)
    }),
    {
      name: "hw-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items })
    }
  )
);
