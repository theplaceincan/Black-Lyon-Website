"use client";
import { useState } from "react";

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

  const onClick = async () => {
    if (busy || added) return;
    setBusy(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to add to cart");
      }

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
      className={`${className ?? ""} ${added ? "added" : ""}`.trim()}
    >
      {added ? "ADDED" : "ADD TO CART"}
    </button>
  );
}
