// app/lib/shopify.ts
import "server-only";
import { GraphQLResponse } from "../types/shopify";

type ShopifyFetchOptions<V extends Record<string, unknown> | undefined = undefined> = {
  query: string;
  variables?: V;
  cache?: RequestCache | "no-store";
  tags?: string[];
};

export async function shopifyFetch<TData, V extends Record<string, unknown> | undefined = undefined>(
  { query, variables, cache = "no-store", tags }: ShopifyFetchOptions<V>
): Promise<TData> {
  const res = await fetch(process.env.SHOPIFY_STORE_DOMAIN as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_API_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<TData>;
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("No data returned from Shopify");
  }
  return json.data;
}
