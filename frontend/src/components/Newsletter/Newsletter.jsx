import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-overlay"></div>

      <div className="container newsletter-content">
        <span>Stay Inspired</span>

        <h2>
          Receive Exclusive
          <br />
          Luxury Travel Offers
        </h2>

        <p>
          Join our community and receive curated destinations, luxury travel
          inspiration and exclusive member-only experiences.
        </p>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;