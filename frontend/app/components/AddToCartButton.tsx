"use client";
import { useEffect, useState } from "react";
import type { CartAPIResponse } from "../types/cart";

type HasMerchEdge = { node?: { merchandise?: { id?: string } | null } };

export default function AddToCartButton({
  merchandiseId,
  className,
  initialAdded = false,
}: {
  merchandiseId: string;
  className?: string;
  initialAdded?: boolean;
}) {
  const [added, setAdded] = useState(initialAdded);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (added) return;
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/cart/get", { cache: "no-store" });
        const json: CartAPIResponse = await res.json().catch(() => ({ ok: false, cart: null }));
        const present = (json.cart?.lines?.edges ?? []).some(
          (e: HasMerchEdge) => e?.node?.merchandise?.id === merchandiseId
        );
        if (!aborted && present) setAdded(true);
      } catch {}
    })();
    return () => {
      aborted = true;
    };
  }, [merchandiseId, added]);

  useEffect(() => {
    const onUpdated = () => {
      fetch("/api/cart/get", { cache: "no-store" })
        .then(r => r.json() as Promise<CartAPIResponse>)
        .then(json => {
          const present = (json.cart?.lines?.edges ?? []).some(
            (e: HasMerchEdge) => e?.node?.merchandise?.id === merchandiseId
          );
          if (present) setAdded(true);
        })
        .catch(() => {});
    };
    window.addEventListener("cart:updated", onUpdated);
    return () => window.removeEventListener("cart:updated", onUpdated);
  }, [merchandiseId]);

  const onClick = async () => {
    if (busy || added) return;
    setBusy(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      const json: CartAPIResponse = await res.json().catch(() => ({ ok: false, cart: null }));
      if (!res.ok || json?.ok === false) throw new Error(json?.error || "Failed to add to cart");
      setAdded(true);
      const total = json?.cart?.totalQuantity;
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total } }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || added}
      aria-busy={busy}
      className={`${className ?? ""} ${added ? "added-to-cart" : ""}`.trim()}
    >
      {busy ? "ADDING..." : added ? "ADDED" : "ADD TO CART"}
    </button>
  );
}
