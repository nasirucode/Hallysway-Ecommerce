"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Home,
  LogOut,
  MapPin,
  Receipt,
  Settings,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft lg:sticky lg:top-28">
      <div className="flex items-center gap-3 border-b border-brand-navy/10 pb-5">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red font-display text-xl text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight truncate">{user.name}</p>
          <p className="truncate text-xs text-brand-navy/60">{user.email}</p>
        </div>
      </div>

      <nav className="mt-4 grid gap-1">
        {ITEMS.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "text-white" : "text-brand-navy/80 hover:bg-brand-cream"
              )}
            >
              {active && (
                <motion.span
                  layoutId="dash-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-brand-navy"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-red hover:bg-brand-red/10 transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </nav>
    </aside>
  );
}
