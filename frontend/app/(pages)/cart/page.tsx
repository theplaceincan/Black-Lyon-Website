import css from "./Cart.module.css";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { shopifyFetch } from "../../lib/shopify";
import { CART_QUERY } from "../../services/queries";
import { ClearCartButton, RemoveLineButton } from "./CartClientButtons";

export default async function Cart() {
  const cartId = cookies().get("bl_cartId")?.value || null;
  let cart: any = null;

  if (cartId) {
    const data = await shopifyFetch<{ cart: any }>({
      query: CART_QUERY,
      variables: { id: cartId },
    });
    cart = data.cart;
  }

  const items = cart?.lines?.edges ?? [];
  const empty = !cart || !items.length;

  return (
    <div className={css["container"]}>
      <p className={css["page-title"]}>Cart</p>

      <div className={css["cart-system-cover"]}>
        <div className={css["cart-start-actions-container"]}>
          {!empty && <ClearCartButton className={css["cart-clear-btn"]} />}
        </div>

        <div className={css["items-container"]}>
          {empty ? (
            <p className={css["empty"]}>Your cart is empty.</p>
          ) : (
            items.map((edge: any) => {
              const line = edge.node;
              const v = line.merchandise;
              const img = v.image?.url;
              const title = v.product?.title ?? v.title;
              const price = v.price?.amount;
              return (
                <div key={line.id} className={css["item-card"]}>
                  <div className={css["item-card-info-cover"]}>
                    <div className={css["item-img-cover"]}>
                      {img && <Image className={css["item-img"]} src={img} width={70} height={70} alt={title} />}
                    </div>
                    <div className={css["item-card-texts"]}>
                      <Link href={`/product/${v.product?.handle ?? ""}`} className={css["item-card-title"]}>
                        {title}
                      </Link>
                      <p className={css["item-card-price"]}>${Number(price).toFixed(2)}</p>
                      <p className={css["item-qty"]}>Qty: {line.quantity}</p>
                    </div>
                  </div>
                  <div className={css["item-card-actions"]}>
                    <RemoveLineButton lineId={line.id} className={css["remove-item-btn"]} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!empty && (
          <div className={css["cart-end-actions-container"]}>
            <a className={css["cart-buy-btn"]} href={cart.checkoutUrl}>Buy Now</a>
          </div>
        )}
      </div>
    </div>
  );
}
