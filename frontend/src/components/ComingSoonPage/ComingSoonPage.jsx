import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaBell } from "react-icons/fa";
import toast from "react-hot-toast";

import "./ComingSoonPage.css";

function ComingSoonPage({ title, description, image }) {
  const [email, setEmail] = useState("");

  const handleNotify = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.success("Thanks! We'll notify you when this page goes live.");
    setEmail("");
  };

  return (
    <main
      className="coming-soon-page"
      style={{ backgroundImage: `url(${image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"})` }}
    >
      <div className="coming-soon-overlay" />

      <div className="container coming-soon-content">
        <div className="coming-soon-icon">
          <FaBell />
        </div>

        <span className="coming-soon-eyebrow">Coming Soon</span>
        <h1>{title}</h1>
        <div className="coming-soon-divider" />
        <p>{description || "We're putting the finishing touches on this page. Check back soon."}</p>

        <form className="coming-soon-form" onSubmit={handleNotify}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Notify Me</button>
        </form>

        <Link to="/" className="coming-soon-back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </main>
  );
}

export default ComingSoonPage;