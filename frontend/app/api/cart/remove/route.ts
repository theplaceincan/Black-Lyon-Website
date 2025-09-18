import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_LINES_REMOVE } from "../../../services/queries";

import type { CartResponse, CartUserError } from "../../../types/cart";

type Vars = { cartId: string; lineIds: string[] };
type Data = { cartLinesRemove: { cart: CartResponse | null; userErrors: CartUserError[] } };

export async function POST(req: Request) {
  try {
    const { lineId } = (await req.json()) as { lineId?: string };
    if (!lineId) return NextResponse.json({ ok: false, error: "Missing lineId" }, { status: 400 });

    const jar = await cookies();
    const cartId = jar.get("bl_cartId")?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<Data, Vars>({
      query: CART_LINES_REMOVE,
      variables: { cartId, lineIds: [lineId] },
      cache: "no-store",
    });

    return NextResponse.json({ ok: true, cart: data.cartLinesRemove.cart });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
