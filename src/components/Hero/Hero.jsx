import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      <div className="container hero-container">

        <div className="hero-content">

          <span className="hero-tag">
            LUXURY TRAVEL EXPERIENCE
          </span>

          <h1>
            Discover
            Extraordinary
            Destinations
          </h1>

          <p>
            Escape to the world's most breathtaking destinations with curated
            luxury experiences designed for unforgettable memories and timeless
            adventures.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Explore Collection
            </button>

            <button className="secondary-btn">
              Book Consultation
            </button>

          </div>

        </div>

      </div>

      <div className="scroll-indicator">
        Scroll
      </div>

    </section>
  );
}

export default Hero;