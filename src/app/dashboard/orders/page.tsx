import { listOrdersForEmail } from "@/lib/erpnext/service";
import { getSession } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = getSession()!;
  const orders = await listOrdersForEmail(session.email);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Orders</p>
        <h1 className="mt-1 h-display text-3xl sm:text-4xl">Your orders</h1>
      </header>

      <div className="rounded-3xl bg-white p-2 shadow-soft">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-brand-navy/60">No orders to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-brand-navy/60">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {orders.map((o) => (
                  <tr key={o.name} className="transition hover:bg-brand-cream">
                    <td className="px-4 py-4 font-medium">{o.name}</td>
                    <td className="px-4 py-4">{o.transactionDate}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-brand-navy/10 px-3 py-1 text-xs">{o.status}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">{formatCurrency(o.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
