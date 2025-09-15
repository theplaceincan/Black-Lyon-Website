import css from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <div className={css["hero-container"]}>
      <h1 className={css["hero-header"]}>
        <span className={[css["mobile-effect-1"], "green"].join(' ')}>BLACK</span>
        <span className={[css["mobile-effect-2"], "yellow"].join(' ')}> LYON </span>
        <span className="red">ENTERTAINMENT</span>
        </h1>
      <Link href={"/store"} className={css["hero-btn"]}>
        <p>
          SEE THE SHOP
        </p>
      </Link>
    </div>
  );
}