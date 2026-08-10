import { Link } from "react-router-dom";
import "./PopularDestinations.css";

export default function PopularDestinations({ destinations = [], loading }) {
  if (!loading && destinations.length === 0) return null;
  
  return (
    <section className="destinations">
      <div className="container">
        <div className="section-heading">
          <span>Luxury Destinations</span>
          <h2>Explore The World's Finest Escapes</h2>
          <p>Discover handpicked destinations offering unforgettable experiences, breathtaking landscapes and world-class hospitality.</p>
        </div>

        <div className="destination-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="destination-card" style={{ background: "#121c2d" }} />
              ))
            : destinations.map((destination) => (
                <Link
                  key={destination.id}
                  to={`/destinations/${destination.slug}`}
                  className="destination-card"
                >
                  <img
                    src={destination.image}
                    alt={destination.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/800x600/1a1d21/6c7a91?text=No+Image";
                    }}
                  />
                  <div className="destination-overlay">
                    <div>
                      <small>{destination.country}</small>
                      <h3>{destination.title}</h3>
                      <p>{destination.category} · {destination.duration}</p>
                    </div>
                    <button type="button">Explore</button>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}