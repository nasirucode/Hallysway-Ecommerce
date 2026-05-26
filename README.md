# Hally's Way Concept — Ecommerce (Next.js + ERPNext)

A modern, animated Ecommerce site for **Hally's Way Concept** built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand and TypeScript. Backed by **ERPNext** (Frappe REST API) at `https://api.hallysway.com` for products, customers, sales orders and invoices.

## Stack

- **Next.js 14** — App Router, RSC, route handlers
- **Tailwind CSS** — design system tokens for navy + red brand
- **Framer Motion** — page, list and component animations
- **Zustand** — persisted cart store
- **TanStack Query** — client data fetching
- **ERPNext REST API** — Item, Customer, Sales Order, Sales Invoice
- **Server-only signed-cookie session** — light auth wired to ERPNext customers

## Getting started

```bash
cp .env.example .env.local   # fill in your ERPNext keys
npm install
npm run dev
```

> Without ERPNext credentials the app uses local seed data so you can still develop and demo the full UI.

## ERPNext configuration

Create an API key for a user with appropriate permissions in ERPNext, then set:

```env
ERPNEXT_BASE_URL=https://api.hallysway.com
ERPNEXT_API_KEY=...
ERPNEXT_API_SECRET=...
```

The server-side client (`src/lib/erpnext/client.ts`) attaches a `Authorization: token <key>:<secret>` header. The service layer (`src/lib/erpnext/service.ts`) exposes:

| Function | Description |
|---|---|
| `getProducts({ limit, categorySlug, search })` | List items from `Item` doctype |
| `getProductBySlug(slug)` | Single item by slugified name |
| `getCategories()` | Item Groups |
| `createItem({ ... })` | Create a new Item |
| `findOrCreateCustomer({ name, email, phone })` | Idempotent Customer creation |
| `createSalesOrder(payload)` | Submit a Sales Order |
| `createSalesInvoice({ ... })` | Submit a Sales Invoice |
| `listOrdersForEmail(email)` | Sales Orders for a customer |
| `listInvoicesForEmail(email)` | Sales Invoices for a customer |

## App routes

- `/` — Animated home with hero, categories, featured products, story, testimonials
- `/shop` — Product listing with category, search and sort filters
- `/shop/[slug]` — Product detail with gallery, variants, add-to-cart
- `/cart` — Full cart page + side cart drawer
- `/checkout` — Checkout that creates a Sales Order + Sales Invoice
- `/auth/login`, `/auth/register` — Light auth linked to ERPNext customers
- `/dashboard` — Mini user dashboard: overview, orders, invoices, wishlist, addresses, settings
- `/about`, `/contact` — Brand pages

## API routes

- `GET /api/products`
- `GET /api/products/[slug]`
- `POST /api/checkout` — Creates Sales Order (and optionally Sales Invoice)
- `GET /api/invoices` — Returns the signed-in customer's invoices + orders
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

## Project structure

```
src/
  app/                  Next.js App Router pages + API routes
  components/
    brand/              Logo
    cart/               Cart drawer
    dashboard/          Sidebar, stat cards
    home/               Hero, categories, featured, story, testimonials, newsletter
    layout/             Navbar, footer
    products/           Card, detail
    shop/               Header, filters
    ui/                 Section header etc.
  lib/
    erpnext/            ERPNext client, service, types, seed data
    session.ts          Signed-cookie session
    utils.ts            cn(), formatCurrency(), etc.
  store/                Zustand cart store
public/
  brand/                Logo + brand photos
  products/             Product images
  lifestyle/            Lifestyle imagery
```

## Brand

- **Navy** `#1d3a6e`, **Red** `#e92434`, **Cream** `#FBF5EC`
- Display font: **Playfair Display** · UI font: **Inter**
- Motion: spring-based hover/scroll reveals, marquee, blob blurs, layout transitions

## Next steps (suggested)

- Wire a real Payment Gateway (Paystack/Flutterwave) and link the resulting transaction to the ERPNext Sales Invoice via `Payment Entry`
- Move the cookie-only session to NextAuth with ERPNext as a credentials provider, or implement Frappe's `frappe.client.login`
- Add inventory checks before checkout (`erpresource.method("frappe.client.get", { doctype: "Bin", filters: ... })`)
- Build the LMS app in a separate folder (`/lms`) sharing the design system
