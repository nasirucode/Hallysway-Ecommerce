import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const user = getSession()!;
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="mt-1 h-display text-3xl sm:text-4xl">Account settings</h1>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-xl">Profile</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-brand-navy/70">
            Full name
            <input defaultValue={user.name} className="input mt-2" />
          </label>
          <label className="text-sm text-brand-navy/70">
            Email
            <input defaultValue={user.email} type="email" className="input mt-2" />
          </label>
          <label className="text-sm text-brand-navy/70 sm:col-span-2">
            Phone
            <input defaultValue={user.phone || ""} className="input mt-2" />
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-primary">Save changes</button>
          <button className="btn-ghost">Cancel</button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-xl">Notifications</h2>
        <div className="mt-4 space-y-3">
          {[
            { label: "Order updates & shipping" },
            { label: "Seasonal launches & promos" },
            { label: "Restock alerts for wishlist items" }
          ].map((n) => (
            <label key={n.label} className="flex items-center justify-between rounded-xl border border-brand-navy/10 px-4 py-3 text-sm">
              {n.label}
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-red" />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
