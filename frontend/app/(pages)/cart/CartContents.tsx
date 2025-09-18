"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MoneyV2 = { amount: string; currencyCode: string };

type CartLineNode = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title?: string | null;
    product?: {
      handle?: string | null;
      title?: string | null;
      featuredImage?: { url: string; altText?: string | null } | null;
    } | null;
  };
  cost?: {
    totalAmount?: MoneyV2;
    amountPerQuantity?: MoneyV2;
  };
};

type Cart = {
  id: string;
  checkoutUrl?: string;
  lines: { edges: { node: CartLineNode }[] };
};

export default function CartContents() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyLine, setBusyLine] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cart/get", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load cart");
      const json = (await res.json()) as { cart: Cart | null };
      setCart(json.cart ?? null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const subtotal = useMemo(() => {
    const lines = cart?.lines?.edges ?? [];
    const sum = lines.reduce((acc, e) => {
      const amt = Number(e.node.cost?.totalAmount?.amount ?? 0);
      return acc + (isFinite(amt) ? amt : 0);
    }, 0);
    return sum;
  }, [cart]);

  const emitCartChanged = () => window.dispatchEvent(new Event("cart:changed"));

  const updateQty = async (lineId: string, quantity: number) => {
    if (quantity < 1) return removeLine(lineId);
    try {
      setBusyLine(lineId);
      setError(null);
      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      await load();
      emitCartChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyLine(null);
    }
  };

  const removeLine = async (lineId: string) => {
    try {
      setBusyLine(lineId);
      setError(null);
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      });
      if (!res.ok) throw new Error("Failed to remove item");
      await load();
      emitCartChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyLine(null);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const res = await fetch("/api/cart/clear", { method: "POST" });
      if (!res.ok) throw new Error("Failed to clear cart");
      await load();
      emitCartChanged();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) return <p>Loading cart…</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const lines = cart?.lines?.edges ?? [];

  if (!cart || lines.length === 0) {
    return (
      <div>
        <p>Your cart is empty.</p>
        <Link href="/store" className="underline">Continue shopping →</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y">
        {lines.map(({ node }) => {
          const title =
            node.merchandise.product?.title ??
            node.merchandise.title ??
            "Product";
          const handle = node.merchandise.product?.handle ?? "";
          const priceEach = Number(node.cost?.amountPerQuantity?.amount ?? 0);
          const lineTotal = Number(node.cost?.totalAmount?.amount ?? priceEach * node.quantity);

          return (
            <li key={node.id} className="py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">
                  {handle ? <Link href={`/${handle}`} className="underline">{title}</Link> : title}
                </div>
                <div className="text-sm opacity-70">${priceEach.toFixed(2)} each</div>
                <div className="mt-2 inline-flex items-center gap-2">
                  <button
                    onClick={() => updateQty(node.id, node.quantity - 1)}
                    disabled={busyLine === node.id}
                    className="px-2 py-1 border rounded"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{node.quantity}</span>
                  <button
                    onClick={() => updateQty(node.id, node.quantity + 1)}
                    disabled={busyLine === node.id}
                    className="px-2 py-1 border rounded"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeLine(node.id)}
                    disabled={busyLine === node.id}
                    className="ml-4 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right font-medium">
                ${lineTotal.toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-lg font-semibold">Subtotal</div>
        <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={clearCart} className="underline">
          Clear cart
        </button>
        {cart.checkoutUrl ? (
          <a href={cart.checkoutUrl} className="px-4 py-2 border rounded">
            Checkout
          </a>
        ) : null}
      </div>
    </div>
  );
}
