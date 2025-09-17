'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import css from "./Cart.module.css";

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          image?: { url: string; altText?: string | null };
          product?: { title: string; handle: string };
          price?: { amount: string; currencyCode: string };
        }
      }
    }[]
  };
};

export default function CartContents() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const syncBadge = (c: Cart | null) => {
    const qty = c?.totalQuantity ?? 0;
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total: qty } }));
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/cart/get", { cache: "no-store" });
    const json = await res.json();
    setCart(json.cart ?? null);
    syncBadge(json.cart ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const clearAll = async () => {
    const res = await fetch("/api/cart/clear", { method: "POST" });
    const json = await res.json();
    setCart(json.cart ?? null);
    syncBadge(json.cart ?? null);
  };

  const removeLine = async (lineId: string) => {
    setCart(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: {
          edges: prev.lines.edges.filter(e => e.node.id !== lineId)
        },
        totalQuantity: Math.max(0, prev.totalQuantity - (prev.lines.edges.find(e => e.node.id === lineId)?.node.quantity ?? 0))
      };
    });
    const res = await fetch("/api/cart/remove", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId }),
    });
    const json = await res.json();
    setCart(json.cart ?? null);
    syncBadge(json.cart ?? null);
  };

  const changeQty = async (lineId: string, qty: number) => {
    if (qty < 1) return removeLine(lineId);
    setCart(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: {
          edges: prev.lines.edges.map(e => e.node.id === lineId ? { node: { ...e.node, quantity: qty } } : e)
        }
      } as Cart;
    });
    const res = await fetch("/api/cart/update", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, quantity: qty }),
    });
    const json = await res.json();
    setCart(json.cart ?? null);
    syncBadge(json.cart ?? null);
  };

  const safeLines = (cart?.lines?.edges ?? [])
    .map(e => e?.node)
    .filter((n): n is NonNullable<typeof n> => Boolean(n && n.merchandise));

  if (loading) return <p className={css["empty"]}>Loading…</p>;
  if (!cart || safeLines.length === 0) {
    return (
      <>
        <div className={css["cart-start-actions-container"]} />
        <p className={css["empty"]}>Your cart is empty.</p>
        <Link href="/store">
          <button className={css["empty-shop-btn"]}><p>Start Shopping</p></button>
        </Link>
      </>
    );
  }

  return (
    <>
      <div className={css["cart-start-actions-container"]}>
        <button className={css["cart-clear-btn"]} onClick={clearAll}>Clear</button>
      </div>

      <div className={css["items-container"]}>
        {safeLines.map((line) => {
          const v = line.merchandise!;
          const img = v.image?.url ?? null;
          const title = v.product?.title ?? v.title ?? "Item";
          const price = Number(v.price?.amount ?? "0");
          const handle = v.product?.handle || "";

          return (
            <div key={line.id} className={css["item-card"]}>
              <div className={css["item-card-info-cover"]}>
                <div className={css["item-img-cover"]}>
                  {img ? (
                    <Image
                      className={css["item-img"]}
                      src={img}
                      width={70}
                      height={70}
                      alt={v.image?.altText ?? title}
                    />
                  ) : (
                    <div className={css["item-img-placeholder"]} aria-label="No image" />
                  )}
                </div>

                <div className={css["item-card-texts"]}>
                  {handle ? (
                    <Link href={`/${handle}`} className={css["item-card-title"]}>{title}</Link>
                  ) : (
                    <span className={css["item-card-title"]}>{title}</span>
                  )}
                  <p className={css["item-card-price"]}>${price.toFixed(2)}</p>

                  <div className={css["qty-row"]}>
                    <button onClick={() => changeQty(line.id, line.quantity - 1)} className={css["qty-btn"]}>–</button>
                    <span className={css["qty"]}>{line.quantity}</span>
                    <button onClick={() => changeQty(line.id, line.quantity + 1)} className={css["qty-btn"]}>＋</button>
                  </div>
                </div>
              </div>

              <div className={css["item-card-actions"]}>
                <button onClick={() => removeLine(line.id)} className={css["remove-item-btn"]} title="Remove">🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={css["cart-end-actions-container"]}>
        <a className={css["cart-buy-btn"]} href={cart.checkoutUrl}>Buy Now</a>
      </div>
    </>
  );
}
