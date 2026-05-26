"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[28px] bg-brand-red px-6 py-14 text-white sm:px-12"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob" />
        <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-brand-navy/40 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="relative mx-auto grid max-w-3xl place-items-center text-center">
          <span className="pill bg-white/10 text-white border-white/20">
            <Mail className="h-3.5 w-3.5" /> Join the brew letter
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-balance">
            Get early access to new blends, seasonal drops & 10% off your first order.
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              setLoading(true);
              setTimeout(() => {
                toast.success("You're in! Check your inbox for the welcome code.");
                setEmail("");
                setLoading(false);
              }, 700);
            }}
            className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-soft"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hallysway.com"
              required
              className="w-full bg-transparent px-4 py-2 text-sm text-brand-navy outline-none placeholder:text-brand-navy/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-600 transition disabled:opacity-60"
            >
              {loading ? "Joining..." : "Join"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
