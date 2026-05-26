import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container grid place-items-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 h-display text-5xl sm:text-6xl">Page not steeped.</h1>
      <p className="mt-3 max-w-md text-brand-navy/70">
        The page you&apos;re looking for has wandered off. Let&apos;s get you back to the good brews.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/shop" className="btn-ghost">
          Explore the shop
        </Link>
      </div>
    </section>
  );
}
