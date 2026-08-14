import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaSuitcaseRolling,
  FaCreditCard,
  FaUserCircle,
  FaGlobeAmericas,
  FaShieldAlt,
  FaGift,
  FaChevronRight,
  FaChevronDown,
  FaEnvelope,
  FaComments,
  FaPhoneAlt,
  FaFire
} from "react-icons/fa";

import "./HelpCenter.css";

const CATEGORIES = [
  {
    icon: <FaSuitcaseRolling />,
    title: "Bookings & Reservations",
    description: "Making, modifying, or understanding your booking",
    topics: [
      "How to book a trip",
      "Changing your travel dates",
      "Guest checkout vs. account booking",
      "Cancelling a reservation",
      "Group and multi-guest bookings"
    ]
  },
  {
    icon: <FaCreditCard />,
    title: "Payments & Billing",
    description: "Payment methods, receipts, and refunds",
    topics: [
      "Accepted payment methods",
      "Understanding your invoice",
      "Requesting a refund",
      "Failed or pending payments",
      "Currency and pricing questions"
    ]
  },
  {
    icon: <FaUserCircle />,
    title: "Account & Profile",
    description: "Managing your account settings",
    topics: [
      "Resetting your password",
      "Updating your profile photo",
      "Viewing your booking history",
      "Changing your email address",
      "Deleting your account"
    ]
  },
  {
    icon: <FaGlobeAmericas />,
    title: "Travel Planning",
    description: "Destination info, documents, and preparation",
    topics: [
      "Visa and passport requirements",
      "What's included in a package",
      "Cancellation policies",
      "Best time to visit a destination",
      "Packing and travel tips"
    ]
  },
  {
    icon: <FaShieldAlt />,
    title: "Trust & Safety",
    description: "Keeping your account and trips secure",
    topics: [
      "Recognizing booking scams",
      "Two-factor authentication",
      "Reporting a suspicious listing",
      "Travel insurance options"
    ]
  },
  {
    icon: <FaGift />,
    title: "Offers & Rewards",
    description: "Discounts, coupons, and loyalty perks",
    topics: [
      "Applying a coupon code",
      "Why a coupon isn't working",
      "Referral rewards program",
      "Seasonal sale schedule"
    ]
  }
];

const POPULAR_ARTICLES = [
  "How to book a trip",
  "Requesting a refund",
  "Changing your travel dates",
  "Resetting your password",
  "Visa and passport requirements"
];

const FAQS = [
  {
    q: "How far in advance should I book my trip?",
    a: "We recommend booking at least 4-6 weeks ahead for popular destinations, especially during peak season, to lock in availability and the best pricing."
  },
  {
    q: "Can I cancel or reschedule after booking?",
    a: "Yes. Go to My Bookings in your account, select the trip, and choose Cancel or Request Change. Refund eligibility depends on the destination's cancellation policy shown at checkout."
  },
  {
    q: "Do I need an account to book?",
    a: "No, guest checkout is available for all bookings. Creating an account just lets you track bookings, save favorites, and check out faster next time."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, along with popular regional payment methods shown at checkout depending on your location."
  },
  {
    q: "How do I contact my trip provider directly?",
    a: "Provider contact details are included in your booking confirmation email and are also visible under My Bookings once your reservation is confirmed."
  }
];

function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const query = search.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!query) return CATEGORIES;

    return CATEGORIES
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter((t) => t.toLowerCase().includes(query))
      }))
      .filter(
        (cat) =>
          cat.topics.length > 0 ||
          cat.title.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query)
      );
  }, [query]);

  const hasResults = filteredCategories.length > 0;

  return (
    <main className="hc-page">
      <section
        className="hc-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1600&q=80)" }}
      >
        <div className="hc-hero-overlay" />
        <div className="container">
          <span>Support</span>
          <h1>How Can We Help?</h1>
          <p>Search our help topics or browse by category below.</p>

          <div className="hc-search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!query && (
            <div className="hc-popular-tags">
              <span>Popular:</span>
              {POPULAR_ARTICLES.map((a) => (
                <button
                  type="button"
                  key={a}
                  className="hc-popular-tag"
                  onClick={() => setSearch(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section hc-categories-section">
        <div className="container">
          {!hasResults ? (
            <div className="hc-no-results">
              <FaSearch />
              <h3>No results for "{search}"</h3>
              <p>Try a different keyword, or contact our support team below.</p>
            </div>
          ) : (
            <div className="hc-categories-grid">
              {filteredCategories.map((cat) => (
                <div className="hc-category-card" key={cat.title}>
                  <div className="hc-category-icon">{cat.icon}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>

                  <ul>
                    {cat.topics.map((topic) => (
                      <li key={topic}>
                        <FaChevronRight />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section hc-faq-section">
        <div className="container">
          <div className="hc-section-heading">
            <span>FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="hc-faq-list">
            {FAQS.map((item, i) => (
              <div className={`hc-faq-item ${openFaq === i ? "is-open" : ""}`} key={item.q}>
                <button
                  type="button"
                  className="hc-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <FaChevronDown />
                </button>

                {openFaq === i && <p className="hc-faq-answer">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-contact-cta">
        <div className="container">
          <div className="hc-contact-content">
            <h2>Still Need Help?</h2>
            <p>Our support team is here for you, every day of the week.</p>
          </div>

          <div className="hc-contact-grid">
            <div className="hc-contact-card">
              <FaEnvelope className="hc-contact-icon" />
              <h4>Email Us</h4>
              <p>Get a reply within 24 hours</p>
              <Link to="/contact" className="hc-contact-link">support@travelerguide.com</Link>
            </div>

            <div className="hc-contact-card">
              <FaComments className="hc-contact-icon" />
              <h4>Live Chat</h4>
              <p>Chat with our team in real time</p>
              <Link to="/contact" className="hc-contact-link">Start a Chat</Link>
            </div>

            <div className="hc-contact-card">
              <FaPhoneAlt className="hc-contact-icon" />
              <h4>Call Us</h4>
              <p>Mon-Sun, 8am-10pm</p>
              <Link to="/contact" className="hc-contact-link">+1 (800) 555-0199</Link>
            </div>
          </div>

          <Link to="/contact" className="hc-contact-btn">
            <FaFire /> Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HelpCenter;