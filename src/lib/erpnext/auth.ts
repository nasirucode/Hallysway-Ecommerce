import "server-only";

import { erpResource, isErpConfigured, ERPNEXT_BASE_URL } from "./client";
import { findOrCreateCustomer } from "./service";

export interface PortalProfile {
  email: string;
  name: string;
  phone: string;
  erpUser?: string;
  customerId?: string;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || fullName,
    lastName: parts.slice(1).join(" ")
  };
}

async function findUserByEmail(email: string) {
  const res = await erpResource.list<{
    name: string;
    email: string;
    first_name?: string;
    full_name?: string;
    enabled?: 0 | 1;
  }>("User", {
    query: {
      fields: JSON.stringify(["name", "email", "first_name", "full_name", "enabled"]),
      filters: JSON.stringify([["email", "=", email]]),
      limit_page_length: 1
    },
    soft: true
  });
  return res?.data?.[0] ?? null;
}

async function getCustomerByEmail(email: string) {
  const res = await erpResource.list<{
    name: string;
    customer_name: string;
    mobile_no?: string;
  }>("Customer", {
    query: {
      fields: JSON.stringify(["name", "customer_name", "mobile_no"]),
      filters: JSON.stringify([["email_id", "=", email]]),
      limit_page_length: 1
    },
    soft: true
  });
  return res?.data?.[0] ?? null;
}

async function linkContactToCustomer(args: {
  name: string;
  email: string;
  phone: string;
  customerName: string;
}) {
  const { firstName, lastName } = splitName(args.name);
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
  if (args.phone) {
    body.phone_nos = [{ phone: args.phone, is_primary_mobile_no: 1 }];
  }

  if (existing?.data?.length) {
    await erpResource.update("Contact", existing.data[0].name, body);
    return existing.data[0].name;
  }

  const created = await erpResource.create<{ name: string }>("Contact", body);
  return created?.data?.name;
}

async function createOrUpdateErpUser(args: { email: string; firstName: string; password: string }) {
  const existing = await findUserByEmail(args.email);

  if (existing) {
    await erpResource.update("User", existing.name, {
      new_password: args.password,
      enabled: 1,
      user_type: "Website User"
    });
    return existing;
  }

  const created = await erpResource.create<{
    name: string;
    email: string;
    first_name?: string;
    full_name?: string;
  }>("User", {
    email: args.email,
    first_name: args.firstName,
    new_password: args.password,
    send_welcome_email: 0,
    user_type: "Website User",
    enabled: 1
  });

  const user = created?.data;
  if (!user) throw new Error("Could not create ERPNext user");

  // Assign Customer role for portal access (best-effort).
  await erpResource
    .update("User", user.name, {
      roles: [{ role: "Customer" }]
    })
    .catch(() => null);

  return user;
}

/** Verify email + password against ERPNext (Frappe login endpoint). */
export async function verifyErpCredentials(email: string, password: string): Promise<boolean> {
  if (!isErpConfigured()) {
    return password.length >= 8;
  }

  const res = await fetch(`${ERPNEXT_BASE_URL}/api/method/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr: email, pwd: password }),
    cache: "no-store"
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string };
  return res.ok && data?.message === "Logged In";
}

export async function getPortalProfile(email: string): Promise<PortalProfile | null> {
  const user = await findUserByEmail(email);
  const customer = await getCustomerByEmail(email);

  if (!user && !customer) return null;

  return {
    email,
    name: user?.full_name || user?.first_name || customer?.customer_name || email.split("@")[0],
    phone: customer?.mobile_no || "",
    erpUser: user?.name,
    customerId: customer?.name
  };
}

/** Register: Customer + User + Contact, with password. */
export async function registerPortalAccount(args: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<PortalProfile> {
  if (!isErpConfigured()) {
    return { email: args.email, name: args.name, phone: args.phone };
  }

  const existingUser = await findUserByEmail(args.email);
  if (existingUser?.enabled) {
    throw new Error("An account with this email already exists. Please sign in.");
  }

  const customer = await findOrCreateCustomer({
    name: args.name,
    email: args.email,
    phone: args.phone
  });
  if (!customer) throw new Error("Could not create customer record");

  const { firstName } = splitName(args.name);
  const user = await createOrUpdateErpUser({
    email: args.email,
    firstName,
    password: args.password
  });

  await linkContactToCustomer({
    name: args.name,
    email: args.email,
    phone: args.phone,
    customerName: customer.name
  });

  return {
    email: args.email,
    name: args.name,
    phone: args.phone,
    erpUser: user.name,
    customerId: customer.name
  };
}

/** Login: verify password, return profile. */
export async function loginPortalAccount(args: {
  email: string;
  password: string;
}): Promise<PortalProfile> {
  if (!isErpConfigured()) {
    if (args.password.length < 8) throw new Error("Invalid email or password");
    return {
      email: args.email,
      name: args.email.split("@")[0],
      phone: ""
    };
  }

  const valid = await verifyErpCredentials(args.email, args.password);
  if (!valid) throw new Error("Invalid email or password");

  const profile = await getPortalProfile(args.email);
  if (!profile) {
    throw new Error("Account not found. Please register first.");
  }

  return profile;
}
