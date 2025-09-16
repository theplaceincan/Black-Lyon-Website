import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-01";
  const pub = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN || "";
  const priv = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || "";

  const mask = (t: string) => (t ? `${t.slice(0,6)}…${t.slice(-4)} (${t.length})` : "<empty>");

  return NextResponse.json({
    endpoint: `https://${domain}/api/${version}/graphql.json`,
    publicToken: mask(pub),
    privateToken: mask(priv),
    hasPublic: !!pub,
    hasPrivate: !!priv,
  });
}
