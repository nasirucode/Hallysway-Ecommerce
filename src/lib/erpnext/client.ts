// Server-only ERPNext client. Do not import in client components.
// Uses Frappe / ERPNext REST API with token authentication.
// Docs: https://frappeframework.com/docs/user/en/api/rest

import "server-only";

const BASE_URL = (process.env.ERPNEXT_BASE_URL || "https://api.hallysway.com").replace(/\/+$/, "");
const API_KEY = process.env.ERPNEXT_API_KEY || "";
const API_SECRET = process.env.ERPNEXT_API_SECRET || "";

export interface ErpRequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined | null | object>;
  // When true, errors are swallowed and `null` is returned. Useful for graceful fallback.
  soft?: boolean;
}

function buildQuery(query?: ErpRequestOptions["query"]) {
  if (!query) return "";
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    search.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export async function erp<T = any>(path: string, options: ErpRequestOptions = {}): Promise<T | null> {
  const { query, soft, headers, ...rest } = options;
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}${buildQuery(query)}`;
  const hasToken = API_KEY && API_SECRET;

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(hasToken ? { Authorization: `token ${API_KEY}:${API_SECRET}` } : {}),
        ...(headers || {})
      },
      // ERPNext data should not be aggressively cached at the edge by default.
      cache: rest.cache ?? "no-store"
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (soft) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[erp] ${res.status} ${url} :: ${text.slice(0, 200)}`);
        }
        return null;
      }
      throw new Error(`ERPNext ${res.status}: ${text || res.statusText}`);
    }

    if (res.status === 204) return null;
    const data = (await res.json()) as T;
    return data;
  } catch (err) {
    if (soft) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[erp] request failed for ${url}:`, (err as Error).message);
      }
      return null;
    }
    throw err;
  }
}

// Convenience helpers for the Frappe REST DocType endpoints.
export const erpResource = {
  list: <T = any>(doctype: string, options: ErpRequestOptions = {}) =>
    erp<{ data: T[] }>(`/api/resource/${encodeURIComponent(doctype)}`, { method: "GET", ...options }),

  get: <T = any>(doctype: string, name: string, options: ErpRequestOptions = {}) =>
    erp<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
      method: "GET",
      ...options
    }),

  create: <T = any>(doctype: string, body: Record<string, any>, options: ErpRequestOptions = {}) =>
    erp<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}`, {
      method: "POST",
      body: JSON.stringify(body),
      ...options
    }),

  update: <T = any>(doctype: string, name: string, body: Record<string, any>, options: ErpRequestOptions = {}) =>
    erp<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options
    }),

  // Call a whitelisted method, e.g. erpnext.controllers.queries.item_query
  method: <T = any>(method: string, body?: Record<string, any>, options: ErpRequestOptions = {}) =>
    erp<T>(`/api/method/${method}`, {
      method: body ? "POST" : "GET",
      body: body ? JSON.stringify(body) : undefined,
      ...options
    })
};

export function isErpConfigured() {
  return Boolean(API_KEY && API_SECRET);
}

export { BASE_URL as ERPNEXT_BASE_URL };
