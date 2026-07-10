import "./Header.css";
import { NavLink } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";

import ROUTES from "../../constants/routes";
import navigation from "../../data/navigation";

import headerLogo from "../../assets/images/logos/logomain.png";
import whiteLogo from "../../assets/images/logos/logotrans.png";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
      <NavLink to="/" className="logo">
        <img
          src={scrolled ? whiteLogo : headerLogo}
          alt="Traveler Guide"
        />
      </NavLink>

      <nav className={`navigation ${mobileMenu ? "open" : ""}`}>
        <ul>
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileMenu(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <NavLink
        to={ROUTES.BOOKING}
        className="book-btn"
      >
        Book Now
      </NavLink>

      <button
        className="menu-toggle"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <HiOutlineXMark /> : <HiOutlineBars3 />}
      </button>
    </div>
  </header>
);
}

export default Header;