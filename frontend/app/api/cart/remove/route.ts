import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_LINES_REMOVE, CART_QUERY } from "../../../services/queries";

// const COOKIE = "bl_cartId";

export async function POST(req: Request) {
  try {
    const { lineId } = await req.json();
    if (!lineId) return NextResponse.json({ ok: false, error: "Missing lineId" }, { status: 400 });

    const jar = await cookies();
    const cartId = jar.get("bl_cartId")?.value;
    if (!cartId) return NextResponse.json({ ok: true, cart: null });

    const data = await shopifyFetch<any>({
      query: CART_LINES_REMOVE,
      variables: { cartId, lineIds: [lineId] },
      cache: "no-store",
    });

    return NextResponse.json({ ok: true, cart: data.cartLinesRemove.cart });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Internal error" }, { status: 500 });
  }
}
