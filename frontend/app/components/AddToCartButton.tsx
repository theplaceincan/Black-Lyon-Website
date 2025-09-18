"use client";
import { useEffect, useState } from "react";

type Props = {
  merchandiseId: string;
  className?: string;
  initialAdded?: boolean;
};

export default function AddToCartButton({
  merchandiseId,
  className = "",
  initialAdded = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(Boolean(initialAdded));

  useEffect(() => {
    setAdded(Boolean(initialAdded));
  }, [initialAdded]);

  const add = async () => {
    if (added || loading) return;
    try {
      setLoading(true);
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Add to cart failed");
      setAdded(true);
      window.dispatchEvent(new Event("cart:changed"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={add}
      disabled={added || loading}
      className={`${className} ${added ? "added-to-cart" : ""}`}
      aria-disabled={added || loading}
      aria-live="polite"
    >
      {added ? "Added" : loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
