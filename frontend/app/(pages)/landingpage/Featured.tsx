import css from "./Featured.module.css";
import Image from "next/image";
import Link from "next/link";
import { FEATURED_COLLECTION_PRODUCTS } from "../../services/queries";
import { shopifyFetch } from "@/app/lib/shopify";
import type { Product, ProductConnection } from "../../types/shopify";

type Vars = { handle: string; first: number };
type Data = { collection: { products: ProductConnection } | null };

export default async function Featured() {
  const data = await shopifyFetch<Data, Vars>({
    query: FEATURED_COLLECTION_PRODUCTS,
    variables: { handle: "featured", first: 4 },
    cache: "no-store",
  });

  const products: Product[] = data.collection?.products.edges.map(e => e.node) ?? [];

  return (
    <div className={css.container}>
      <p className={css["page-title"]}>FEATURED COLLECTION</p>
      <div className={css["featured-products-container"]}>
        {products.map((p, i) => (
          <div key={p.id ?? p.handle ?? `product-${i}`} className={css["product-card"]}>
            <Link href={`/${p.handle ?? ""}`} className={css["product-img"]}>
              {p.featuredImage && (
                <Image
                  width={300}
                  height={300}
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText ?? p.title}
                />
              )}
            </Link>

            <div className={css["product-text-cover"]}>
              <p className={css["product-title"]}>{p.title}</p>
              <p className={css["product-price"]}>
                {p.priceRange?.minVariantPrice?.amount
                  ? `$${Number(p.priceRange.minVariantPrice.amount).toFixed(2)}`
                  : "—"}
              </p>
            </div>

            <div className={css["product-btn-cover"]}>
              <button className={css["cart-btn"]}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      <Link href="/store"><button className={css["more-btn"]}>See More</button></Link>
    </div>
  );
}
