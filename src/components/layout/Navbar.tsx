"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" }
];

interface NavbarProps {
  user?: { name: string; email: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 30));

  const firstName = user?.name?.split(" ")[0];

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="bg-brand-navy text-white text-xs"
      >
        <div className="container flex h-9 items-center justify-between">
          <p className="hidden sm:block tracking-wide opacity-90">
            Free delivery across Maiduguri on orders over ₦15,000 — and nationwide shipping available.
          </p>
          <p className="sm:hidden tracking-wide opacity-90">Free delivery on orders ₦15k+</p>
          <div className="hidden md:flex items-center gap-4 opacity-90">
            <a href={`tel:${SITE.phoneTel}`} className="link-underline">
              Call: {SITE.phone}
            </a>
            <span aria-hidden>·</span>
            {user ? (
              <>
                <Link href="/dashboard" className="link-underline">
                  Hi, {firstName}
                </Link>
                <span aria-hidden>·</span>
                <button onClick={handleSignOut} className="link-underline">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="link-underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <motion.header
        animate={{
          backgroundColor: scrolled ? "rgba(251,245,236,0.85)" : "rgba(251,245,236,0)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          borderBottomColor: scrolled ? "rgba(29,58,110,0.12)" : "rgba(29,58,110,0)"
        }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b"
        style={{ borderBottomWidth: 1 }}
      >
        <div className="container flex h-20 items-center justify-between gap-6">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium tracking-wide transition-colors",
                    active ? "text-brand-red" : "text-brand-navy/80 hover:text-brand-navy"
                  )}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-red/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link href="/shop" aria-label="Search" className="btn-icon hidden sm:inline-flex">
              <Search className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" aria-label="Account" className="btn-icon hidden sm:inline-flex">
              <User className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/wishlist" aria-label="Wishlist" className="btn-icon hidden md:inline-flex">
              <Heart className="h-4 w-4" />
            </Link>
            <button
              onClick={() => cart.open()}
              aria-label="Open cart"
              className="btn-icon relative"
            >
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                {cart.count() > 0 && (
                  <motion.span
                    key={cart.count()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-red px-1.5 text-[10px] font-semibold text-white"
                  >
                    {cart.count()}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="btn-icon lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="ml-auto h-full w-[85%] max-w-sm bg-brand-cream p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} className="btn-icon" aria-label="Close menu">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-10 grid gap-1">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block font-display text-3xl text-brand-navy hover:text-brand-red transition py-2"
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-10 grid gap-3 text-sm text-brand-navy/70">
                {user ? (
                  <>
                    <p className="text-brand-navy">
                      Signed in as <span className="font-medium">{firstName}</span>
                    </p>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="link-underline w-fit">
                      My dashboard
                    </Link>
                    <button onClick={handleSignOut} className="link-underline w-fit text-brand-red flex items-center gap-1.5">
                      <LogOut className="h-3.5 w-3.5" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="link-underline w-fit">
                      Sign in
                    </Link>
                    <Link href="/auth/register" onClick={() => setOpen(false)} className="link-underline w-fit">
                      Create account
                    </Link>
                  </>
                )}
                <a href={`tel:${SITE.phoneTel}`} className="link-underline w-fit">
                  Call: {SITE.phone}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
