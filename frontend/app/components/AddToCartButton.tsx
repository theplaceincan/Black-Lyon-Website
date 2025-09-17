'use client';
import { useState } from "react";

export default function AddToCartButton({
  merchandiseId,
  className,
}: { merchandiseId: string; className?: string }) {
  const [loading, setLoading] = useState(false);

  const add = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to add");

      // notify listeners (navbar) about new total
      const qty = json.cart?.totalQuantity ?? 0;
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total: qty } }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={add} disabled={loading} className={className}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
