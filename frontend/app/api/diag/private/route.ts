import { NextResponse } from "next/server";
import { shopifyFetch } from "../../../lib/shopify";

export async function GET() {
  try {
    const data = await shopifyFetch<{ shop: { name: string } }>({
      query: `query { shop { name } }`,
      usePrivateToken: true,
    });
    return NextResponse.json({ ok: true, shop: data.shop.name });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
