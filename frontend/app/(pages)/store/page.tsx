import Image from "next/image";
import css from "./Store.module.css";
import { shopifyFetch } from "../../lib/shopify";
import { PRODUCTS_QUERY } from "../../services/queries";
import AddToCartButton from "@/app/components/AddToCartButton";

export default async function Store() {
  const data = await shopifyFetch<{ products: { edges: any[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first: 20 },
  });

  const products = data.products.edges.map((e) => e.node);

  return (
    <div className={css["container"]}>
      <div className={css["search-container"]}>
        <input placeholder="Search Products" className={css["search"]} />
      </div>

      <div className={css["products-container"]}>
        {products.map((p) => {
          const variantId = p.variants.edges[0]?.node.id;
          return (
            <div key={p.id} className={css["product-card"]}>
              <div className={css["product-img"]}>
                {p.featuredImage && (
                  <Image
                    className={css["product-img-tag"]}
                    width={300}
                    height={300}
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
                  />
                )}
              </div>

              <div className={css["product-text-cover"]}>
                <p className={css["product-title"]}>{p.title}</p>
                <p className={css["product-price"]}>
                  ${Number(p.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              </div>

              <div className={css["product-btn-cover"]}>
                {variantId ? (
                  <AddToCartButton merchandiseId={variantId} className={css["cart-btn"]} />
                ) : (
                  <button className={css["cart-btn"]} disabled>Unavailable</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
