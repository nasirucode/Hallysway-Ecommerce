// High-level service layer mapping ERPNext data to UI types.
// Falls back to seed data when ERPNext is not configured so the site
// always renders for development and demos.

import "server-only";
import { erp, erpResource, isErpConfigured, ERPNEXT_BASE_URL } from "./client";
import type {
  Product,
  Category,
  CheckoutPayload,
  InvoiceSummary,
  OrderSummary
} from "./types";
import { seedCategories, seedProducts, seedFindBySlug } from "./seed";
import { slugify } from "../utils";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "NGN";
const SELLING_PRICE_LIST = process.env.ERPNEXT_SELLING_PRICE_LIST || "Standard Selling";
const COMPARE_PRICE_LIST = process.env.ERPNEXT_COMPARE_PRICE_LIST || ""; // optional, for strike-through "compare at" pricing

interface ErpItem {
  name: string;
  item_code: string;
  item_name: string;
  description?: string;
  standard_rate?: number;
  stock_uom?: string;
  image?: string;
  item_group?: string;
  brand?: string;
  has_variants?: 0 | 1;
  disabled?: 0 | 1;
  is_sales_item?: 0 | 1;
}

interface ErpItemPrice {
  name: string;
  item_code: string;
  price_list: string;
  price_list_rate: number;
  currency?: string;
  valid_from?: string;
  valid_upto?: string;
}

function encodeImageUrl(url: string) {
  try {
    const u = new URL(url);
    u.pathname = u.pathname
      .split("/")
      .map((segment) => {
        if (!segment) return segment;
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join("/");
    return u.toString();
  } catch {
    return encodeURI(url);
  }
}

function absoluteImage(url?: string) {
  if (!url) return "";
  const base = ERPNEXT_BASE_URL.replace(/\/+$/, "");
  const full = url.startsWith("http")
    ? url
    : url.startsWith("/files") || url.startsWith("/private")
      ? `${base}${url}`
      : url;
  return full.startsWith("http") ? encodeImageUrl(full) : full;
}

interface ItemPriceMap {
  selling: Map<string, { rate: number; currency: string }>;
  compare: Map<string, { rate: number; currency: string }>;
}

// Fetch Item Price rows for the configured selling (and optional compare) price lists.
// Returns maps keyed by item_code for fast lookup during item normalization.
async function getItemPriceMap(itemCodes?: string[]): Promise<ItemPriceMap> {
  const empty: ItemPriceMap = { selling: new Map(), compare: new Map() };
  if (!isErpConfigured()) return empty;

  const priceLists = [SELLING_PRICE_LIST, COMPARE_PRICE_LIST].filter(Boolean);
  if (!priceLists.length) return empty;

  const today = new Date().toISOString().split("T")[0];
  const filters: any[] = [
    ["selling", "=", 1],
    ["price_list", "in", priceLists]
  ];
  if (itemCodes && itemCodes.length) filters.push(["item_code", "in", itemCodes]);

  const res = await erpResource.list<ErpItemPrice>("Item Price", {
    query: {
      fields: JSON.stringify([
        "name",
        "item_code",
        "price_list",
        "price_list_rate",
        "currency",
        "valid_from",
        "valid_upto"
      ]),
      filters: JSON.stringify(filters),
      limit_page_length: 2000
    },
    soft: true
  });

  const rows = res?.data || [];
  for (const row of rows) {
    if (row.valid_from && row.valid_from > today) continue;
    if (row.valid_upto && row.valid_upto < today) continue;
    const bucket = row.price_list === SELLING_PRICE_LIST ? empty.selling : empty.compare;
    bucket.set(row.item_code, {
      rate: Number(row.price_list_rate) || 0,
      currency: row.currency || CURRENCY
    });
  }
  return empty;
}

function normalizeItem(item: ErpItem, prices?: ItemPriceMap): Product {
  const slug = slugify(item.item_name || item.item_code);
  const img = absoluteImage(item.image);
  const selling = prices?.selling.get(item.item_code);
  const compare = prices?.compare.get(item.item_code);
  const price = selling?.rate ?? item.standard_rate ?? 0;
  const compareAt = compare?.rate && compare.rate > price ? compare.rate : undefined;
  return {
    id: item.item_code,
    name: item.item_name || item.item_code,
    slug,
    description: item.description,
    price,
    compareAtPrice: compareAt,
    currency: selling?.currency || compare?.currency || CURRENCY,
    images: img ? [img] : ["/products/hally-tea-blend.jpg"],
    category: item.item_group,
    categorySlug: item.item_group ? slugify(item.item_group) : undefined,
    unit: item.stock_uom
  };
}

export async function getProducts(opts: { limit?: number; categorySlug?: string; search?: string } = {}): Promise<Product[]> {
  if (!isErpConfigured()) {
    let list = [...seedProducts];
    if (opts.categorySlug) list = list.filter((p) => p.categorySlug === opts.categorySlug);
    if (opts.search) {
      const q = opts.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (opts.limit) list = list.slice(0, opts.limit);
    return list;
  }

  const filters: any[] = [["is_sales_item", "=", 1], ["disabled", "=", 0]];
  if (opts.search) filters.push(["item_name", "like", `%${opts.search}%`]);

  const res = await erpResource.list<ErpItem>("Item", {
    query: {
      fields: JSON.stringify([
        "name",
        "item_code",
        "item_name",
        "description",
        "standard_rate",
        "stock_uom",
        "image",
        "item_group",
        "brand"
      ]),
      filters: JSON.stringify(filters),
      limit_page_length: opts.limit ?? 60
    },
    soft: true
  });

  if (!res?.data?.length) return seedProducts.slice(0, opts.limit ?? 8);

  const itemCodes = res.data.map((it) => it.item_code);
  const prices = await getItemPriceMap(itemCodes);
  return res.data.map((it) => normalizeItem(it, prices));
}

// Lightweight helper: fetch the live selling rate for a single item from Item Price.
// Falls back to the item's standard_rate when no Item Price row exists.
export async function getItemRate(itemCode: string): Promise<number | null> {
  if (!isErpConfigured()) {
    const seed = seedProducts.find((p) => p.id === itemCode);
    return seed?.price ?? null;
  }
  const prices = await getItemPriceMap([itemCode]);
  const selling = prices.selling.get(itemCode);
  if (selling) return selling.rate;
  const item = await erpResource.list<ErpItem>("Item", {
    query: {
      fields: JSON.stringify(["item_code", "standard_rate"]),
      filters: JSON.stringify([["item_code", "=", itemCode]]),
      limit_page_length: 1
    },
    soft: true
  });
  return item?.data?.[0]?.standard_rate ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!isErpConfigured()) {
    return seedProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
  const list = await getProducts({ limit });
  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isErpConfigured()) {
    return seedFindBySlug(slug) ?? null;
  }
  const list = await getProducts({ limit: 200 });
  return list.find((p) => p.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  if (!isErpConfigured()) return seedCategories;
  const res = await erpResource.list<{ name: string; description?: string; image?: string }>(
    "Item Group",
    {
      query: {
        fields: JSON.stringify(["name", "description", "image"]),
        filters: JSON.stringify([["is_group", "=", 0]]),
        limit_page_length: 50
      },
      soft: true
    }
  );
  if (!res?.data?.length) return seedCategories;
  return res.data.map((g) => ({
    slug: slugify(g.name),
    name: g.name,
    description: g.description,
    image: absoluteImage(g.image) || "/products/hally-tea-blend.jpg"
  }));
}

// -- Customers ----------------------------------------------------------

export async function findOrCreateCustomer(args: {
  name: string;
  email: string;
  phone: string;
}) {
  if (!isErpConfigured()) {
    return { name: `GUEST::${args.email}`, customer_name: args.name } as any;
  }

  const existing = await erpResource.list<{ name: string; customer_name: string }>("Customer", {
    query: {
      fields: JSON.stringify(["name", "customer_name"]),
      filters: JSON.stringify([["email_id", "=", args.email]]),
      limit_page_length: 1
    },
    soft: true
  });

  if (existing?.data?.length) return existing.data[0];

  const created = await erpResource.create<{ name: string; customer_name: string }>("Customer", {
    customer_name: args.name,
    customer_type: "Individual",
    customer_group: "Individual",
    territory: "Nigeria",
    email_id: args.email,
    mobile_no: args.phone
  });

  return created?.data ?? null;
}

// -- Customer addresses --------------------------------------------------

interface AddressInput {
  customerName: string;
  customerLabel: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  addressType?: "Shipping" | "Billing";
}

/**
 * Find addresses already linked to a Customer via the Dynamic Link child
 * table that ERPNext uses to relate Address → Customer.
 */
async function findAddressesForCustomer(customerName: string): Promise<string[]> {
  const links = await erpResource.list<{ parent: string }>("Dynamic Link", {
    query: {
      fields: JSON.stringify(["parent"]),
      filters: JSON.stringify([
        ["parenttype", "=", "Address"],
        ["link_doctype", "=", "Customer"],
        ["link_name", "=", customerName]
      ]),
      limit_page_length: 200
    },
    soft: true
  });
  return (links?.data || []).map((l) => l.parent).filter(Boolean);
}

/**
 * Create or update an ERPNext Address record linked to the given Customer.
 * Looks up addresses already attached to the customer; if one matches the
 * incoming line1+city it's updated in place, otherwise a brand new Address
 * is created with the customer link.
 */
export async function upsertCustomerAddress(
  input: AddressInput
): Promise<{ name: string } | null> {
  if (!isErpConfigured()) return null;

  const addressType = input.addressType || "Shipping";
  const title = `${input.customerLabel} - ${addressType}`;

  let existingName: string | null = null;
  const linkedAddressNames = await findAddressesForCustomer(input.customerName);
  if (linkedAddressNames.length) {
    const linked = await erpResource.list<{
      name: string;
      address_line1?: string;
      city?: string;
    }>("Address", {
      query: {
        fields: JSON.stringify(["name", "address_line1", "city"]),
        filters: JSON.stringify([["name", "in", linkedAddressNames]]),
        limit_page_length: 200
      },
      soft: true
    });

    const match = (linked?.data || []).find(
      (a) =>
        (a.address_line1 || "").trim().toLowerCase() === input.line1.trim().toLowerCase() &&
        (a.city || "").trim().toLowerCase() === input.city.trim().toLowerCase()
    );
    existingName = match?.name ?? null;
  }

  const body: Record<string, any> = {
    address_title: title,
    address_type: addressType,
    address_line1: input.line1,
    address_line2: input.line2 || undefined,
    city: input.city,
    state: input.state,
    country: input.country || "Nigeria",
    pincode: input.postalCode || undefined,
    phone: input.phone || undefined,
    email_id: input.email || undefined,
    is_primary_address: 1,
    is_shipping_address: addressType === "Shipping" ? 1 : 0,
    links: [{ link_doctype: "Customer", link_name: input.customerName }]
  };

  try {
    if (existingName) {
      const updated = await erpResource.update<{ name: string }>("Address", existingName, body);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[erp] address updated: ${existingName} → customer ${input.customerName}`);
      }
      return updated?.data ?? { name: existingName };
    }
    const created = await erpResource.create<{ name: string }>("Address", body);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[erp] address created: ${created?.data?.name} → customer ${input.customerName}`);
    }
    return created?.data ?? null;
  } catch (err) {
    console.warn(`[erp] address upsert failed for ${input.customerName}:`, (err as Error).message);
    return null;
  }
}

// -- Sales Orders / Invoices --------------------------------------------

export async function createSalesOrder(payload: CheckoutPayload) {
  const customer = await findOrCreateCustomer(payload.customer);
  if (!customer) throw new Error("Could not resolve customer");

  if (!isErpConfigured()) {
    return {
      name: `SO-DEMO-${Date.now()}`,
      customer: customer.name,
      grand_total: payload.items.reduce((sum, it) => sum + it.rate * it.quantity, 0),
      status: "Draft"
    };
  }

  const shippingAddress = await upsertCustomerAddress({
    customerName: customer.name,
    customerLabel: payload.customer.name,
    email: payload.customer.email,
    phone: payload.customer.phone,
    line1: payload.shipping.line1,
    city: payload.shipping.city,
    state: payload.shipping.state,
    country: payload.shipping.country,
    postalCode: payload.shipping.postalCode,
    addressType: "Shipping"
  });

  const body: Record<string, any> = {
    customer: customer.name,
    delivery_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    items: payload.items.map((it) => ({
      item_code: it.itemCode,
      qty: it.quantity,
      rate: it.rate
    })),
    customer_name: payload.customer.name,
    contact_email: payload.customer.email,
    contact_mobile: payload.customer.phone,
    remarks: payload.notes || ""
  };

  if (shippingAddress?.name) {
    body.customer_address = shippingAddress.name;
    body.shipping_address_name = shippingAddress.name;
  } else {
    body.address_display = `${payload.shipping.line1}, ${payload.shipping.city}, ${payload.shipping.state}`;
  }

  const order = await erpResource.create<any>("Sales Order", body);
  return order?.data;
}

export async function createSalesInvoice(args: {
  customerEmail: string;
  salesOrderName?: string;
  payload?: CheckoutPayload;
}) {
  if (!args.payload) throw new Error("payload required for invoice");

  const customer = await findOrCreateCustomer(args.payload.customer);
  if (!customer) throw new Error("Could not resolve customer");

  if (!isErpConfigured()) {
    return {
      name: `INV-DEMO-${Date.now()}`,
      customer: customer.name,
      posting_date: new Date().toISOString().split("T")[0],
      grand_total: args.payload.items.reduce((s, it) => s + it.rate * it.quantity, 0),
      outstanding_amount: 0,
      status: "Paid",
      currency: CURRENCY
    };
  }

  const shippingAddress = await upsertCustomerAddress({
    customerName: customer.name,
    customerLabel: args.payload.customer.name,
    email: args.payload.customer.email,
    phone: args.payload.customer.phone,
    line1: args.payload.shipping.line1,
    city: args.payload.shipping.city,
    state: args.payload.shipping.state,
    country: args.payload.shipping.country,
    postalCode: args.payload.shipping.postalCode,
    addressType: "Shipping"
  });

  const body: Record<string, any> = {
    customer: customer.name,
    posting_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    items: args.payload.items.map((it) => ({
      item_code: it.itemCode,
      qty: it.quantity,
      rate: it.rate
    })),
    update_stock: 1,
    contact_email: args.payload.customer.email,
    contact_mobile: args.payload.customer.phone,
    remarks: args.payload.notes || ""
  };

  if (shippingAddress?.name) {
    body.customer_address = shippingAddress.name;
    body.shipping_address_name = shippingAddress.name;
  } else {
    body.address_display = `${args.payload.shipping.line1}, ${args.payload.shipping.city}, ${args.payload.shipping.state}`;
  }

  const invoice = await erpResource.create<any>("Sales Invoice", body);
  return invoice?.data;
}

export async function listInvoicesForEmail(email: string): Promise<InvoiceSummary[]> {
  if (!isErpConfigured()) {
    return [
      {
        name: "INV-DEMO-0001",
        postingDate: new Date().toISOString().split("T")[0],
        customer: "Demo Customer",
        grandTotal: 12500,
        outstanding: 0,
        status: "Paid",
        currency: CURRENCY
      }
    ];
  }

  const customer = await erpResource.list<{ name: string }>("Customer", {
    query: {
      fields: JSON.stringify(["name"]),
      filters: JSON.stringify([["email_id", "=", email]]),
      limit_page_length: 1
    },
    soft: true
  });

  const customerName = customer?.data?.[0]?.name;
  if (!customerName) return [];

  const invoices = await erpResource.list<any>("Sales Invoice", {
    query: {
      fields: JSON.stringify([
        "name",
        "posting_date",
        "customer",
        "grand_total",
        "outstanding_amount",
        "status",
        "currency"
      ]),
      filters: JSON.stringify([["customer", "=", customerName]]),
      order_by: "posting_date desc",
      limit_page_length: 50
    },
    soft: true
  });

  return (invoices?.data || []).map((inv: any) => ({
    name: inv.name,
    postingDate: inv.posting_date,
    customer: inv.customer,
    grandTotal: inv.grand_total,
    outstanding: inv.outstanding_amount,
    status: inv.status,
    currency: inv.currency || CURRENCY
  }));
}

export async function listOrdersForEmail(email: string): Promise<OrderSummary[]> {
  if (!isErpConfigured()) {
    return [
      {
        name: "SO-DEMO-0001",
        transactionDate: new Date().toISOString().split("T")[0],
        customer: "Demo Customer",
        grandTotal: 12500,
        status: "To Deliver and Bill",
        currency: CURRENCY
      }
    ];
  }
  const customer = await erpResource.list<{ name: string }>("Customer", {
    query: {
      fields: JSON.stringify(["name"]),
      filters: JSON.stringify([["email_id", "=", email]]),
      limit_page_length: 1
    },
    soft: true
  });
  const customerName = customer?.data?.[0]?.name;
  if (!customerName) return [];

  const orders = await erpResource.list<any>("Sales Order", {
    query: {
      fields: JSON.stringify([
        "name",
        "transaction_date",
        "customer",
        "grand_total",
        "status",
        "currency"
      ]),
      filters: JSON.stringify([["customer", "=", customerName]]),
      order_by: "transaction_date desc",
      limit_page_length: 50
    },
    soft: true
  });

  return (orders?.data || []).map((o: any) => ({
    name: o.name,
    transactionDate: o.transaction_date,
    customer: o.customer,
    grandTotal: o.grand_total,
    status: o.status,
    currency: o.currency || CURRENCY
  }));
}

// -- Item creation -------------------------------------------------------

export async function createItem(args: {
  itemCode: string;
  itemName: string;
  itemGroup?: string;
  rate?: number;
  compareAtRate?: number;
  description?: string;
  uom?: string;
}) {
  if (!isErpConfigured()) {
    return {
      name: args.itemCode,
      item_code: args.itemCode,
      item_name: args.itemName,
      standard_rate: args.rate ?? 0
    };
  }
  const created = await erpResource.create<any>("Item", {
    item_code: args.itemCode,
    item_name: args.itemName,
    item_group: args.itemGroup || "Products",
    stock_uom: args.uom || "Nos",
    standard_rate: args.rate ?? 0,
    is_sales_item: 1,
    is_stock_item: 1,
    description: args.description || ""
  });

  if (args.rate !== undefined) {
    await upsertItemPrice({
      itemCode: args.itemCode,
      rate: args.rate,
      priceList: SELLING_PRICE_LIST
    }).catch(() => null);
  }
  if (args.compareAtRate !== undefined && COMPARE_PRICE_LIST) {
    await upsertItemPrice({
      itemCode: args.itemCode,
      rate: args.compareAtRate,
      priceList: COMPARE_PRICE_LIST
    }).catch(() => null);
  }

  return created?.data;
}

// Create or update an Item Price row for the given item + price list.
export async function upsertItemPrice(args: {
  itemCode: string;
  rate: number;
  priceList?: string;
  currency?: string;
}) {
  if (!isErpConfigured()) return null;
  const priceList = args.priceList || SELLING_PRICE_LIST;

  const existing = await erpResource.list<ErpItemPrice>("Item Price", {
    query: {
      fields: JSON.stringify(["name"]),
      filters: JSON.stringify([
        ["item_code", "=", args.itemCode],
        ["price_list", "=", priceList]
      ]),
      limit_page_length: 1
    },
    soft: true
  });

  if (existing?.data?.length) {
    const updated = await erpResource.update<ErpItemPrice>("Item Price", existing.data[0].name, {
      price_list_rate: args.rate,
      currency: args.currency || CURRENCY
    });
    return updated?.data;
  }

  const created = await erpResource.create<ErpItemPrice>("Item Price", {
    item_code: args.itemCode,
    price_list: priceList,
    price_list_rate: args.rate,
    currency: args.currency || CURRENCY,
    selling: 1
  });
  return created?.data;
}
