const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-01";
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN!;
const PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

const ENDPOINT = `https://${DOMAIN}/api/${VERSION}/graphql.json`;

type FetchArgs = {
  query: string;
  variables?: Record<string, any>;
  usePrivateToken?: boolean;
};

export async function shopifyFetch<T>({
  query,
  variables = {},
  usePrivateToken = false,
}: FetchArgs): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token":
      usePrivateToken && PRIVATE_TOKEN ? PRIVATE_TOKEN : PUBLIC_TOKEN,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: any) => e.message).join(" | "));
  }
  return json.data;
}
