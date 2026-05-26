import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerCourseEnrollment } from "@/lib/erpnext/school";
import { SCHOOL_COURSE_TITLES } from "@/lib/services-data";

export const runtime = "nodejs";

const Schema = z.object({
  studentName: z.string().min(2, "Your name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  course: z
    .string()
    .min(2, "Please select a course")
    .refine((c) => SCHOOL_COURSE_TITLES.includes(c), {
      message: "Selected course is not available"
    }),
  address: z.string().optional().default(""),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().optional().default("Nigeria"),
  notes: z.string().optional().default("")
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
    const result = await registerCourseEnrollment(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Could not register. Please try again." },
      { status: 400 }
    );
  }
}
