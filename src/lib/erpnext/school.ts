// Server-only helper for Hally's Way School course enrollment.
// Creates an ERPNext Customer (customer_type = Individual) in the "School"
// customer group, plus a linked Contact and (optionally) Address. The
// chosen course title and any free-form notes are stored on the Customer's
// `customer_details` field so the team can see them at a glance.
//
// Idempotent on email — re-submitting with the same email updates the
// existing record rather than creating a duplicate.

import "server-only";
import { erpResource, isErpConfigured } from "./client";

const SCHOOL_CUSTOMER_GROUP = "School";
const DEFAULT_TERRITORY = process.env.ERPNEXT_DEFAULT_TERRITORY || "Nigeria";

export interface CourseEnrollmentInput {
  studentName: string;
  email: string;
  phone: string;
  course: string;
  city: string;
  state: string;
  address?: string;
  country?: string;
  notes?: string;
}

export interface CourseEnrollmentResult {
  customerName?: string;
  contactName?: string;
  addressName?: string;
  customerGroup: string;
  course: string;
  demo: boolean;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || fullName,
    lastName: parts.slice(1).join(" ")
  };
}

/** Ensure the "School" Customer Group exists in ERPNext. */
async function ensureSchoolCustomerGroup() {
  const existing = await erpResource.list<{ name: string }>("Customer Group", {
    query: {
      fields: JSON.stringify(["name"]),
      filters: JSON.stringify([["name", "=", SCHOOL_CUSTOMER_GROUP]]),
      limit_page_length: 1
    },
    soft: true
  });
  if (existing?.data?.length) return SCHOOL_CUSTOMER_GROUP;

  await erpResource
    .create("Customer Group", {
      customer_group_name: SCHOOL_CUSTOMER_GROUP,
      is_group: 0,
      parent_customer_group: "All Customer Groups"
    })
    .catch(() => null);

  return SCHOOL_CUSTOMER_GROUP;
}

async function findCustomerByEmail(email: string) {
  const res = await erpResource.list<{
    name: string;
    customer_name: string;
    customer_group?: string;
  }>("Customer", {
    query: {
      fields: JSON.stringify(["name", "customer_name", "customer_group"]),
      filters: JSON.stringify([["email_id", "=", email]]),
      limit_page_length: 1
    },
    soft: true
  });
  return res?.data?.[0] ?? null;
}

async function upsertStudentContact(args: {
  customerName: string;
  studentName: string;
  email: string;
  phone: string;
}) {
  const { firstName, lastName } = splitName(args.studentName);

  const existing = await erpResource.list<{ name: string }>("Contact", {
    query: {
      fields: JSON.stringify(["name"]),
      filters: JSON.stringify([["email_id", "=", args.email]]),
      limit_page_length: 1
    },
    soft: true
  });

  const body: Record<string, any> = {
    first_name: firstName,
    last_name: lastName || undefined,
    email_ids: [{ email_id: args.email, is_primary: 1 }],
    links: [{ link_doctype: "Customer", link_name: args.customerName }]
  };
  if (args.phone) body.phone_nos = [{ phone: args.phone, is_primary_mobile_no: 1 }];

  if (existing?.data?.length) {
    const updated = await erpResource
      .update<{ name: string }>("Contact", existing.data[0].name, body)
      .catch(() => null);
    return updated?.data?.name || existing.data[0].name;
  }

  const created = await erpResource
    .create<{ name: string }>("Contact", body)
    .catch(() => null);
  return created?.data?.name;
}

async function createStudentAddress(args: {
  customerName: string;
  studentName: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  country: string;
}) {
  if (!args.address) return undefined;
  const body: Record<string, any> = {
    address_title: `${args.studentName} - Home`,
    address_type: "Personal",
    address_line1: args.address,
    city: args.city,
    state: args.state,
    country: args.country,
    phone: args.phone || undefined,
    email_id: args.email || undefined,
    is_primary_address: 1,
    links: [{ link_doctype: "Customer", link_name: args.customerName }]
  };
  const created = await erpResource
    .create<{ name: string }>("Address", body)
    .catch(() => null);
  return created?.data?.name;
}

/**
 * Register a course enrollment. Creates / updates the student as an ERPNext
 * Customer (customer_group = "School", customer_type = "Individual") and
 * stores the chosen course on the customer record.
 */
export async function registerCourseEnrollment(
  input: CourseEnrollmentInput
): Promise<CourseEnrollmentResult> {
  if (!isErpConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[erp] (demo) course enrollment captured:", input);
    }
    return {
      customerGroup: SCHOOL_CUSTOMER_GROUP,
      course: input.course,
      demo: true
    };
  }

  await ensureSchoolCustomerGroup();

  const country = input.country || DEFAULT_TERRITORY;
  const composedNotes = [
    `Course: ${input.course}`,
    input.notes ? `Notes: ${input.notes}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  // 1. Customer (idempotent on email).
  const existing = await findCustomerByEmail(input.email);
  let customerName = existing?.name;

  const customerBody: Record<string, any> = {
    customer_name: input.studentName,
    customer_type: "Individual",
    customer_group: SCHOOL_CUSTOMER_GROUP,
    territory: country,
    email_id: input.email,
    mobile_no: input.phone,
    customer_details: composedNotes
  };

  if (customerName) {
    await erpResource
      .update("Customer", customerName, customerBody)
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[erp] student customer update failed", (err as Error).message);
        }
      });
  } else {
    const created = await erpResource.create<{ name: string }>("Customer", customerBody);
    if (!created?.data?.name) throw new Error("Could not register course enrollment");
    customerName = created.data.name;
  }

  // 2. Contact + 3. Address (best effort).
  const [contactName, addressName] = await Promise.all([
    upsertStudentContact({
      customerName: customerName!,
      studentName: input.studentName,
      email: input.email,
      phone: input.phone
    }),
    createStudentAddress({
      customerName: customerName!,
      studentName: input.studentName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      country
    })
  ]);

  return {
    customerName,
    contactName,
    addressName,
    customerGroup: SCHOOL_CUSTOMER_GROUP,
    course: input.course,
    demo: false
  };
}
