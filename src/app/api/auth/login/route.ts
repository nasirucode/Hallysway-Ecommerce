import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findOrCreateCustomer } from "@/lib/erpnext/service";
import { setSession } from "@/lib/session";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  phone: z.string().min(7).optional()
});

export async function POST(req: NextRequest) {
  const data = Schema.safeParse(await req.json().catch(() => null));
  if (!data.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const name = data.data.name || data.data.email.split("@")[0];
  const phone = data.data.phone || "";
  await findOrCreateCustomer({ name, email: data.data.email, phone });
  setSession({ email: data.data.email, name, phone });
  return NextResponse.json({ ok: true });
}
