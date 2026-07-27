import { Link } from "react-router-dom";
import { FaAward, FaGlobeAmericas, FaUsers, FaHeart, FaCheckCircle, FaMapMarkedAlt, FaHandshake, FaPlaneDeparture, FaShieldAlt } from "react-icons/fa";

import "./About.css";

const STATS = [
  { icon: <FaAward />, value: "15+", label: "Years of Excellence" },
  { icon: <FaGlobeAmericas />, value: "40+", label: "Destinations Curated" },
  { icon: <FaUsers />, value: "8,500+", label: "Happy Travelers" },
  { icon: <FaHeart />, value: "98%", label: "Return Guest Rate" }
];

const VALUES = [
  {
    icon: <FaMapMarkedAlt />,
    title: "Personal Travel Design",
    text: "Every itinerary is shaped around you — not a template. We start with a conversation, not a catalog."
  },
  {
    icon: <FaHandshake />,
    title: "Handpicked Partners",
    text: "We work only with properties and guides we've personally vetted for quality, safety, and character."
  },
  {
    icon: <FaPlaneDeparture />,
    title: "Seamless Logistics",
    text: "Private transfers, timed reservations, and 24/7 support so the only thing you plan is what to enjoy next."
  },
  {
    icon: <FaShieldAlt />,
    title: "Honest Pricing",
    text: "No hidden fees, no bait-and-switch packages. What you see at checkout is what you pay."
  }
];

const TEAM = [
  { name: "Ariana Kapoor", role: "Founder & Lead Travel Designer", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Marcus Webb", role: "Head of Destination Partnerships", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sofia Delgado", role: "Guest Experience Director", photo: "https://randomuser.me/api/portraits/women/68.jpg" }
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)" }}>
      <div className="about-hero-overlay" />
      <div className="container">
        <span>Our Story</span>
          <h1>Crafting Journeys Worth Remembering</h1>
          <p>
            TravelerGuide was founded on a simple idea: luxury travel should feel personal, not
            transactional. For over 15 years, we've been designing journeys that go beyond the
            postcard — matching discerning travelers with the world's most extraordinary places.
          </p>
        </div>
      </section>

      <section className="section about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {STATS.map((stat) => (
              <div className="about-stat-card" key={stat.label}>
                <div className="about-stat-icon">{stat.icon}</div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container about-story-layout">
          <div
            className="about-story-image"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80)" }}
          >
            <div className="about-story-badge">
              <span>15+</span>
              <small>Years of Excellence</small>
            </div>
          </div>

          <div className="about-story-content">
            <span className="about-eyebrow">Why We Started</span>
            <h2>Travel Should Feel Like It Was Made For You</h2>
            <p>
              We started TravelerGuide after one too many "luxury" trips that felt like everyone
              else's luxury trip — same hotels, same itineraries, same generic recommendations.
              We believed travelers deserved better: journeys designed around their pace, their
              interests, and the experiences that actually mean something to them.
            </p>
            <p>
              Today, our team works directly with boutique properties, private guides, and local
              experts across 40+ destinations to build trips our clients remember for years, not
              just weeks.
            </p>

            <ul className="about-checklist">
              <li><FaCheckCircle /> Dedicated travel designer for every booking</li>
              <li><FaCheckCircle /> Curated partner network, personally vetted</li>
              <li><FaCheckCircle /> 24/7 concierge support during your trip</li>
            </ul>

            <Link to="/destinations" className="about-story-btn">
              Explore Our Destinations
            </Link>
          </div>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <div className="section-title">
            <span>What We Stand For</span>
            <h2>The TravelerGuide Difference</h2>
            <p>Four principles that shape every journey we design.</p>
          </div>

          <div className="about-values-grid">
            {VALUES.map((value) => (
              <div className="about-value-card" key={value.title}>
                <div className="about-value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-team-section">
        <div className="container">
          <div className="section-title">
            <span>Meet The Team</span>
            <h2>The People Behind Your Journey</h2>
          </div>

          <div className="about-team-grid">
            {TEAM.map((member) => (
            <div className="about-team-card" key={member.name}>
                <img
                  className="about-team-photo"
                  src={member.photo}
                  alt={member.name}
                />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container about-cta-content">
          <h2>Ready to Start Planning?</h2>
          <p>Tell us where you'd like to go — we'll handle the rest.</p>
          <Link to="/contact" className="about-cta-btn">Get in Touch</Link>
        </div>
      </section>
    </main>
  );
}

export default About;