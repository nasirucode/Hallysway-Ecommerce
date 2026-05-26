import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/erpnext/service";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const product = await getProductBySlug(ctx.params.slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}
