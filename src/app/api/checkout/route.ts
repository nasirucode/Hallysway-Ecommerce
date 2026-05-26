import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSalesInvoice, createSalesOrder } from "@/lib/erpnext/service";

export const runtime = "nodejs";

const Schema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7)
  }),
  shipping: z.object({
    line1: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().optional(),
    postalCode: z.string().optional()
  }),
  items: z
    .array(
      z.object({
        itemCode: z.string(),
        quantity: z.number().positive(),
        rate: z.number().nonnegative()
      })
    )
    .min(1),
  notes: z.string().optional(),
  createInvoice: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { createInvoice, ...payload } = parsed.data;
  try {
    const order = await createSalesOrder(payload);
    const invoice = createInvoice
      ? await createSalesInvoice({ customerEmail: payload.customer.email, payload })
      : null;
    return NextResponse.json({ order, invoice });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Checkout failed" }, { status: 500 });
  }
}
