import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SHOPIFY_STORE_DOMAIN: !!process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_API_TOKEN: !!process.env.SHOPIFY_STOREFRONT_API_TOKEN,
    SHOPIFY_STOREFRONT_API_PRIVATE_TOKEN: !!process.env.SHOPIFY_STOREFRONT_API_PRIVATE_TOKEN,
    VALUE_PREVIEW: process.env.SHOPIFY_STORE_DOMAIN?.slice(0, 40)
  });
}
