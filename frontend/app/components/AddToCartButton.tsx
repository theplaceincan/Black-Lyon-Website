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
      const res = await fetch("/api/cart/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity: 1 }),
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json().catch(() => ({}))
        : { ok: false, error: await res.text() };

      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || `HTTP ${res.status}`);
      }

      window.location.href = payload.checkoutUrl;
    } catch (err: any) {
      alert(err?.message || "Failed to add to cart");
      console.error(err);
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
