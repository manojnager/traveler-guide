import "./Header.css";

import headerLogo from "../../assets/images/logos/logomain.png";
import whiteLogo from "../../assets/images/logos/logotrans.png";

import { useEffect, useState } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-container">

        <a href="/" className="logo">
          <img
            src={scrolled ? whiteLogo : headerLogo}
            alt="Traveler Guide"
          />
        </a>

        <nav className="navigation">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>

            <li>
              <a href="/">Destinations</a>
            </li>

            <li>
              <a href="/">Experiences</a>
            </li>

            <li>
              <a href="/">Packages</a>
            </li>

            <li>
              <a href="/">Journal</a>
            </li>

            <li>
              <a href="/">Contact</a>
            </li>
          </ul>
        </nav>

        <button className="book-btn">
          Book Now
        </button>

      </div>
    </header>
  );
}

export default Header;