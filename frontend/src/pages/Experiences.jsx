import { Link } from "react-router-dom";
import {
  FaMountain,
  FaUmbrellaBeach,
  FaLandmark,
  FaUtensils,
  FaCamera,
  FaHiking,
  FaArrowRight,
  FaGlobeAmericas,
  FaUsers,
  FaAward,
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaPlaneDeparture
} from "react-icons/fa";

import "./Experiences.css";

const STATS = [
  { icon: <FaGlobeAmericas />, value: "60+", label: "Destinations" },
  { icon: <FaUsers />, value: "12K+", label: "Travelers Hosted" },
  { icon: <FaAward />, value: "9.4/10", label: "Average Rating" }
];

const EXPERIENCES = [
  {
    number: "01",
    icon: <FaMountain />,
    title: "Mountain Adventures",
    description:
      "Trek through alpine trails, summit iconic peaks, and wake up to views that redefine breathtaking. Our mountain routes are built around acclimatization, safety, and the kind of silence you only find above the tree line.",
    highlights: ["Guided treks", "High-altitude camps", "Local mountain guides", "Small group sizes"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
  },
  {
    number: "02",
    icon: <FaUmbrellaBeach />,
    title: "Beach & Island Escapes",
    description:
      "Private beach cabanas, turquoise waters, and sunsets that make every evening feel like a postcard. From quiet island hideaways to lively coastal towns, we match the shoreline to your pace.",
    highlights: ["Private cabanas", "Snorkeling & diving", "Sunset cruises", "Beachfront stays"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
  },
  {
    number: "03",
    icon: <FaLandmark />,
    title: "Cultural Immersion",
    description:
      "Wander centuries-old streets, visit local artisans, and experience destinations through the eyes of those who call them home. Every itinerary includes time built in for the unplanned.",
    highlights: ["Local artisan visits", "Historic walking tours", "Homestay options", "Language basics included"],
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80"
  },
  {
    number: "04",
    icon: <FaUtensils />,
    title: "Culinary Journeys",
    description:
      "From street food markets to intimate chef's tables, taste your way through every destination we curate. Food is the fastest way into a place — we build entire days around it.",
    highlights: ["Street food tours", "Cooking classes", "Chef-led tastings", "Market visits"],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
  },
  {
    number: "05",
    icon: <FaCamera />,
    title: "Photography Expeditions",
    description:
      "Chase golden hour across dramatic landscapes with routes designed around the world's most photogenic moments, timed to the light and led by people who know exactly where to stand.",
    highlights: ["Golden hour routes", "Small group sizes", "Pro photographer guides", "Editing workshops"],
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=80"
  },
  {
    number: "06",
    icon: <FaHiking />,
    title: "Adventure & Wildlife",
    description:
      "Safari drives, jungle treks, and encounters with nature at its most untouched and extraordinary — planned with conservation-focused operators who put the wildlife first.",
    highlights: ["Safari game drives", "Jungle trekking", "Conservation-led tours", "Expert naturalists"],
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1200&q=80"
  }
];

const PROCESS = [
  { icon: <FaMapMarkedAlt />, title: "Tell Us Your Style", description: "Pick the experiences that excite you most, from mountains to culinary trails." },
  { icon: <FaCalendarCheck />, title: "We Build Your Route", description: "Our planners shape an itinerary around your pace, budget, and dates." },
  { icon: <FaPlaneDeparture />, title: "You Travel, We Handle the Rest", description: "Bookings, guides, and logistics are sorted before you land." }
];

function Experiences() {
  return (
    <main className="xp-page">
      <section
        className="xp-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80)" }}
      >
        <div className="xp-hero-overlay" />
        <div className="container">
          <span>What We Offer</span>
          <h1>Curated Experiences, Not Just Destinations</h1>
          <p>
            Every journey we design centers on the moments that stay with you — not just the places
            you visit, but the experiences that define them.
          </p>

          <div className="xp-stats">
            {STATS.map((stat) => (
              <div className="xp-stat" key={stat.label}>
                <div className="xp-stat-icon">{stat.icon}</div>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section xp-grid-section">
        <div className="container">
          <div className="xp-section-heading">
            <span>Explore By Style</span>
            <h2>Pick the Way You Want to Travel</h2>
            <p>Six ways to experience the world, each built around a different kind of traveler.</p>
          </div>

          <div className="xp-feature-list">
            {EXPERIENCES.map((exp, index) => (
              <div className={`xp-feature ${index % 2 === 1 ? "xp-feature-reverse" : ""}`} key={exp.title}>
                <div className="xp-feature-image">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/1200x900/121c2b/C8A96A?text=Traveler+Guide";
                    }}
                  />
                  <span className="xp-feature-number">{exp.number}</span>
                </div>

                <div className="xp-feature-body">
                  <div className="xp-feature-icon">{exp.icon}</div>
                  <h3>{exp.title}</h3>
                  <p>{exp.description}</p>

                  <div className="xp-feature-tags">
                    {exp.highlights.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <Link to="/destinations" className="xp-feature-link">
                    Explore Trips <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="xp-process">
        <div className="container">
          <div className="xp-section-heading xp-section-heading-light">
            <span>How It Works</span>
            <h2>From Idea to Itinerary</h2>
          </div>

          <div className="xp-process-grid">
            {PROCESS.map((step, i) => (
              <div className="xp-process-card" key={step.title}>
                <span className="xp-process-step">Step {i + 1}</span>
                <div className="xp-process-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="xp-cta">
        <div className="container xp-cta-content">
          <h2>Ready to Design Your Own Experience?</h2>
          <p>Every trip we plan is tailored to what excites you most.</p>
          <div className="xp-cta-actions">
            <Link to="/contact" className="xp-cta-btn">Start Planning</Link>
            <Link to="/destinations" className="xp-cta-btn xp-cta-btn-outline">Browse Destinations</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Experiences;