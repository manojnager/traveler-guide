import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";

import "./Contact.css";

const CONTACT_INFO = [
  { icon: <FaMapMarkerAlt />, label: "Our Office", value: "Jaipur, Rajasthan, India" },
  { icon: <FaPhoneAlt />, label: "Call Us", value: "+91 98765 43210" },
  { icon: <FaEnvelope />, label: "Email Us", value: "hello@travelerguide.com" },
  { icon: <FaClock />, label: "Working Hours", value: "Mon – Sat: 9 AM – 7 PM" }
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "For a fully personalized itinerary, we recommend reaching out at least 4–6 weeks before your travel dates, though we can accommodate shorter timelines when possible."
  },
  {
    q: "Do you offer custom itineraries?",
    a: "Yes — every journey we design is tailored to you. Reach out with your interests and travel dates, and our team will build a proposal around them."
  },
  {
    q: "What's included in the price shown?",
    a: "Listed prices are per person and typically cover accommodation and curated experiences. Flights and some meals may be separate — full details are confirmed before booking."
  },
  {
    q: "Can I request changes after booking?",
    a: "Absolutely. Reach out to your travel designer any time before departure and we'll do our best to accommodate changes based on availability."
  },
  {
    q: "Do you help with group or family trips?",
    a: "Yes — we regularly design itineraries for families, friend groups, and larger parties, with logistics handled for everyone together."
  }
];

const BUDGET_OPTIONS = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $10,000", "$10,000+"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  travelDate: "",
  guests: "",
  budget: "",
  message: ""
};

function ContactUs() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast.success("Thanks for reaching out! We'll get back to you within 24 hours.");
      setForm(initialForm);
      setSubmitting(false);
    }, 700);
  };

  return (
    <main className="contact-page">
      <section
        className="contact-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)" }}
      >
        <div className="contact-hero-overlay" />
        <div className="container">
          <span>Get In Touch</span>
          <h1>We'd Love to Plan Your Next Journey</h1>
          <p>
            Have a destination in mind, or not sure where to start? Reach out and one of our
            travel designers will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="section contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {CONTACT_INFO.map((item) => (
              <div className="contact-info-card" key={item.label}>
                <div className="contact-info-icon">{item.icon}</div>
                <span className="contact-info-label">{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-main-section">
        <div className="container contact-layout">
          <div className="contact-form-card">
            <span className="about-eyebrow">Send a Message</span>
            <h2>Tell Us About Your Trip</h2>

            <form onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="contact-field">
                  <label>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (___) ___-____" />
                </div>
                <div className="contact-field">
                  <label>Destination of Interest</label>
                  <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Santorini, Maldives" />
                </div>
              </div>

              <div className="contact-form-row contact-form-row-triple">
                <div className="contact-field">
                  <label>Preferred Travel Date</label>
                  <input type="date" name="travelDate" value={form.travelDate} onChange={handleChange} />
                </div>
                <div className="contact-field">
                  <label>Number of Travelers</label>
                  <input type="number" min="1" name="guests" value={form.guests} onChange={handleChange} placeholder="2" />
                </div>
                <div className="contact-field">
                  <label>Budget Range</label>
                  <select name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Select range</option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label>Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your dream trip — interests, must-sees, anything helps."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <aside className="contact-faq-card">
            <span className="about-eyebrow">FAQs</span>
            <h2>Common Questions</h2>

            <div className="contact-faq-accordion">
              {FAQS.map((faq, index) => (
                <div className={`contact-faq-accordion-item ${openFaq === index ? "is-open" : ""}`} key={faq.q}>
                  <button
                    type="button"
                    className="contact-faq-accordion-trigger"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span className="contact-faq-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="contact-faq-question">{faq.q}</span>
                    <FaChevronDown className="contact-faq-chevron" />
                  </button>

                  <div className="contact-faq-accordion-body">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-faq-cta">
              <p>Still have questions?</p>
              <a href="mailto:hello@travelerguide.com">Email our team directly →</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="contact-map-wrapper">
          <iframe
            title="TravelerGuide Office Location"
            src="https://www.google.com/maps?q=Jaipur,Rajasthan,India&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="contact-map-overlay-card">
          <span className="about-eyebrow">Visit Us</span>
          <h3>TravelerGuide Headquarters</h3>
          <p>Jaipur, Rajasthan, India</p>
          
           <a href="https://www.google.com/maps?q=Jaipur,Rajasthan,India"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-map-link"
          >
            Get Directions →
          </a>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;