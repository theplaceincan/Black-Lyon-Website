"use client";
import { useState } from "react";
import type { Cart } from "../types/shopify";

type AddResponse = Cart;

export default function AddToCartButton({
  merchandiseId,
  className,
}: { merchandiseId: string; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const add = async () => {
    if (added) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      const json: AddResponse = await res.json();
      if (json?.id) setAdded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={add}
      className={`${className ?? ""} ${added ? "added-to-cart" : ""}`}
      disabled={loading || added}
      aria-pressed={added}
    >
      {added ? "Added" : loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
