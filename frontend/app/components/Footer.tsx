import "../css/Footer.css";
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

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
            <li><a href="/">Home</a></li>
            <li><a href="/store">Shop</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/johnnyflayy/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.instagram.com/msf.creates/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.instagram.com/biniyam_shibre/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.instagram.com/ben.hurrrr/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 BLACK LYON ENTERTAINMENT. All Rights Reserved.</p>
      </div>
    </footer>
  );
}