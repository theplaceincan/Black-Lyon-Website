import css from "./BiniyamInfo.module.css"

export default function BiniyamInfo() {
  return (
    <div className={css["container"]}>
      <div className={css["cover"]}>
        <p className={css["page-title"]}>Meet Biniyam</p>
        <video playsInline className={css["video"]} controls preload="metadata">
          <source src="/biniyam-videos/1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}