import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerPortalAccount } from "@/lib/erpnext/auth";
import { setSession } from "@/lib/session";

export const runtime = "nodejs";

const Schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    phone: z.string().min(7, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8)
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const profile = await registerPortalAccount(parsed.data);
    setSession({
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      erpUser: profile.erpUser,
      customerId: profile.customerId
    });
    return NextResponse.json({ ok: true, user: profile });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Registration failed" }, { status: 400 });
  }
}
