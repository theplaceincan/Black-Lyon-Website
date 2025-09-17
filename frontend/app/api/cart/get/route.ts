import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_QUERY } from "../../../services/queries";

const COOKIE = "bl_cartId";

export async function GET() {
  try {
    const jar = cookies();
    const cartId = jar.get(COOKIE)?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<any>({ query: CART_QUERY, variables: { id: cartId } });
    return NextResponse.json({ ok: true, cart: data.cart });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Internal error" }, { status: 500 });
  }
}
