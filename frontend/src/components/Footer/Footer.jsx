import { Link } from "react-router-dom";
import footerLogo from "../../assets/images/logos/footer.png";
import "./Footer.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={footerLogo} alt="Traveler Guide" className="footer-logo" />
            <p>
              Discover extraordinary destinations through handcrafted luxury journeys, exceptional
              hospitality and unforgettable experiences around the world.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/packages">Luxury Packages</Link></li>
              <li><Link to="/experiences">Experiences</Link></li>
              <li><Link to="/travel-journal">Travel Journal</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>Jaipur, Rajasthan</li>
              <li>+91 98765 43210</li>
              <li>hello@travelerguide.com</li>
              <li>Mon - Sat : 9 AM - 7 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TravelerGuide. All Rights Reserved.</p>
          <button type="button" className="back-top" onClick={scrollToTop}>
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;