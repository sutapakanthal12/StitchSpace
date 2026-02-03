import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About StitchSpace</h4>
          <p>
            Bridging tradition and the digital age by connecting artisans,
            learners, and conscious buyers through authentic textile crafts.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/workshops">Workshops</a>
            </li>
            <li>
              <a href="/marketplace">Marketplace</a>
            </li>
            <li>
              <a href="/community">Community</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: hello@stitchspace.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#instagram">Instagram</a>
            <a href="#twitter">Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} StitchSpace. All rights reserved. |{" "}
          <a href="#privacy">Privacy Policy</a> |{" "}
          <a href="#terms">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
