import "../css/Navbar.css"

export default function Navbar() {
  return (
    <div className="navbar-container">
      <div className="navbar-cover">
        <a href={"/"} className="navbar-title">BINIYAM SHIBRE</a>
        <div className="navbar-btns-container">
          <button className="navbar-btn">ABOUT</button>
          <button className="navbar-btn">SHOP</button>
        </div>
      </div>
    </div>
  )
}