import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_QUERY, CART_LINES_REMOVE } from "../../../services/queries";

import type { CartResponse, CartUserError } from "../../../types/cart";

type CartVars = { id: string };
type CartData = { cart: CartResponse | null };

type RemoveVars = { cartId: string; lineIds: string[] };
type RemoveData = { cartLinesRemove: { cart: CartResponse | null; userErrors: CartUserError[] } };

export async function POST() {
  try {
    const jar = await cookies();
    const cartId = jar.get("bl_cartId")?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const current = await shopifyFetch<CartData, CartVars>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });

    const lineIds =
      current.cart?.lines?.edges?.map(e => e.node.id) ?? [];

    if (!lineIds.length)
      return NextResponse.json({ ok: true, cart: current.cart });

    const data = await shopifyFetch<RemoveData, RemoveVars>({
      query: CART_LINES_REMOVE,
      variables: { cartId, lineIds },
    });

    return NextResponse.json({ ok: true, cart: data.cartLinesRemove.cart });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
