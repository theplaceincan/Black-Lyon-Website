import css from "./Store.module.css";
import Image from "next/image";

export default function Store() {
  return (
    <div className={css["container"]}>
      <div className={css["search-container"]}>
        <input placeholder="Search Products" className={css["search"]}></input>
      </div>
      <div className={css["products-container"]}>
        <div className={css["product-card"]}>
          <div className={css["product-img"]}>
            <Image width={300} height={30} src={'/lyon.png'} alt="Biniyam T-Shirt"></Image>
          </div>
          <div className={css["product-text-cover"]}>
            <p className={css["product-title"]}>New Biniyam T-Shirt</p>
            <p className={css["product-price"]}>$50.00</p>
          </div>
          <div className={css["product-btn-cover"]}>
            <button className={css["cart-btn"]}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}