import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_LINES_UPDATE } from "../../../services/queries";

const COOKIE = "bl_cartId";

export async function POST(req: Request) {
  try {
    const { lineId, quantity } = await req.json();
    if (!lineId || typeof quantity !== "number") {
      return NextResponse.json({ ok: false, error: "Missing lineId or quantity" }, { status: 400 });
    }
    const jar = await cookies();
    const cartId = jar.get(COOKIE)?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<any>({
      query: CART_LINES_UPDATE,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      cache: "no-store",
    });
    const err = data?.cartLinesUpdate?.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

    return NextResponse.json({ ok: true, cart: data.cartLinesUpdate.cart });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Internal error" }, { status: 500 });
  }
}
