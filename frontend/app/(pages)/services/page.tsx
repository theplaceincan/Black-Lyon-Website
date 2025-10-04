import css from "./Services.module.css"
import Link from "next/link"

export default function Services() {

  return (
    <div className={css["container"]}>
      <p className={css["page-title"]}>Services</p>
      {/* <p className={css["page-description"]}></p> */}
      <div className={css["services-container"]}>
        <Link href={'/services/birthdays'} className={css["service-card"]} style={{backgroundImage: `url("/biniyam-photos/5.jpeg")`}}>
          <div className={css["card-cover"]}>
            <p className={css["card-title"]}>Birthdays</p>
          </div>
        </Link>
        <div className="p-3"></div>
        <Link href={'/services/stunts'} className={css["service-card"]} style={{backgroundImage: `url("/biniyam-photos/7.jpeg")`}}>
          <div className={css["card-cover"]}>
            <p className={css["card-title"]}>Stunts</p>
          </div>       
        </Link>
        <div className="p-3"></div>
        <Link href={'/services/stunts'} className={css["service-card"]} style={{backgroundImage: `url("/biniyam-photos/7.jpeg")`}}>
          <div className={css["card-cover"]}>
            <p className={css["card-title"]}>Personal Training</p>
          </div>       
        </Link>
        <div className="p-3"></div>
        <Link href={'/services/stunts'} className={css["service-card"]} style={{backgroundImage: `url("/biniyam-photos/7.jpeg")`}}>
          <div className={css["card-cover"]}>
            <p className={css["card-title"]}>Circus Performance</p>
          </div>       
        </Link>
        <div className="p-3"></div>
        <Link href={'/services/stunts'} className={css["service-card"]} style={{backgroundImage: `url("/biniyam-photos/7.jpeg")`}}>
          <div className={css["card-cover"]}>
            <p className={css["card-title"]}>Performing</p>
          </div>       
        </Link>
      </div>
    </div>
  )
}