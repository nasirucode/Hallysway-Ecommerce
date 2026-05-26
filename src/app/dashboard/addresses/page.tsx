import { MapPin, Plus } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Addresses</p>
          <h1 className="mt-1 h-display text-3xl sm:text-4xl">Delivery addresses</h1>
        </div>
        <button className="btn-secondary">
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="pill bg-brand-red/10 border-brand-red/20 text-brand-red">Default</span>
            <button className="text-xs link-underline text-brand-navy/60">Edit</button>
          </div>
          <h3 className="mt-4 font-display text-xl">Home</h3>
          <p className="mt-2 text-sm text-brand-navy/70">
            Hally&apos;s Way Concept
            <br />
            Maiduguri, Borno State
            <br />
            Nigeria · 0907 403 3923
          </p>
        </div>
        <div className="grid place-items-center rounded-3xl border border-dashed border-brand-navy/20 p-6">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-cream text-brand-navy">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-lg">Add another address</p>
            <p className="text-xs text-brand-navy/60">For office, family or gift deliveries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
