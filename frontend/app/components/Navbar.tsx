import "../css/Navbar.css";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import NavbarCartCount from "./NavbarCartCount";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <div className="navbar-cover">
        <div className="navbar-logo-container">
          <Link href={"/"}>
            <Image width={140} height={0} src="/whiteblacklyonmain.png" alt="blacklyonlogo" className="navbar-logo" />
          </Link>
        </div>
        <div className="navbar-btns-container">
          <Link href={"/store"} className="navbar-btn">SHOP</Link>
          <Link href={"/cart"} className="navbar-icon-btn" target="_blank" rel="noopener noreferrer">
            <FaShoppingCart /><p><NavbarCartCount/></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
