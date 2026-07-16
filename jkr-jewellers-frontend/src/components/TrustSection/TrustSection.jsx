import "./TrustSection.css";
import { FaCertificate, FaGem, FaLock, FaTruck } from "react-icons/fa";

function TrustSection() {
  return (
    <section className="trust-section">

      <h2>Why Choose JKR Jewellers?</h2>

      <div className="trust-container">

        <div className="trust-card">
          <FaCertificate className="trust-icon" />
          <h3>Hallmarked</h3>
          <p>Every jewellery piece is certified for complete authenticity.</p>
        </div>

        <div className="trust-card">
          <FaGem className="trust-icon" />
          <h3>Premium Quality</h3>
          <p>Crafted with superior quality gold and silver jewellery.</p>
        </div>

        <div className="trust-card">
          <FaLock className="trust-icon" />
          <h3>Secure Payments</h3>
          <p>100% safe and secure payment gateway.</p>
        </div>

        <div className="trust-card">
          <FaTruck className="trust-icon" />
          <h3>Fast Delivery</h3>
          <p>Fast and insured delivery across India.</p>
        </div>

      </div>

    </section>
  );
}

export default TrustSection;