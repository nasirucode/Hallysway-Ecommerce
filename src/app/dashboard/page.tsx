import Link from "next/link";
import { listInvoicesForEmail, listOrdersForEmail } from "@/lib/erpnext/service";
import { getSession } from "@/lib/session";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = getSession()!;
  const [invoices, orders] = await Promise.all([
    listInvoicesForEmail(session.email),
    listOrdersForEmail(session.email)
  ]);

  const totalSpent = invoices.reduce((s, i) => s + (i.grandTotal || 0), 0);
  const outstanding = invoices.reduce((s, i) => s + (i.outstanding || 0), 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-1 h-display text-3xl sm:text-4xl">
          Welcome back, {session.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-2 text-brand-navy/60">
          Here&apos;s a quick look at your account activity.
        </p>
      </header>

      <DashboardStats
        ordersCount={orders.length}
        invoicesCount={invoices.length}
        totalSpent={formatCurrency(totalSpent)}
        outstanding={formatCurrency(outstanding)}
      />

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link href="/dashboard/orders" className="link-underline text-sm text-brand-red">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="mt-6 text-sm text-brand-navy/60">No orders yet. Treat yourself to your first blend!</p>
        ) : (
          <ul className="mt-6 divide-y divide-brand-navy/10">
            {orders.slice(0, 5).map((o) => (
              <li key={o.name} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-brand-navy/60">{o.transactionDate}</p>
                </div>
                <span className="rounded-full bg-brand-navy/10 px-3 py-1 text-xs">{o.status}</span>
                <p className="font-medium">{formatCurrency(o.grandTotal)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent invoices</h2>
          <Link href="/dashboard/invoices" className="link-underline text-sm text-brand-red">
            View all
          </Link>
        </div>
        {invoices.length === 0 ? (
          <p className="mt-6 text-sm text-brand-navy/60">You don&apos;t have any invoices yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-brand-navy/10">
            {invoices.slice(0, 5).map((i) => (
              <li key={i.name} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-brand-navy/60">{i.postingDate}</p>
                </div>
                <span className="rounded-full bg-brand-red/10 text-brand-red px-3 py-1 text-xs">{i.status}</span>
                <p className="font-medium">{formatCurrency(i.grandTotal)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
