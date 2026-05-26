"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Tea Blends", href: "/shop?category=tea-blends" },
      { label: "Spices & Tanji", href: "/shop?category=spices" },
      { label: "Wellness", href: "/shop?category=wellness" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Catering", href: "/about#catering" },
      { label: "Wholesale", href: "/contact" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth/login" },
      { label: "Register", href: "/auth/register" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders & Invoices", href: "/dashboard/orders" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-navy text-white">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl animate-blob"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-blob"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-sm text-sm text-white/70">
              100% natural tea blends, signature spices and wellness essentials, hand-crafted by Hally&apos;s Way Concept in Nigeria.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-red" /> 0907 403 3923
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-red" /> hello@hallysway.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-red" /> Maiduguri, Borno State
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:border-brand-red hover:bg-brand-red"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg">{col.title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hally&apos;s Way Concept. All rights reserved.</p>
          <p>Powered by ERPNext · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
