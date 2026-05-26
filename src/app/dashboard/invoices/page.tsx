import { listInvoicesForEmail } from "@/lib/erpnext/service";
import { getSession } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const session = getSession()!;
  const invoices = await listInvoicesForEmail(session.email);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Invoices</p>
        <h1 className="mt-1 h-display text-3xl sm:text-4xl">Your invoices</h1>
        <p className="mt-2 text-brand-navy/60">Sales Invoices issued by Hally&apos;s Way via ERPNext.</p>
      </header>

      <div className="rounded-3xl bg-white p-2 shadow-soft">
        {invoices.length === 0 ? (
          <p className="p-10 text-center text-brand-navy/60">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-brand-navy/60">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {invoices.map((i) => (
                  <tr key={i.name} className="transition hover:bg-brand-cream">
                    <td className="px-4 py-4 font-medium">{i.name}</td>
                    <td className="px-4 py-4">{i.postingDate}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          i.status === "Paid"
                            ? "bg-brand-tea/15 text-brand-tea"
                            : "bg-brand-red/10 text-brand-red"
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">{formatCurrency(i.grandTotal)}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(i.outstanding || 0)}</td>
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
