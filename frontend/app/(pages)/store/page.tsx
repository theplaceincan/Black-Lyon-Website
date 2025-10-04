export const dynamic = "force-dynamic";

import { shopifyFetch } from "@/app/lib/shopify";
import { PRODUCTS_QUERY, CART_QUERY } from "@/app/services/queries";
import { cookies } from "next/headers";
import StoreClient from "./StoreClient";
import type { ProductConnection } from "@/app/types/shopify";

type ProductsData = { products: ProductConnection };
type ProductsVars = { first: number };

type CartLine = { node: { merchandise?: { id?: string } } };
type CartData = { cart: { lines?: { edges: CartLine[] } } | null };
type CartVars = { id: string };

export default async function Store() {
  const data = await shopifyFetch<ProductsData, ProductsVars>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
    cache: "no-store",
  });

  const jar = await cookies();
  const cartId = jar.get("bl_cartId")?.value || null;
  const inCart = new Set<string>();

  if (cartId) {
    const c = await shopifyFetch<CartData, CartVars>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });
    for (const e of c.cart?.lines?.edges ?? []) {
      const vid = e.node.merchandise?.id;
      if (vid) inCart.add(vid);
    }
  }

  const products = data.products.edges.map(e => e.node);
  return <StoreClient products={products} inCartIds={[...inCart]} />;
}

// import StoreComingSoon from "./StoreComingSoon";
// export default function Store() {
//   return (
//     <StoreComingSoon/>
//   )
// }