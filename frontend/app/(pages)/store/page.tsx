import Image from "next/image";
import Link from "next/link";
import css from "./Store.module.css";
import { shopifyFetch } from "../../lib/shopify";
import { PRODUCTS_QUERY, CART_QUERY } from "../../services/queries";
import AddToCartButton from "@/app/components/AddToCartButton";
import { cookies } from "next/headers";

export default async function Store() {
  const data = await shopifyFetch<{ products: { edges: { node: any }[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
    cache: "no-store",
  });

  const jar = await cookies();
  const cartId = jar.get("bl_cartId")?.value || null;
  const inCart = new Set<string>();

  if (cartId) {
    const c = await shopifyFetch<{ cart: any }>({
      query: CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });
    for (const e of c.cart?.lines?.edges ?? []) {
      const vid = e.node?.merchandise?.id;
      if (vid) inCart.add(vid);
    }
  }

  const products = data.products.edges.map(e => e.node);

  return (
    <div className={css.container}>
      <div className={css["search-container"]}>
        <input placeholder="Search Products" className={css.search} />
      </div>

      <div className={css["products-container"]}>
        {products.map((p: any) => {
          const variantId = p.variants?.edges?.[0]?.node?.id as string | undefined;
          const initialAdded = !!variantId && inCart.has(variantId);

          return (
            <div key={p.id} className={css["product-card"]}>
              <Link href={`/${p.handle}`} className={css["product-img"]}>
                {p.featuredImage && (
                  <Image
                    className={css["product-img-tag"]}
                    width={300}
                    height={300}
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
                  />
                )}
              </Link>

              <div className={css["product-text-cover"]}>
                <Link href={`/product/${p.handle}`} className={css["product-title-link"]}>
                  <p className={css["product-title"]}>{p.title}</p>
                </Link>
                <p className={css["product-price"]}>
                  ${Number(p.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              </div>

              <div className={css["product-btn-cover"]}>
                {variantId ? (
                  <AddToCartButton
                    merchandiseId={variantId}
                    className={css["cart-btn"]}
                    initialAdded={initialAdded}
                  />
                ) : (
                  <button className={css["cart-btn"]} disabled>
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
