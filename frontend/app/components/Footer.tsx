import "../css/Footer.css";
import { FaInstagram } from 'react-icons/fa';
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>BLACK LYON ENTERTAINMENT</h2>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/store">Shop</Link></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <Link href="https://www.instagram.com/johnnyflayy/" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
            <Link href="https://www.instagram.com/msf.creates/" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
            <Link href="https://www.instagram.com/biniyam_shibre/" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
            <Link href="https://www.instagram.com/ben.hurrrr/" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 BLACK LYON ENTERTAINMENT. All Rights Reserved.</p>
      </div>
    </footer>
  );
}