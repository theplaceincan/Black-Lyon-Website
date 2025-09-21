"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import css from "./Cart.module.css";
import type { Cart, CartAPIResponse } from "../../types/cart";

export default function CartContents() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyLine, setBusyLine] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // local “draft” values for qty inputs
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cart/get", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; cart: Cart | null };
      setCart(json.cart ?? null);
      const dq: Record<string, string> = {};
      json.cart?.lines?.edges?.forEach(({ node }) => (dq[node.id] = String(node.quantity)));
      setDraftQty(dq);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const lines = cart?.lines?.edges ?? [];
  const subtotal = useMemo(() => {
    return lines.reduce((sum, e) => {
      const each = Number(e.node.cost?.totalAmount?.amount ?? 0);
      return sum + (isFinite(each) ? each : 0);
    }, 0);
  }, [lines]);

  const notify = (total?: number) =>
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total } }));

  const setCartFromResponse = (json: CartAPIResponse) => {
    const newCart: Cart | null = json?.cart ?? null;
    setCart(newCart);
    if (newCart) {
      const dq: Record<string, string> = {};
      newCart.lines?.edges?.forEach(({ node }) => (dq[node.id] = String(node.quantity)));
      setDraftQty(dq);
    }
  };

  const updateQty = async (lineId: string, quantity: number) => {
    if (quantity < 1) return removeLine(lineId);
    try {
      setBusyLine(lineId);
      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.error || "Failed");
      setCartFromResponse(json);
      notify(json?.cart?.totalQuantity);
    } catch (e) {
      setError((e as Error).message);
      const current = lines.find(l => l.node.id === lineId)?.node.quantity ?? 1;
      setDraftQty(d => ({ ...d, [lineId]: String(current) }));
    } finally {
      setBusyLine(null);
    }
  };

  const removeLine = async (lineId: string) => {
    try {
      setBusyLine(lineId);
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.error || "Failed");
      setCartFromResponse(json);
      notify(json?.cart?.totalQuantity);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyLine(null);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.error || "Failed");
      setCartFromResponse(json);
      notify(json?.cart?.totalQuantity ?? 0);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const commitDraft = (lineId: string) => {
    const raw = draftQty[lineId];
    const n = Math.max(1, Math.min(9999, Number(raw)));
    if (!Number.isFinite(n)) return;
    const current = lines.find(l => l.node.id === lineId)?.node.quantity ?? 1;
    if (n !== current) updateQty(lineId, n);
    else setDraftQty(d => ({ ...d, [lineId]: String(current) }));
  };

  if (loading) return <p className={css["empty"]}>Loading…</p>;
  if (error) return <p className={css["empty"]}>Error: {error}</p>;

  if (!cart || lines.length === 0) {
    return (
      <>
        <p className={css["empty"]}>Your cart is empty.</p>
        <Link href="/store"><button className={css["empty-shop-btn"]}>Shop</button></Link>
      </>
    );
  }

  return (
    <>
      <div className={css["cart-start-actions-container"]}>
        <button onClick={clearCart} className={css["cart-clear-btn"]}>Clear Cart</button>
      </div>

      <div className={css["items-container"]}>
        {lines.map(({ node }) => {
          const merch = node.merchandise;
          const product = merch?.product;

          const handle = product?.handle ?? "";
          const title = product?.title ?? merch?.title ?? "Product";
          const img = product?.featuredImage ?? null;

          // prefer totalAmount; fall back to amountPerQuantity * quantity
          const each = Number(node.cost?.amountPerQuantity?.amount ?? 0);
          const total = Number(node.cost?.totalAmount?.amount ?? 0);
          const lineTotal = Number.isFinite(total) && total > 0
            ? total
            : (Number.isFinite(each) ? each * node.quantity : 0);

          return (
            <div key={node.id} className={css["item-card"]}>
              <div className={css["item-card-info-cover"]}>
                <div className={css["item-img-cover"]}>
                  {img ? (
                    <Image className={css["item-img"]} src={img.url} width={70} height={70} alt={img.altText ?? title} />
                  ) : (
                    <Image className={css["item-img"]} src="/lyon.png" width={70} height={70} alt="product" />
                  )}
                </div>

                <div className={css["item-card-texts"]}>
                  {handle ? (
                    <Link href={`/${handle}`} className={css["item-card-title"]}>{title}</Link>
                  ) : (
                    <span className={css["item-card-title"]}>{title}</span>
                  )}
                  <p className={css["item-card-price"]}>${lineTotal.toFixed(2)}</p>
                  
                  <div className={css["item-card-actions"]}>
                    <div className={css["qty-row"]}>
                      <button
                        className={css["qty-btn"]}
                        onClick={() => updateQty(node.id, node.quantity - 1)}
                        disabled={busyLine === node.id}
                        aria-label="Decrease"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                      </button>

                      <input
                        className={css["qty"]}
                        type="number"
                        min={1}
                        value={draftQty[node.id] ?? String(node.quantity)}
                        onChange={(e) => setDraftQty(d => ({ ...d, [node.id]: e.target.value }))}
                        onBlur={() => commitDraft(node.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitDraft(node.id); }}
                        aria-label="Quantity"
                      />

                      <button
                        className={css["qty-btn"]}
                        onClick={() => updateQty(node.id, node.quantity + 1)}
                        disabled={busyLine === node.id}
                        aria-label="Increase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className={css["remove-item-btn"]}
                onClick={() => removeLine(node.id)}
                disabled={busyLine === node.id}
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className={css["cart-end-actions-container"]}>
        {cart.checkoutUrl ? (
          <a href={cart.checkoutUrl} className={css["cart-buy-btn"]}>Buy Now</a>
        ) : null}
      </div>
    </>
  );
}
