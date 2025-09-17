'use client';
import { useState } from "react";
import "../css/AddToCartButton.css"

export default function AddToCartButton({
  merchandiseId,
  className,
  initialAdded = false,
}: {
  merchandiseId: string;
  className?: string;
  initialAdded?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<boolean>(initialAdded);

  const add = async () => {
    if (added) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to add");

      const qty = json.cart?.totalQuantity ?? 0;
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total: qty } }));

      setAdded(true);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={add}
      disabled={loading || added}
      className={`${className ?? ""} ${added ? "added-to-cart" : ""}`}
    >
      {loading ? "Adding..." : added ? "ADDED TO CART" : "Add to Cart"}
    </button>
  );
}
