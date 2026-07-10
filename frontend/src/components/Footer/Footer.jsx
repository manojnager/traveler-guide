import "./Footer.css";
import footerLogo from "../../assets/images/logos/footer.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-top">

          <div className="footer-brand">

            <img
              src={footerLogo}
              alt="Traveler Guide"
              className="footer-logo"
            />

            <p>
              Discover extraordinary destinations through handcrafted luxury journeys, exceptional hospitality and unforgettable experiences around the world.
            </p>

            <div className="social-links">
              <a href="/">Instagram</a>
              <a href="/">Facebook</a>
              <a href="/">YouTube</a>
              <a href="/">Pinterest</a>
            </div>

          </div>

          <div className="footer-column">
            <h4>Explore</h4>

            <ul>
              <li><a href="/">Destinations</a></li>
              <li><a href="/">Luxury Packages</a></li>
              <li><a href="/">Experiences</a></li>
              <li><a href="/">Travel Journal</a></li>
              <li><a href="/">Gallery</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>

            <ul>
              <li><a href="/">Help Center</a></li>
              <li><a href="/">FAQs</a></li>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Terms & Conditions</a></li>
              <li><a href="/">Contact Us</a></li>
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

          <p>
            © 2026 TravelerGuide. All Rights Reserved.
          </p>

          <a href="#" className="back-top">
            ↑ Back to Top
          </a>

        </div>

      </div>
    </footer>
  );
}

export default Footer;