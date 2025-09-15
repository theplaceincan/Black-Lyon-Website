import css from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <div className={css["hero-container"]}>
      <h1 className={css["hero-header"]}>
        <span className="green">BLACK</span>
        <span className="yellow"> LYON </span>
        <span className="red">STUDIOS</span>
        </h1>
      <Link href={"/store"} className={css["hero-btn"]}>
        <p className={css["btn-text"]}>SEE THE SHOP</p>
      </Link>
    </div>
  );
}