// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import gmail from "../assets/images/gmail-svgrepo-com.svg";
import facebook from "../assets/images/facebook-svgrepo-com.svg";
import whatsapp from "../assets/images/whatsapp-svgrepo-com.svg";
import instagram from "../assets/images/instagram-167-svgrepo-com.svg";

// Footer component
function Footer() {
  return (
    <footer className="footer">
      {/* Wrapper for footer content */}
      <div className="footer__wrap">
        {/* Left section: Slogan and Social Media Links */}
        <div className="left">
          {/* Slogan for the footer */}
          <div className="slogan">Discover, Shop, Enjoy.</div>

          {/* Social Media Links */}
          <div className="social-media">
            {/* Link to Gmail */}
            <a href="mailto:youremail@gmail.com" aria-label="Gmail">
              <img src={gmail} alt="gmail" />
            </a>
            {/* Link to Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img src={facebook} alt="facebook" />
            </a>
            {/* Link to Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src={instagram} alt="instagram" />
            </a>
            {/* Link to WhatsApp */}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Whatsapp"
            >
              <img src={whatsapp} alt="whatsapp" />
            </a>
          </div>
        </div>

        {/* Right section: List of categories */}
        <div className="right">
          {/* List of shopping categories */}
          <ul className="categories">
            <li>Home Styling</li>
            <li>Accessories</li>
            <li>Sport</li>
            <li>Toys</li>
            <li>Clothing</li>
            <li>Furnishing</li>
            <li>Work Tools</li>
            <li>Cleaning</li>
            <li>Beauty</li>
            <li>Pet Supplies</li>
            <li>Shoes</li>
            <li>Safety</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
