import "./DestinationsHero.css";
import heroImage from "../../assets/images/destinations/destinations-hero.jpg";

function DestinationsHero({ children }) {
  return (
    <section
      className="destinations-hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="container">

        <div className="destinations-hero-content">

          <span>Luxury Collection</span>

          <h1>
            Explore Extraordinary Destinations
          </h1>

          <p>
            Discover handpicked luxury escapes across the world's most beautiful destinations.
          </p>

        </div>

        {children}

      </div>
    </section>
  );
}

export default DestinationsHero;