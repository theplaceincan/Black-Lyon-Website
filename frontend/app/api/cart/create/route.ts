import { NextResponse } from "next/server";
import { shopifyFetch } from "../../../lib/shopify";
import { CART_CREATE } from "../../../services/queries";

export async function POST(req: Request) {
  try {
    const { merchandiseId, quantity = 1 } = await req.json().catch(() => ({}));
    if (!merchandiseId) {
      return NextResponse.json({ ok: false, error: "Missing merchandiseId" }, { status: 400 });
    }

    const data = await shopifyFetch({
      query: CART_CREATE,
      variables: { lines: [{ merchandiseId, quantity }] },
\    });

    const err = data.cartCreate?.userErrors?.[0]?.message;
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 });

    const checkoutUrl = data.cartCreate?.cart?.checkoutUrl;
    return NextResponse.json({ ok: true, checkoutUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Internal error" }, { status: 500 });
  }
}
