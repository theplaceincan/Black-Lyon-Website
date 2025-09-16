import css from "./Featured.module.css"
import Image from "next/image"
import Link from "next/link"

export default function Featured() {
  return (
    <div className={css["container"]}>
      <p className={css["page-title"]}>THE OFFICIAL COLLECTION</p>
      <div className={css["featured-products-container"]}>
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
      <Link href={'/store'}>
        <button className={css["more-btn"]}>
          See More
        </button>
      </Link>
    </div>
  )
}