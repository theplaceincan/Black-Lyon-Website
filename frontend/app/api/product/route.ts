import { NextResponse } from "next/server";
import { shopifyFetch } from "../../lib/shopify";
import { PRODUCTS_QUERY } from "../../services/queries";

export async function GET() {
  const data = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
    usePrivateToken: true,
  });
  return NextResponse.json(data);
}
