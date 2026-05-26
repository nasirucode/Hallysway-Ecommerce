import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/erpnext/service";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const products = await getProducts({
    limit: Number(searchParams.get("limit")) || undefined,
    categorySlug: searchParams.get("category") || undefined,
    search: searchParams.get("q") || undefined
  });
  return NextResponse.json({ products });
}
