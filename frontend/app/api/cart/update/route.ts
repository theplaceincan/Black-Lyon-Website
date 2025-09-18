import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_LINES_UPDATE } from "../../../services/queries";

import type { CartResponse, CartUserError } from "../../../types/cart";

type Vars = { cartId: string; lines: { id: string; quantity: number }[] };
type Data = { cartLinesUpdate: { cart: CartResponse | null; userErrors: CartUserError[] } };

export async function POST(req: Request) {
  try {
    const { lineId, quantity } = (await req.json()) as { lineId?: string; quantity?: number };
    if (!lineId || typeof quantity !== "number") {
      return NextResponse.json({ ok: false, error: "Missing lineId or quantity" }, { status: 400 });
    }

    const jar = await cookies();
    const cartId = jar.get("bl_cartId")?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<Data, Vars>({
      query: CART_LINES_UPDATE,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      cache: "no-store",
    });

    const err = data.cartLinesUpdate.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

    return NextResponse.json({ ok: true, cart: data.cartLinesUpdate.cart });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
