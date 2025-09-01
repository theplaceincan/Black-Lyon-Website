import css from "./Hero.module.css"

export default function Hero() {
  return (
    <div className={css["container"]}>
      <div className={css["hero-container"]}>
        <div className={css["text-container"]}>
          <p className={[css["hero-title"], css["green"]].join(" ")}>REALITY TV</p>
          <p className={[css["hero-title"], css["yellow"]].join(" ")}>MMA FIGHTER</p>
          <p className={[css["hero-title"], css["red"]].join(" ")}>DANCER</p>
        </div>
        <div className={css["img-container"]}>
          {/* <img className={css["hero-img"]} src="/biniyam1.avif"></img> */}
        </div>
      </div>
    </div>
  )
}