"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderName: string; invoiceName?: string } | null>(null);

  const subtotal = cart.subtotal();
  const shipping = subtotal > 15000 ? 0 : 1500;
  const total = subtotal + shipping;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    const form = new FormData(e.currentTarget);
    const payload = {
      customer: {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || "")
      },
      shipping: {
        line1: String(form.get("line1") || ""),
        city: String(form.get("city") || ""),
        state: String(form.get("state") || ""),
        country: "Nigeria",
        postalCode: String(form.get("postal") || "")
      },
      items: cart.items.map((i) => ({ itemCode: i.productId, quantity: i.quantity, rate: i.price })),
      notes: String(form.get("notes") || ""),
      createInvoice: true
    };

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      setConfirmation({ orderName: data.order?.name, invoiceName: data.invoice?.name });
      cart.clear();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-soft"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-tea/15 text-brand-tea"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          <h1 className="mt-5 h-display text-3xl">Thank you for your order!</h1>
          <p className="mt-2 text-brand-navy/70">
            We&apos;ve received your details and started preparing your blends.
          </p>
          <div className="mt-6 grid gap-2 rounded-2xl border border-brand-navy/10 bg-brand-cream/60 p-4 text-sm">
            <p>
              Order ref: <span className="font-medium">{confirmation.orderName}</span>
            </p>
            {confirmation.invoiceName && (
              <p>
                Invoice: <span className="font-medium">{confirmation.invoiceName}</span>
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard/orders" className="btn-secondary">
              View my orders
            </Link>
            <Link href="/shop" className="btn-ghost">
              Continue shopping
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <h1 className="h-display text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-brand-navy/60">
        Almost there — review your bag and complete your details below.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <fieldset>
            <legend className="font-display text-2xl">1. Contact</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required name="name" placeholder="Full name" className="input" />
              <input required type="email" name="email" placeholder="Email address" className="input" />
              <input
                required
                name="phone"
                placeholder="Mobile (e.g. 0907 403 3923)"
                className="input sm:col-span-2"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">2. Delivery</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required name="line1" placeholder="Address line" className="input sm:col-span-2" />
              <input required name="city" placeholder="City" className="input" />
              <input required name="state" placeholder="State" className="input" />
              <input name="postal" placeholder="Postal code (optional)" className="input sm:col-span-2" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-2xl">3. Notes</legend>
            <textarea name="notes" rows={3} placeholder="Anything we should know?" className="input mt-4" />
          </fieldset>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-70">
            {loading ? "Placing order..." : `Pay ${formatCurrency(total)} & place order`}
          </button>

          <div className="grid gap-2 text-xs text-brand-navy/60 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-red" /> Secure & encrypted checkout
            </p>
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-red" /> Fast nationwide delivery
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-soft lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-4">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.li
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-brand-cream">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-navy text-[10px] text-white px-1">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-navy leading-tight">{item.name}</p>
                    <p className="text-xs text-brand-navy/50">{formatCurrency(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </motion.li>
              ))}
            </AnimatePresence>
            {cart.items.length === 0 && (
              <p className="text-sm text-brand-navy/60">Your bag is empty.</p>
            )}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-brand-navy/10 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-brand-navy/70">Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-brand-navy/70">Shipping</dt>
              <dd>{shipping ? formatCurrency(shipping) : "Free"}</dd>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-brand-navy/10">
              <dt className="font-display text-lg">Total</dt>
              <dd className="font-display text-lg">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </section>
  );
}
