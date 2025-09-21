// types/cart.ts

export type MoneyV2 = { amount: string; currencyCode: string };

// --- Minimal product bits your UI reads ---
export type FeaturedImage = { url: string; altText?: string | null };
export type ProductLite = {
  handle?: string | null;
  title?: string | null;
  featuredImage?: FeaturedImage | null;
};

// Shopify "merchandise" is a Variant; we only need a few fields.
export type MerchandiseLite = {
  id: string;
  title?: string | null;     // fallback if product.title missing
  product?: ProductLite | null;
};

// Line costs your UI reads for totals
export type LineCost = {
  totalAmount?: MoneyV2;
  amountPerQuantity?: MoneyV2;
};

// --- Lines ---
export type CartLine = {
  id: string;
  quantity: number;
  // previous shape was { id?: string } — keep compatible but richer now:
  merchandise?: MerchandiseLite | null;
  cost?: LineCost;
};

// --- Cart ---
export type Cart = {
  id: string;
  checkoutUrl?: string;
  totalQuantity?: number; // your Navbar count & notifications read this
  lines: { edges: { node: CartLine }[] }; // make it required; easier for UI
};

// Backward-compat alias with your old name:
export type CartResponse = Cart;

// --- API helper types (so you never need `any`) ---
export type CartUserError = { message: string };
export type CartLineInput = { merchandiseId: string; quantity: number };

export type CartAddBody = { merchandiseId: string; quantity?: number };
export type CartUpdateBody = { lineId: string; quantity: number };
export type CartRemoveBody = { lineId: string };

// Every cart API route should return this
export type CartAPIResponse = {
  ok: boolean;
  cart: Cart | null;
  error?: string;
};