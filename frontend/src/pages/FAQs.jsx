import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

import "./FAQs.css";

const FAQ_CATEGORIES = [
  {
    category: "Booking & Reservations",
    items: [
      {
        q: "How far in advance should I book my trip?",
        a: "For a fully personalized itinerary, we recommend reaching out at least 4–6 weeks before your travel dates. Popular destinations during peak season may require even earlier planning."
      },
      {
        q: "Can I book without creating an account?",
        a: "Yes — you can book as a guest using just your name, email, and phone number. We'll set up a lightweight account behind the scenes so you can track your booking."
      },
      {
        q: "Can I modify my booking after it's confirmed?",
        a: "Reach out to us via the Contact page any time before departure and we'll do our best to accommodate changes based on availability."
      }
    ]
  },
  {
    category: "Payments & Pricing",
    items: [
      {
        q: "What's included in the price shown?",
        a: "Listed prices are per person and typically cover accommodation and curated experiences. Flights and some meals may be separate — full details are confirmed before booking."
      },
      {
        q: "What payment methods do you accept?",
        a: "We currently support Credit Card, PayPal, and Bank Transfer at checkout."
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. We never store raw payment details — all transactions are processed securely at checkout."
      }
    ]
  },
  {
    category: "Cancellations & Refunds",
    items: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellation terms vary by destination and are listed on each destination's booking page before you confirm. Check the specific policy shown at checkout."
      },
      {
        q: "How do I cancel a booking?",
        a: "Contact our support team through the Contact page with your booking reference, and we'll process your cancellation according to the applicable policy."
      }
    ]
  },
  {
    category: "Travel Planning",
    items: [
      {
        q: "Do you offer custom itineraries?",
        a: "Yes — every journey we design can be tailored. Reach out with your interests and travel dates, and our team will build a proposal around them."
      },
      {
        q: "Do you help with group or family trips?",
        a: "Yes — we regularly design itineraries for families, friend groups, and larger parties, with logistics handled for everyone together."
      }
    ]
  }
];

function FAQs() {
  const [openIndex, setOpenIndex] = useState("0-0");

  return (
    <main className="faqs-page">
      <section
        className="faqs-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)" }}
      >
        <div className="faqs-hero-overlay" />
        <div className="container">
          <span>Support</span>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about booking, payments, and travel planning with us.</p>
        </div>
      </section>

      <section className="section faqs-content">
        <div className="container faqs-container">
          {FAQ_CATEGORIES.map((group, groupIndex) => (
            <div className="faqs-category" key={group.category}>
              <h2>{group.category}</h2>

              <div className="faqs-list">
                {group.items.map((item, itemIndex) => {
                  const key = `${groupIndex}-${itemIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div className={`faqs-item ${isOpen ? "is-open" : ""}`} key={key}>
                      <button
                        type="button"
                        className="faqs-trigger"
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                      >
                        <span>{item.q}</span>
                        <FaChevronDown className="faqs-chevron" />
                      </button>

                      <div className="faqs-answer">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="faqs-cta">
            <h3>Still have questions?</h3>
            <p>Our team is happy to help with anything not covered here.</p>
            <Link to="/contact" className="faqs-cta-btn">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FAQs;