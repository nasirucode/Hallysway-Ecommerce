import { NextResponse } from "next/server";
import { listInvoicesForEmail, listOrdersForEmail } from "@/lib/erpnext/service";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [invoices, orders] = await Promise.all([
    listInvoicesForEmail(session.email),
    listOrdersForEmail(session.email)
  ]);
  return NextResponse.json({ invoices, orders });
}
