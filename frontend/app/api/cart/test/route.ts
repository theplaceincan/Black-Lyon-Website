import { NextResponse } from "next/server";
import { shopifyFetch } from "../../../lib/shopify";

export async function GET() {
  try {
    const data = await shopifyFetch({
      query: `mutation {
        cartCreate(input: { lines: [{ quantity: 1, merchandiseId: "fake-id" }] }) {
          cart { id checkoutUrl }
          userErrors { field message }
        }
      }`,
      usePrivateToken: true,
    });
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
