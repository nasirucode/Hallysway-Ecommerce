"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
          password,
          confirmPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create your account");
      toast.success("Account created! Welcome to Hally's Way.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-14">
      <div className="grid items-stretch gap-10 rounded-3xl bg-white p-2 shadow-soft lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="order-2 p-8 sm:p-12 lg:order-1"
        >
          <h1 className="h-display text-3xl sm:text-4xl">Create your account</h1>
          <p className="mt-2 text-brand-navy/60">
            Already have one?{" "}
            <Link href="/auth/login" className="text-brand-red link-underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-3">
            <input required name="name" placeholder="Full name" className="input" autoComplete="name" />
            <input required type="email" name="email" placeholder="Email address" className="input" autoComplete="email" />
            <input required name="phone" placeholder="Mobile number" className="input" autoComplete="tel" />
            <input
              required
              type="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              className="input"
              autoComplete="new-password"
              minLength={8}
            />
            <input
              required
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="input"
              autoComplete="new-password"
              minLength={8}
            />
            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3.5 disabled:opacity-60">
              {loading ? "Creating..." : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-xs text-brand-navy/50">
            We&apos;ll create your Customer and User records in ERPNext so you can sign in and track orders.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="order-1 relative hidden overflow-hidden rounded-2xl lg:order-2 lg:block"
        >
          <Image src="/lifestyle/cozy-mug.jpg" alt="Cosy with tea" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/70 via-brand-red/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <span className="eyebrow text-white/80">Join Hally&apos;s Way</span>
            <h2 className="mt-3 font-display text-4xl leading-tight text-balance">
              Brew moments delivered to your door.
            </h2>
            <p className="mt-3 text-white/85">
              10% off your first order + early access to seasonal blends.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
