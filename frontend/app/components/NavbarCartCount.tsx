"use client";
import { useEffect, useState } from "react";

export default function NavbarCartCount() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/cart/get", { cache: "no-store" });
      const json = await res.json();
      const edges = json?.cart?.lines?.edges ?? [];
      const summed = edges.reduce((n: number, e: any) => n + (e?.node?.quantity ?? 0), 0);
      setCount(json?.cart?.totalQuantity ?? summed ?? 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCount(); // initial

    const onUpdated = (e: Event) => {
      const det = (e as CustomEvent).detail;
      if (det && typeof det.total === "number") setCount(det.total);
      else fetchCount();
    };

    window.addEventListener("cart:updated", onUpdated);
    return () => window.removeEventListener("cart:updated", onUpdated);
  }, []);

  return <>{count}</>;
}
