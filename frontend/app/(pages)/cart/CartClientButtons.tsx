'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveLineButton({ lineId, className }: { lineId: string; className?: string }) {
  const r = useRouter();
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    const res = await fetch("/api/cart/remove", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId }),
    });
    const json = await res.json();
    const qty = json?.cart?.totalQuantity ?? 0;
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total: qty } }));
    r.refresh();
  };
  return <button onClick={onClick} className={className} disabled={busy} title="Remove">X</button>;
}

export function ClearCartButton({ className }: { className?: string }) {
  const r = useRouter();
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    const res = await fetch("/api/cart/clear", { method: "POST" });
    const json = await res.json();
    const qty = json?.cart?.totalQuantity ?? 0;
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { total: qty } }));
    r.refresh();
  };
  return <button onClick={onClick} className={className} disabled={busy}>Clear</button>;
}
