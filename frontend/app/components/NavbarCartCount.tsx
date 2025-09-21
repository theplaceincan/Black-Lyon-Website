"use client";
import { useEffect, useState } from "react";
import type { CartAPIResponse } from "../types/cart";

type QtyEdge = { node?: { quantity?: number } };

export default function NavbarCartCount() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/cart/get", { cache: "no-store" });
      const json: CartAPIResponse = await res.json();
      const edges = json?.cart?.lines?.edges ?? [];
      const summed = edges.reduce((n: number, e: QtyEdge) => n + (e?.node?.quantity ?? 0), 0);
      setCount(json?.cart?.totalQuantity ?? summed ?? 0);
    } catch {
      // ignoring
    }
  };

  useEffect(() => {
    fetchCount();

    const onUpdated = (e: Event) => {
      const det = (e as CustomEvent<{ total?: number }>).detail;
      if (det && typeof det.total === "number") setCount(det.total);
      else fetchCount();
    };

    window.addEventListener("cart:updated", onUpdated);
    return () => window.removeEventListener("cart:updated", onUpdated);
  }, []);

  return <>{count}</>;
}
