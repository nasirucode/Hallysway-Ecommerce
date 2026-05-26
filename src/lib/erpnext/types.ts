// Frontend-facing product representation, normalized from ERPNext Item.
export interface Product {
  id: string; // ERPNext item_code
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category?: string;
  categorySlug?: string;
  stock?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  weight?: string;
  unit?: string;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
}

// Cart line item kept on the client.
export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

// Checkout payload sent from client to our API route.
export interface CheckoutPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    line1: string;
    city: string;
    state: string;
    country?: string;
    postalCode?: string;
  };
  items: { itemCode: string; quantity: number; rate: number }[];
  notes?: string;
}

// Normalized representation of a Sales Invoice from ERPNext.
export interface InvoiceSummary {
  name: string;
  postingDate: string;
  customer: string;
  grandTotal: number;
  outstanding: number;
  status: string;
  currency: string;
  items?: { itemCode: string; itemName: string; qty: number; rate: number; amount: number }[];
}

export interface OrderSummary {
  name: string;
  transactionDate: string;
  customer: string;
  grandTotal: number;
  status: string;
  currency: string;
}
