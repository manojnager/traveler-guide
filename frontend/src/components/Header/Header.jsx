import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import ROUTES from "../../constants/routes";
import navigation from "../../data/navigation";
import headerLogo from "../../assets/images/logos/logomain.png";
import whiteLogo from "../../assets/images/logos/logotrans.png";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/image";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    navigate("/");
  };

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

          {/* Mobile-only account links, shown inside the collapsed nav */}
          <li className="mobile-account-links">
            {isAuthenticated ? (
              <>
                <NavLink to="/account" onClick={() => setMobileMenu(false)}>My Account</NavLink>
                <button type="button" onClick={() => { setMobileMenu(false); handleLogout(); }}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setMobileMenu(false)}>Login</NavLink>
            )}
          </li>
        </ul>
      </nav>

      <div className="header-actions">
        {isAuthenticated ? (
          <div className="account-menu" ref={accountMenuRef}>
            <button
              type="button"
              className="account-trigger"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
            >
              {user?.avatar ? (
                <img src={getImageUrl(user.avatar)} alt={user.firstName} className="account-trigger-avatar" />
              ) : (
                <FaUserCircle />
              )}
              <span>{user?.firstName}</span>
            </button>

            {accountMenuOpen && (
              <div className="account-dropdown">
                <NavLink to="/account" onClick={() => setAccountMenuOpen(false)}>My Account</NavLink>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="login-link">
            Login
          </NavLink>
        )}

        <NavLink
          to={ROUTES.BOOKING}
          className="book-btn"
        >
          Book Now
        </NavLink>
      </div>

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