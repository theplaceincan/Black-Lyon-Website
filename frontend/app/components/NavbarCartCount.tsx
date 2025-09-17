'use client';
import { useEffect, useState } from "react";

export default function NavbarCartCount() {
  const [count, setCount] = useState<number>(0);

  const refresh = async () => {
    const res = await fetch("/api/cart/get", { cache: "no-store" });
    const json = await res.json();
    setCount(json?.cart?.totalQuantity ?? 0);
  };

  useEffect(() => {
    refresh();
    const onUpdate = (e: any) => setCount(e.detail?.total ?? 0);
    window.addEventListener("cart:updated", onUpdate as EventListener);
    return () => window.removeEventListener("cart:updated", onUpdate as EventListener);
  }, []);

  return <span>({count})</span>;
}
