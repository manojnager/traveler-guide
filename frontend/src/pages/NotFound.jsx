import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaSearch, FaCompass, FaPaperPlane, FaMapMarkerAlt, FaSuitcase } from "react-icons/fa";

import "./NotFound.css";

function NotFound() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="nf-page">
      <div className="nf-bg-glow" />
      <div className="nf-bg-dots" />

      <FaPaperPlane className="nf-float nf-float-plane" />
      <FaMapMarkerAlt className="nf-float nf-float-pin" />
      <FaSuitcase className="nf-float nf-float-suitcase" />

      <div className="container nf-content">
        <div className="nf-compass">
          <FaCompass />
        </div>

        <span className="nf-eyebrow">Lost in Transit</span>
        <h1 className="nf-code">404</h1>
        <h2>This Destination Doesn't Exist</h2>
        <p>
          It looks like the page you're looking for has wandered off the map. Let's get you back
          on course.
        </p>

        <form className="nf-search-bar" onSubmit={handleSearch}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search destinations instead..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn-primary">
            <FaHome /> Back to Home
          </Link>
          <Link to="/destinations" className="nf-btn nf-btn-outline">
            <FaSearch /> Explore Destinations
          </Link>
        </div>

        <div className="nf-quick-links">
          <span>Or try one of these:</span>
          <div>
            <Link to="/packages">Packages</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faqs">FAQs</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;