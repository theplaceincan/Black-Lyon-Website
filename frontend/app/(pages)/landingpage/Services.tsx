import css from "./Services.module.css"
import Link from "next/link"

export default function Services() {
  return (
    <div className={css["page-container"]}>
      <div className={css["page-cover"]}>
        <p className={css["page-title"]}>Services</p>
        <p className={css["page-description"]}>Check out what we offer</p>
        <Link href={'/services'} className={css["services-btn"]}>See Services</Link>
      </div>
    </div>
  )
}