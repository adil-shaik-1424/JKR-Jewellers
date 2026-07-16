import "./Footer.css";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}

        <div className="footer-column">

          <img
            src="/logo.jpg"
            alt="JKR Jewellers"
            className="footer-logo"
          />

          <p>
            JKR Jewellers has been providing premium gold and silver jewellery
            with trust, elegance, and quality since 2020.
          </p>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          <p>
            <FaPhoneAlt /> +91 9100672233
          </p>

          <p>
            <FaPhoneAlt /> +91 7382572233
          </p>

          <p>
            <FaWhatsapp /> +91 7382572233
          </p>

          <p>
            <FaInstagram /> @jkr_jewellers_pvtltd
          </p>

          <p>
            <FaEnvelope /> jkrjewellers1@gmail.com
          </p>

          <p>
            <FaMapMarkerAlt /> Nellore, Andhra Pradesh
          </p>

        </div>

      </div>

      <hr />

      <div className="copyright">

        <p>© 2026 JKR Jewellers. All Rights Reserved.</p>

        <p>Since 2020 | Proprietor:Shaik Abbas</p>

      </div>

    </footer>
  );
}

export default Footer;