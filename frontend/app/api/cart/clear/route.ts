import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_QUERY, CART_LINES_REMOVE } from "../../../services/queries";

const COOKIE = "bl_cartId";

type CartLineEdge = { node: { id: string } };
type CartData = { cart: { lines?: { edges: CartLineEdge[] } } | null };
type CartVars = { id: string };

type RemoveData = { cartLinesRemove: { cart: unknown; userErrors: { message: string }[] } };
type RemoveVars = { cartId: string; lineIds: string[] };

export async function POST() {
  try {
    const jar = await cookies();
    const cartId = jar.get(COOKIE)?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const current = await shopifyFetch<CartData, CartVars>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });

    const lineIds = current.cart?.lines?.edges?.map(e => e.node.id) ?? [];
    if (!lineIds.length) return NextResponse.json({ ok: true, cart: current.cart });

    const data = await shopifyFetch<RemoveData, RemoveVars>({
      query: CART_LINES_REMOVE,
      variables: { cartId, lineIds },
    });

    return NextResponse.json({ ok: true, cart: data.cartLinesRemove.cart });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
