import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_CREATE, CART_LINES_ADD, CART_QUERY } from "../../../services/queries";

const COOKIE = "bl_cartId";

export async function POST(req: Request) {
  try {
    const { merchandiseId, quantity = 1 } = await req.json();
    if (!merchandiseId) {
      return NextResponse.json({ ok: false, error: "Missing merchandiseId" }, { status: 400 });
    }

    const jar = await cookies();
    let cartId = jar.get(COOKIE)?.value || ""; 

    if (!cartId) {
      const created = await shopifyFetch<any>({
        query: CART_CREATE,
        variables: { lines: [{ merchandiseId, quantity }] },
        cache: "no-store"
      });
      const err = created?.cartCreate?.userErrors?.[0]?.message;
      if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

      cartId = created.cartCreate.cart.id;
      jar.set(COOKIE, cartId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
      return NextResponse.json({ ok: true, cart: created.cartCreate.cart });
    }

    const added = await shopifyFetch<any>({
      query: CART_LINES_ADD,
      variables: { cartId, lines: [{ merchandiseId, quantity }] },
      cache: "no-store"
    });
    const err = added?.cartLinesAdd?.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

    return NextResponse.json({ ok: true, cart: added.cartLinesAdd.cart });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Internal error" }, { status: 500 });
  }
}
