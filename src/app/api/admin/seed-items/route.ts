// Helper endpoint to push the local seed catalog into ERPNext.
// Call once after configuring API credentials:
//   curl -X POST http://localhost:3000/api/admin/seed-items
// In production gate this behind authentication.

import { NextResponse } from "next/server";
import { createItem } from "@/lib/erpnext/service";
import { seedProducts } from "@/lib/erpnext/seed";

export const runtime = "nodejs";

export async function POST() {
  const results: Array<{ itemCode: string; ok: boolean; error?: string }> = [];
  for (const p of seedProducts) {
    try {
      await createItem({
        itemCode: p.id,
        itemName: p.name,
        itemGroup: p.category || "Products",
        rate: p.price,
        compareAtRate: p.compareAtPrice,
        description: p.description || p.shortDescription,
        uom: p.unit || "Nos"
      });
      results.push({ itemCode: p.id, ok: true });
    } catch (err: any) {
      results.push({ itemCode: p.id, ok: false, error: err?.message?.slice(0, 240) });
    }
  }
  return NextResponse.json({ results });
}
