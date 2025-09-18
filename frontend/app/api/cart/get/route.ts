import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_QUERY } from "../../../services/queries";

import type { CartResponse } from "../../../types/cart";

type Vars = { id: string };
type Data = { cart: CartResponse | null };

export async function GET() {
  try {
    const jar = await cookies();
    const cartId = jar.get("bl_cartId")?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<Data, Vars>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });
    return NextResponse.json({ ok: true, cart: data.cart });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
