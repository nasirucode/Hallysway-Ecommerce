import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Wishlist</p>
        <h1 className="mt-1 h-display text-3xl sm:text-4xl">Saved for later</h1>
      </header>

      <div className="grid place-items-center rounded-3xl bg-white p-16 text-center shadow-soft">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-red/10 text-brand-red">
          <Heart className="h-6 w-6" />
        </div>
        <p className="mt-4 font-display text-2xl">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-brand-navy/60">Tap the heart on any product to save it for later.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Explore products
        </Link>
      </div>
    </div>
  );
}
