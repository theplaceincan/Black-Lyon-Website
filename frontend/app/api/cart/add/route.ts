import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_CREATE, CART_LINES_ADD, CART_QUERY /*, CART_LINES_UPDATE */ } from "../../../services/queries";

const COOKIE = "bl_cartId";

type CartUserError = { message: string };
type CartCreateData = { cartCreate: { cart: { id: string } | null; userErrors: CartUserError[] } };
type CartCreateVars = { lines: { merchandiseId: string; quantity: number }[] };

type CartAddData = { cartLinesAdd: { cart: any; userErrors: CartUserError[] } };
type CartAddVars = { cartId: string; lines: { merchandiseId: string; quantity: number }[] };

type CartGetData = {
  cart: {
    id: string;
    totalQuantity?: number;
    lines: { edges: { node: { id: string; quantity: number; merchandise: { id: string } } }[] };
  } | null;
};
type CartGetVars = { id: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { merchandiseId?: string; quantity?: number };
    const merchandiseId = body.merchandiseId;
    const quantity = Number.isFinite(Number(body.quantity)) ? Math.max(1, Number(body.quantity)) : 1;

    if (!merchandiseId) {
      return NextResponse.json({ ok: false, error: "Missing merchandiseId" }, { status: 400 });
    }

    const jar = await cookies();
    let cartId = jar.get(COOKIE)?.value || "";

    if (!cartId) {
      const created = await shopifyFetch<CartCreateData, CartCreateVars>({
        query: CART_CREATE,
        variables: { lines: [{ merchandiseId, quantity }] },
        cache: "no-store",
      });
      const err = created.cartCreate.userErrors?.[0]?.message;
      if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

      const cart = created.cartCreate.cart;
      if (!cart) return NextResponse.json({ ok: false, error: "No cart returned" }, { status: 500 });

      cartId = cart.id;
      jar.set(COOKIE, cartId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
      return NextResponse.json({ ok: true, cart });
    }

    const current = await shopifyFetch<CartGetData, CartGetVars>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });

    const lines = current.cart?.lines?.edges ?? [];
    const existing = lines.find((e) => e?.node?.merchandise?.id === merchandiseId);

    if (existing) {
      return NextResponse.json({ ok: true, cart: current.cart });
    }

    const added = await shopifyFetch<CartAddData, CartAddVars>({
      query: CART_LINES_ADD,
      variables: { cartId, lines: [{ merchandiseId, quantity }] },
      cache: "no-store",
    });
    const err = added.cartLinesAdd.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

    return NextResponse.json({ ok: true, cart: added.cartLinesAdd.cart });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
