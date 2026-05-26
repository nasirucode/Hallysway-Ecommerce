"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SITE, formatLocation } from "@/lib/site";

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
                <Phone className="h-4 w-4 text-brand-red" />
                <a href={`tel:${SITE.phoneTel}`} className="link-underline">
                  {SITE.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-red" />
                <a href={`mailto:${SITE.email}`} className="link-underline">
                  {SITE.email}
                </a>
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

        <div className="mt-12 grid gap-5 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.locations.map((loc) => (
            <div key={loc.label} className="text-sm text-white/75">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 text-brand-red" />
                <span className="font-medium">{loc.label}</span>
              </div>
              <p className="mt-2 leading-relaxed">{formatLocation(loc)}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hally&apos;s Way Concept. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a
              href="https://console.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium text-white/90 hover:text-brand-red transition"
            >
              Console Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
