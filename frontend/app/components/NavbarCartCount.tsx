"use client";
import useSWR from "swr";
import { Cart } from "../types/shopify";

const fetcher = (url: string) => fetch(url).then(r => r.json() as Promise<Cart | null>);

export default function NavbarCartCount() {
  const { data } = useSWR("/api/cart/get", fetcher, { revalidateOnFocus: false });
  const count = data?.totalQuantity ?? 0;
  return <span>{count}</span>;
}
