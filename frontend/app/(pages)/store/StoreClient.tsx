"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import css from "./Store.module.css";

export default function StoreClient({
  products,
  inCartIds,
}: {
  products: any[];
  inCartIds: string[];
}) {
  const [q, setQ] = useState("");
  const inCart = useMemo(() => new Set(inCartIds), [inCartIds]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return products.filter((p) =>
      (p.title ?? "").toLowerCase().includes(qq) ||
      (p.handle ?? "").toLowerCase().includes(qq) ||
      (p.description ?? "").toLowerCase().includes(qq)
    );
  }, [q, products]);

  return (
    <div className={css.container}>
      <div className={css["search-container"]}>
        <input
          placeholder="Search Products"
          className={css.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className={css["products-container"]}>
        {filtered.map((p) => {
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
                <Link href={`/${p.handle}`} className={css["product-title-link"]}>
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
                  <button className={css["cart-btn"]} disabled>Unavailable</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p>No products match “{q}”.</p>}
      </div>
    </div>
  );
}
