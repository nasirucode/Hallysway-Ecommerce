"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email")),
          name: String(form.get("name") || form.get("email")),
          phone: String(form.get("phone") || "")
        })
      });
      if (!res.ok) throw new Error("Could not sign in");
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-14">
      <div className="grid items-stretch gap-10 rounded-3xl bg-white p-2 shadow-soft lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative hidden overflow-hidden rounded-2xl lg:block"
        >
          <Image
            src="/lifestyle/steaming-tea.jpg"
            alt="Hally's Way tea"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/70 via-brand-navy/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <span className="eyebrow text-white/80">Welcome back</span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-balance">
              Sign in to track your orders & invoices.
            </h2>
            <p className="mt-3 text-white/80">
              Your favourites are saved across devices. View order history, manage addresses, and re-order in seconds.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="p-8 sm:p-12"
        >
          <h1 className="h-display text-3xl sm:text-4xl">Sign in</h1>
          <p className="mt-2 text-brand-navy/60">
            New here?{" "}
            <Link href="/auth/register" className="text-brand-red link-underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-3">
            <input required type="email" name="email" placeholder="Email address" className="input" />
            <input name="name" placeholder="Full name (optional)" className="input" />
            <input name="phone" placeholder="Phone (optional)" className="input" />
            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3.5 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-xs text-brand-navy/50">
            For demo we use email-only sign-in linked to your ERPNext customer record.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
