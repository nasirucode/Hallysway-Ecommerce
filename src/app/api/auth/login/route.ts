import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginPortalAccount } from "@/lib/erpnext/auth";
import { setSession } from "@/lib/session";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required")
});

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  try {
    const profile = await loginPortalAccount(parsed.data);
    setSession({
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      erpUser: profile.erpUser,
      customerId: profile.customerId
    });
    return NextResponse.json({ ok: true, user: profile });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Sign in failed" }, { status: 401 });
  }
}
