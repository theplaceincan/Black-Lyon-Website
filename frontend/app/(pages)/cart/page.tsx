import css from "./Cart.module.css"
import Image from "next/image"
import Link from "next/link"

export default function Cart() {
  return (
    <div className={css["container"]}>
      <p className={css["page-title"]}>Cart</p>
      <div className={css["cart-system-cover"]}>
        <div className={css["cart-start-actions-container"]}>
          <button className={css["cart-clear-btn"]}>
            Clear
          </button>
        </div>
        <div className={css["items-container"]}>
          <div className={css["item-card"]}>
            <div className={css["item-card-info-cover"]}>
              <div className={css["item-img-cover"]}>
                <Image className={css["item-img"]} src={'/lyon.png'} width={70} height={0} alt="img"></Image>
              </div>
              <div className={css["item-card-texts"]}>
                <Link href={'/'} className={css["item-card-title"]}>New Product Title</Link>
                <p className={css["item-card-price"]}>$30.00</p>
              </div>
            </div>
            <div className={css["item-card-actions"]}>
              <button className={css["remove-item-btn"]}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={css["cart-end-actions-container"]}>
          <button className={css["cart-buy-btn"]}>Buy Now</button>
        </div>
       </div>
    </div>
  )
}