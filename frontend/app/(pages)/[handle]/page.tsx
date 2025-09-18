import css from "./Handle.module.css";
import Image from "next/image";
import AddToCartButton from "@/app/components/AddToCartButton";
import { shopifyFetch } from "../../lib/shopify";
import Link from "next/link";
import type { Product } from "../../types/shopify";

const PRODUCT_BY_HANDLE =`
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      images(first: 1) { edges { node { url altText width height } } }
      variants(first: 50) {
        edges { node { id title availableForSale price { amount currencyCode } } }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
    }
  }
`;

type Data = { product: Product | null };
type Vars = { handle: string };

export default async function ItemPage({ params }: { params: { handle: string } }) {
  const data = await shopifyFetch<Data, Vars>({
    query: PRODUCT_BY_HANDLE,
    variables: { handle: params.handle },
    cache: "no-store",
  });

  const product = data.product ?? undefined;
  const variant = product?.variants?.edges?.[0]?.node;
  const variantId: string | undefined = variant?.id;
  const available = Boolean(variant?.availableForSale);
  const initialAdded = false;

  return (
    <>
      <div className={css["container"]}>
        <div className={css["info-section"]}>
          <div className={css["img-section"]}>
            <Image
              width={350}
              height={300}
              src={product?.images?.edges?.[0]?.node?.url ?? "/lyon.png"}
              alt={product?.images?.edges?.[0]?.node?.altText ?? "item image"}
            />
          </div>
          <div className="p-3" />
          <div className={css["text-section"]}>
            <p className={css["title"]}>{product?.title}</p>
            <p className={css["price"]}>
              {variant?.price?.amount} {variant?.price?.currencyCode}
            </p>
            <p className={css["desc"]}>{product?.description}</p>
            <div className="p-3" />
            <div className={css["actions-section"]}>
              {available && variantId ? (
                <div>
                  <AddToCartButton
                    merchandiseId={variantId}
                    className={css["cart-btn"]}
                    initialAdded={initialAdded}
                  />
                  <Link className={css["buy-btn"]} href="/cart">
                    Buy Now
                  </Link>
                </div>
              ) : (
                <button className={css["cart-btn"]} disabled>
                  Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5" />
    </>
  );
}
