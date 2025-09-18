import css from "./Cart.module.css";
import CartContents from "./CartContents";

export const dynamic = "force-dynamic";

export default function Cart() {
  return (
    <div className={css["container"]}>
      <p className={css["page-title"]}>Cart</p>

      <div className={css["cart-system-cover"]}>
        <CartContents />
      </div>
    </div>
  );
}
